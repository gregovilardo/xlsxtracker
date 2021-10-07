from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import serializers, viewsets
from tracker.models import TradeOnHold, Hold, TradeOnHold
from tracker.serializers import TradeOnHoldSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
# from rest_framework.authtoken.models import Token
import requests
from tracker.models import Trade
from tracker.serializers import TradeSerializer, HoldSerializer, TradeOnHoldSerializer
from django.http import Http404
from rest_framework.parsers import MultiPartParser, FormParser
from .tracker import track_coins
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from requests import Request, Session
import json
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication, JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


API = "27ac0e7365436788f328abf156a9ed054a8d8196"


class TradeList(APIView):
    def get(self, request, format=None):

        """GET request for all the trades on the API"""
        access_token = RefreshToken(token=request.COOKIES.get("refresh"), verify=True)
        try:
            user = JWTTokenUserAuthentication.get_user(self, validated_token=access_token)
        except ValidationError as v:
            print("validation error", v)
        request.user = User.objects.get(pk=user.id)
        
        trades = Trade.objects.filter(owner=request.user)
        serializer = TradeSerializer(trades, many=True)
        trades = serializer.data
        coins = []
        # i don't add the logo in this loop because that would mean a lot of calls to the API, and i can only do once per second
        for trade in trades:
            coins.append(trade["pair"][:len(trade["pair"])-4])
        coins = list(dict.fromkeys(coins))
        coins_str = ",".join(coins)

        url = f'https://api.nomics.com/v1/currencies/ticker?key={API}&ids={coins_str}&interval=1d,30d&convert=EUR&per-page=100&page=1'

        session = Session()
        try:
            response = session.get(url)
            data = json.loads(response.text)
        except (ConnectionError, Timeout, TooManyRedirects) as e:
            print(e)

        for i in range(len(trades)):
            for j in range(len(data)):
                if trades[i]["pair"][:len(trades[i]["pair"])-4] == data[j]["id"]:
                    trades[i]["logo"] = data[j]["logo_url"]

        return Response(trades, status=status.HTTP_200_OK)


class HoldList(APIView):
    def get(self, request, format=None):
        """GET request for all the holds on the API"""
        access_token = RefreshToken(token=request.COOKIES.get("refresh"), verify=True)
        try:
            user = JWTTokenUserAuthentication.get_user(self, validated_token=access_token)
        except ValidationError as v:
            print("validation error", v)
        request.user = User.objects.get(pk=user.id)


        holds = Hold.objects.filter(owner=request.user)
        serializer = HoldSerializer(holds, many=True)
        holds = serializer.data
        coins = []
        # i don't add the logo in this loop because that would mean a lot of calls to the API, and i can only do once per second
        for hold in holds:
            coins.append(hold["pair"][:len(hold["pair"])-4])
        coins = list(dict.fromkeys(coins))
        coins_str = ",".join(coins)

        url = f'https://api.nomics.com/v1/currencies/ticker?key={API}&ids={coins_str}&interval=1d,30d&convert=USD&per-page=100&page=1'

        session = Session()
        try:
            response = session.get(url)
            data = json.loads(response.text)
        except (ConnectionError, Timeout, TooManyRedirects) as e:
            print(e)

        for i in range(len(holds)):
            for j in range(len(data)):
                if holds[i]["pair"][:len(holds[i]["pair"])-4] == data[j]["id"]:
                    holds[i]["logo"] = data[j]["logo_url"]
                    holds[i]["price"] = data[j]["price"]
                    holds[i]["market_cap"] = data[j]["market_cap"]

        # print(json.dumps(data, indent=4))

        return Response(holds, status=status.HTTP_200_OK)


class TradeOnHoldList(APIView):
    def get(self, request, format=None):
        """GET request for all the holds on the API"""
        access_token = RefreshToken(token=request.COOKIES.get("refresh"), verify=True)
        try:
            user = JWTTokenUserAuthentication.get_user(self, validated_token=access_token)
        except ValidationError as v:
            print("validation error", v)
        request.user = User.objects.get(pk=user.id)



        trades_on_hold = TradeOnHold.objects.filter(owner=request.user)
        serializer = TradeOnHoldSerializer(trades_on_hold, many=True)
        trades_on_hold = serializer.data
        coins = []
        # i don't add the logo in this loop because that would mean a lot of calls to the API, and i can only do once per second
        for trade_on_hold in trades_on_hold:
            coins.append(trade_on_hold["pair"][:len(trade_on_hold["pair"])-4])
        coins = list(dict.fromkeys(coins))
        coins_str = ",".join(coins)

        url = f'https://api.nomics.com/v1/currencies/ticker?key={API}&ids={coins_str}&interval=1d,30d&convert=EUR&per-page=100&page=1'

        session = Session()
        try:
            response = session.get(url)
            data = json.loads(response.text)
        except (ConnectionError, Timeout, TooManyRedirects) as e:
            print(e)

        for i in range(len(trades_on_hold)):
            for j in range(len(data)):
                if trades_on_hold[i]["pair"][:len(trades_on_hold[i]["pair"])-4] == data[j]["id"]:
                    trades_on_hold[i]["logo"] = data[j]["logo_url"]


        return Response(trades_on_hold, status=status.HTTP_200_OK)


class TrackerList(APIView):
    """
    Creates all trades, holds, and trades on hold from xlsx file.
    """
    # parser_classes = (MultiPartParser, FormParser)
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        print(f"lasss coookies {request.COOKIES.get('refresh')}")
        file = request.stream.FILES["file"]
        result = track_coins(file)
        # for some reason in GET methos user exist, here in POST is anonymous, so i get it with the token
        access_token = RefreshToken(token=request.COOKIES.get("refresh"), verify=True)
        
        try:
            user = JWTTokenUserAuthentication.get_user(
                self, validated_token=access_token)
            request.user = user
        except ValidationError as v:
            print("validation error", v)

        """serialize trades"""
        for trade in result["trades"]:
            trade["owner"] = request.user.id
            serializer = TradeSerializer(data=trade)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        """serialize holds"""
        for hold in result["holds"]:
            # print(json.dumps(hold, indent=4))
            hold["owner"] = request.user.id
            serializer = HoldSerializer(data=hold)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        """serialize trades on hold"""
        for trade_on_hold in result["trades_on_hold"]:
            # print(json.dumps(trade_on_hold, indent=4))
            trade_on_hold["owner"] = request.user.id
            serializer = TradeOnHoldSerializer(data=trade_on_hold)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)


class TrackerDetail(APIView):
    """check this"""
    def get_object(self, pk):
        access_token = RefreshToken(token=self.request.COOKIES.get("refresh"), verify=True)
        try:
            user = JWTTokenUserAuthentication.get_user(self, validated_token=access_token)
        except ValidationError as v:
            print("validation error", v)
        self.request.user = User.objects.get(pk=user.id)

        try:
            trade = TradeOnHold.objects.get(pk=pk)
            if trade.owner == self.request.user:
                return trade
            else:
                raise Http404
        except TradeOnHold.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        trade = self.get_object(pk)
        serializer = TradeOnHoldSerializer(trade)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        trade = self.get_object(pk)
        serializer = TradeOnHoldSerializer(trade, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        trade = self.get_object(pk)
        trade.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




# token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
#         validated_token = JWTAuthentication.get_validated_token(
#             self, raw_token=token)
#         try:
#             user = JWTTokenUserAuthentication.get_user(
#                 self, validated_token=validated_token)
#             request.user = user
#         except ValidationError as v:
#             print("validation error", v)
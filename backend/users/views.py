from django.http.response import Http404
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from django.http import HttpResponse
from rest_framework.exceptions import ValidationError
import json
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication, JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User


# Register API


class RegisterAPI(generics.GenericAPIView):
	serializer_class = RegisterSerializer

	def post(self, request, *args, **kwargs):
		if len(request.data["password"]) < 8:
			return Response({"error": "Password must be at least 8 digits"}, status=status.HTTP_400_BAD_REQUEST)
		serializer = self.get_serializer(data=request.data)
		if serializer.is_valid():
			user = serializer.save()
			refresh = RefreshToken.for_user(user)
			user = UserSerializer(user, context=self.get_serializer_context()).data
			response = HttpResponse(json.dumps({"user": user}), content_type="application/json")
			response.set_cookie('refresh', str(refresh), httponly=True, max_age=57600)
			response.set_cookie('access', str(refresh.access_token), httponly=True, max_age=290)
			return response
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(generics.GenericAPIView):
	serializer_class = LoginSerializer


	def get(self, request, *args, **kwargs):
		if request.COOKIES.get("access"):
			token = request.COOKIES.get("access")
			try:
				validated_token = JWTAuthentication.get_validated_token(self, raw_token=token)
				user = JWTTokenUserAuthentication.get_user(self, validated_token=validated_token)
			except ValidationError as v:
				print("validation error", v)
			request.user = User.objects.get(pk=user.id)
			user = {
				"id":request.user.id,
				"username":request.user.username,
				"email":request.user.email
			}
			return HttpResponse(json.dumps({"user": user}), content_type="application/json")
		elif request.COOKIES.get("refresh"):
			"""yes it hasn't got much sense use the both tokens like this :) """
			access_token = RefreshToken(token=request.COOKIES.get("refresh"), verify=True)
			try:
				user = JWTTokenUserAuthentication.get_user(self, validated_token=access_token)
			except ValidationError as v:
				print("validation error", v)
			request.user = User.objects.get(pk=user.id)
			user = {
				"id":request.user.id,
				"username":request.user.username,
				"email":request.user.email
			}
			return HttpResponse(json.dumps({"user": user}), content_type="application/json")
		else:
			return HttpResponse(400)



	def post(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		"""put token in cookies and response with the user"""
		if serializer.is_valid():
			user = serializer.validated_data
			refresh = RefreshToken.for_user(user)
			user = UserSerializer(user, context=self.get_serializer_context()).data
			response = HttpResponse(json.dumps({"user": user}), content_type="application/json")
			response.set_cookie('refresh', str(refresh), httponly=True, max_age=57600)
			response.set_cookie('access', str(refresh.access_token), httponly=True, max_age=290)
			# response.set_cookie('user', UserSerializer(user, context=self.get_serializer_context()).data)
			# response.set_cookie('access', new_access_token, httponly=True)
			return response
			# return Response({
			#     "user": UserSerializer(user, context=self.get_serializer_context()).data,
			#     "refresh": str(refresh),
			#     "access": str(refresh.access_token)
			# }, status=status.HTTP_202_ACCEPTED)
		else:
			print(serializer)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

			# Get User API


class LogoutAPI(generics.GenericAPIView):
	def get(self, request, *args, **kwargs):
		response = HttpResponse()
		response.delete_cookie("access")
		response.delete_cookie("refresh")
		return response

class UserAPI(generics.RetrieveAPIView):
	permission_classes = [
		permissions.IsAuthenticated,
	]
	serializer_class = UserSerializer

	def get_object(self):
		return self.request.user

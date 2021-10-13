from rest_framework import serializers
from tracker.models import Trade, Hold, TradeOnHold
# from django.contrib.auth.models import User


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = "__all__"
# ['id', 'coin', 'start', 'end', 'profit_loss', 'percentage']

class HoldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hold
        fields = "__all__"

class TradeOnHoldSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeOnHold
        fields = "__all__"

class FileUploadSerializer(serializers.Serializer):
    # I set use_url to False so I don't need to pass file 
    # through the url itself - defaults to True if you need it
    file = serializers.FileField(use_url=False)
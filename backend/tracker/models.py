from django.db import models
import datetime
from django.contrib.auth.models import User
from django.db.models.deletion import SET_NULL
# Create your models here.

# date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
date = datetime.datetime.now()
class Trade(models.Model):
    owner = models.ForeignKey(User, related_name="trades", on_delete=models.CASCADE)
    pair = models.CharField(max_length=16, default="error")
    start = models.DateTimeField(default=date, auto_now=False, auto_now_add=False,)
    end = models.DateTimeField(default=date, auto_now=False, auto_now_add=False,)
    profit_loss = models.FloatField(max_length=20, default=0)
    percentage = models.FloatField(max_length=20, default=0)
    
    def __str__(self):
        return f"{self.pair} Gain: ${self.profit_loss}  %{self.percentage}"


class Hold(models.Model):
    owner = models.ForeignKey(User, related_name="holds", on_delete=models.CASCADE)
    pair = models.CharField(max_length=16, default="error")
    holding = models.FloatField(max_length=20, default=0)
    start_date = models.DateTimeField(default=date, auto_now=False, auto_now_add=False,)
    start_price = models.FloatField(max_length=20, default=0)
    start_total = models.FloatField(max_length=20, default=0)

    def __str__(self):
        return f"{self.pair} hold: ${self.holding}"


class TradeOnHold(models.Model):
    owner = models.ForeignKey(User, related_name="trades_on_hold", on_delete=models.CASCADE)
    pair = models.CharField(max_length=16, default="error")
    date = models.DateTimeField(default=date, auto_now=False, auto_now_add=False,)
    price = models.FloatField(max_length=20, default=0)
    ammount = models.FloatField(max_length=20, default=0)
    total = models.FloatField(max_length=20, default=0)
    profit_loss = models.FloatField(max_length=20, default=0)
    percentage = models.FloatField(max_length=20, default=0)
    
    def __str__(self):
        return f"{self.pair} Gain: ${self.profit_loss}  %{self.percentage}"
from django.contrib import admin
from .models import  Trade, Hold, TradeOnHold

admin.site.register(Trade)
admin.site.register(Hold)
admin.site.register(TradeOnHold)
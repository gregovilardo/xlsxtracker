from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from tracker import views

urlpatterns = [
    path('trades/', views.TradeList.as_view()),
    path('holds/', views.HoldList.as_view()),
    path('trades_on_hold/', views.TradeOnHoldList.as_view()),
    path('tracker/', views.TrackerList.as_view()),
    path('trade/<int:pk>/', views.TradeDetail.as_view()),
    path('delete/', views.Delete.as_view()),
]


urlpatterns = format_suffix_patterns(urlpatterns)
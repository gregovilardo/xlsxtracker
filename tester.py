from django.http import HttpResponse

cookie = HttpResponse.set_cookie(key="token", value="dsljhfgkljdfghkujdfgh")

print(cookie)
# print(C)
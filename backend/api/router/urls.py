from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('auth/', include('apps.users.auth.urls')),
    path('frontpage/', include('api.frontpage.urls')),
]

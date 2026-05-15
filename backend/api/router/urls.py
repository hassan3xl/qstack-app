from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('frontpage/', include('api.frontpage.urls')),

]

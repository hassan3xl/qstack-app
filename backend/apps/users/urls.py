from django.urls import path, include
from . import views

app_name = 'users'

urlpatterns = [
    # Authentication
    path('auth/', include('apps.users.auth.urls')),
    
    # User views
    path('dashboard/', views.user_dashboard, name='dashboard'),
    path('profile/', views.user_profile_edit, name='profile'),
    path('profile/edit/', views.user_profile_edit, name='profile_edit'),
    path('staff-profile/', views.staff_profile_view, name='staff_profile'),
    path('staff-profile/edit/', views.staff_profile_edit, name='staff_profile_edit'),
]

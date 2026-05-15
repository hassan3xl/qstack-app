from django.contrib import admin
from django.urls import path, include

from apps.core.health_check import HealthCheckView
from apps.users.views import home_redirect
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('api/', include('api.router.urls')),
    
    # Root redirect
    path('', home_redirect, name='home'),
    
    # Auth views
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/login/'), name='logout'),
    
    # Django template-based apps
    path('users/', include('apps.users.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('admin-panel/', include('apps.admin_panel.urls')),
]

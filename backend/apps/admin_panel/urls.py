from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    # Dashboard
    path('dashboard/', views.admin_dashboard, name='dashboard'),
    
    # Members
    path('members/', views.member_list, name='member_list'),
    path('members/<uuid:member_id>/', views.member_detail, name='member_detail'),
    path('members/<uuid:member_id>/edit/', views.member_edit, name='member_edit'),
    path('members/<uuid:member_id>/activate/', views.member_activate, name='member_activate'),
    path('members/<uuid:member_id>/suspend/', views.member_suspend, name='member_suspend'),
    
    # Jobs
    path('jobs/', views.job_list, name='job_list'),
    path('jobs/<uuid:job_id>/', views.job_detail, name='job_detail'),
    
    # Portfolios
    path('portfolios/', views.portfolio_list, name='portfolio_list'),
    path('portfolios/create/', views.portfolio_create, name='portfolio_create'),
    path('portfolios/<uuid:portfolio_id>/', views.portfolio_detail, name='portfolio_detail'),
    path('portfolios/<uuid:portfolio_id>/edit/', views.portfolio_edit, name='portfolio_edit'),
    path('portfolios/<uuid:portfolio_id>/delete/', views.portfolio_delete, name='portfolio_delete'),
    
    # Contacts
    path('contacts/', views.contact_list, name='contact_list'),
    path('contacts/<uuid:contact_id>/', views.contact_detail, name='contact_detail'),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .view import StaffViewSet, JobViewSet, PortfolioViewSet, ContactListCreateView

router = DefaultRouter()
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'jobs', JobViewSet, basename='jobs')
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', ContactListCreateView.as_view(), name='contact-list-create'),

]

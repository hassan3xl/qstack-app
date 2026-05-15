from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.models.staff import Staff
from apps.core.models.jobs import Job
from apps.core.models.portfolio import Portfolio
from apps.core.models.contact import Contact
from .serializers import (
    StaffSerializer,
    JobSerializer,
    PortfolioListSerializer,
    PortfolioCreateSerializer,
    ContactSerializer
)


class StaffViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    serializer_class = StaffSerializer

    def get_queryset(self):
        return Staff.objects.filter(
            active_status='active', 
            role__isnull=False
        ).exclude(role__name='admin')


class JobViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PortfolioCreateSerializer
        return PortfolioListSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Portfolio.objects.all()
        # Filter by status if provided
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Filter by pinned status
        pinned = self.request.query_params.get('pinned')
        if pinned:
            queryset = queryset.filter(is_pinned=pinned.lower() == 'true')
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        # Additional logic for portfolio creation if needed
        serializer.save()

class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

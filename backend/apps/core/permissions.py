from rest_framework.permissions import BasePermission, IsAdminUser


class IsAdmin(IsAdminUser):
    """Permission to check if user is admin."""
    pass


class IsStaff(BasePermission):
    """Permission to check if user is staff."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from apps.core.models import Staff, Role
from django.contrib.auth import get_user_model
User = get_user_model()
from apps.core.models.staff import Staff


@login_required
def home_redirect(request):
    """Redirect users to their respective dashboards."""
    if request.user.is_superuser or request.user.is_staff:
        return redirect('admin_panel:dashboard')
    return redirect('users:dashboard')

@login_required
def user_dashboard(request):
    """Display user profile and staff profile if applicable."""
    user = request.user
    staff_profile = None
    
    try:
        staff_profile = Staff.objects.get(user=user)
    except Staff.DoesNotExist:
        pass
    
    context = {
        'user': user,
        'staff_profile': staff_profile,
    }
    return render(request, 'users/dashboard.html', context)


@login_required
@require_http_methods(["GET", "POST"])
def user_profile_edit(request):
    """Edit user profile information."""
    user = request.user
    
    if request.method == 'POST':
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()
        messages.success(request, 'Profile updated successfully.')
        return redirect('user_dashboard')
    
    context = {
        'user': user,
    }
    return render(request, 'users/profile_edit.html', context)


@login_required
def staff_profile_view(request):
    """Display staff profile."""
    try:
        staff_profile = Staff.objects.get(user=request.user)
    except Staff.DoesNotExist:
        messages.error(request, 'Staff profile not found.')
        return redirect('user_dashboard')
    
    context = {
        'staff_profile': staff_profile,
    }
    return render(request, 'users/staff_profile.html', context)


@login_required
@require_http_methods(["GET", "POST"])
def staff_profile_edit(request):
    """Edit staff profile information."""
    try:
        staff_profile = Staff.objects.get(user=request.user)
    except Staff.DoesNotExist:
        messages.error(request, 'Staff profile not found.')
        return redirect('user_dashboard')
    
    if request.method == 'POST':
        staff_profile.bio = request.POST.get('bio', staff_profile.bio)
        staff_profile.role_id = request.POST.get('role', staff_profile.role_id)
        
        # Handle avatar upload
        if 'avatar' in request.FILES:
            staff_profile.avatar = request.FILES['avatar']
        
        staff_profile.save()
        messages.success(request, 'Staff profile updated successfully.')
        return redirect('staff_profile_view')
    
    roles = Role.objects.all()
    context = {
        'staff_profile': staff_profile,
        'roles': roles,
    }
    return render(request, 'users/staff_profile_edit.html', context)

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from apps.core.models import Staff, Role
from django.contrib.auth import get_user_model
User = get_user_model()
from apps.core.models.staff import Staff
from apps.notifications.notification_services import NotificationService


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
    """Edit user profile information, including staff details if applicable."""
    user = request.user
    staff_profile = None
    try:
        staff_profile = Staff.objects.get(user=user)
    except Staff.DoesNotExist:
        pass
        
    if request.method == 'POST':
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()
        
        # Save staff profile details if the user is a staff member
        if staff_profile:
            staff_profile.bio = request.POST.get('bio', '')
            
            # Handle avatar upload
            if 'avatar' in request.FILES:
                staff_profile.avatar = request.FILES['avatar']
            elif request.POST.get('remove_avatar') == 'true':
                staff_profile.avatar.delete(save=False)
                staff_profile.avatar = None
                
            staff_profile.save()
            
            # Handle skills (many-to-many relationship)
            from apps.core.models.staff import Skill, Social
            skill_ids = request.POST.getlist('skills')
            staff_profile.skills.set(Skill.objects.filter(id__in=skill_ids))
            
            # Handle social links
            for platform, _ in Social.PLATFORM_CHOICES:
                url = request.POST.get(f'social_{platform}', '').strip()
                if url:
                    Social.objects.update_or_create(
                        staff=staff_profile,
                        platform=platform,
                        defaults={'url': url}
                    )
                else:
                    Social.objects.filter(staff=staff_profile, platform=platform).delete()
        
        # Trigger real-time notification
        try:
            NotificationService.send_notification(
                recipient=user,
                actor=None,
                title="Profile Updated",
                message="You have successfully updated your profile information.",
                target_obj=user,
                category="system_alert",
                type="success"
            )
        except Exception as e:
            print(f"Failed to send profile update notification: {e}")
            
        messages.success(request, 'Profile updated successfully.')
        return redirect('users:dashboard')
        
    # GET request: fetch skills and social links for edit form if staff
    skills = None
    socials_dict = {}
    if staff_profile:
        from apps.core.models.staff import Skill, Social
        skills = Skill.objects.all()
        socials = Social.objects.filter(staff=staff_profile)
        for s in socials:
            socials_dict[s.platform] = s.url
    
    context = {
        'user': user,
        'staff_profile': staff_profile,
        'skills': skills,
        'socials': socials_dict,
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
        return redirect('users:dashboard')
    
    if request.method == 'POST':
        staff_profile.bio = request.POST.get('bio', staff_profile.bio)
        staff_profile.role_id = request.POST.get('role', staff_profile.role_id)
        
        # Handle avatar upload
        if 'avatar' in request.FILES:
            staff_profile.avatar = request.FILES['avatar']
        
        staff_profile.save()
        
        # Trigger real-time notification
        try:
            NotificationService.send_notification(
                recipient=request.user,
                actor=None,
                title="Staff Profile Updated",
                message="Your staff profile details have been successfully updated.",
                target_obj=staff_profile,
                category="system_alert",
                type="success"
            )
        except Exception as e:
            print(f"Failed to send staff profile update notification: {e}")
            
        messages.success(request, 'Staff profile updated successfully.')
        return redirect('users:staff_profile')
    
    roles = Role.objects.all()
    context = {
        'staff_profile': staff_profile,
        'roles': roles,
    }
    return render(request, 'users/staff_profile_edit.html', context)

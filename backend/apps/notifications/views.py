from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from apps.core.models import Notification


@login_required
def notification_list(request):
    """Display all notifications for the current user."""
    notifications = Notification.objects.filter(recipient=request.user).order_by('-created_at')
    unread_count = notifications.filter(read=False).count()
    
    context = {
        'notifications': notifications,
        'unread_count': unread_count,
    }
    return render(request, 'notifications/list.html', context)


@login_required
def notification_detail(request, notification_id):
    """Display notification detail."""
    notification = get_object_or_404(Notification, id=notification_id, recipient=request.user)
    
    if not notification.read:
        notification.read = True
        notification.save()
    
    context = {
        'notification': notification,
    }
    return render(request, 'notifications/detail.html', context)


@login_required
@require_http_methods(["POST"])
def mark_as_read(request, notification_id):
    """Mark a notification as read."""
    notification = get_object_or_404(Notification, id=notification_id, recipient=request.user)
    notification.read = True
    notification.save()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    
    messages.success(request, 'Notification marked as read.')
    return redirect('notifications:list')


@login_required
@require_http_methods(["POST"])
def mark_all_as_read(request):
    """Mark all notifications as read for the current user."""
    Notification.objects.filter(recipient=request.user, read=False).update(read=True)
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    
    messages.success(request, 'All notifications marked as read.')
    return redirect('notifications:list')


@login_required
def get_unread_count(request):
    """Get unread notification count (AJAX endpoint)."""
    count = Notification.objects.filter(recipient=request.user, read=False).count()
    return JsonResponse({'unread_count': count})

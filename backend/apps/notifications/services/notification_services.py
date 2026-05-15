from apps.core.models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

def create_notification(recipient: User, title: str, message: str, notification_type: str = 'general'):
    """
    Creates a notification for a user.
    
    Args:
        recipient: User object to receive notification
        title: Notification title
        message: Notification message content
        notification_type: Type of notification (default: 'general')
    
    Returns:
        Notification object
    """
    notification = Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        notification_type=notification_type
    )
    return notification

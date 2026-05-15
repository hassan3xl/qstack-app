from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from ..core.models.staff import Staff


@receiver(post_save, sender=User)
def create_staff_profile(sender, instance, created, **kwargs):
    """Create staff profile when user is created."""
    if created:
        Staff.objects.create(user=instance)

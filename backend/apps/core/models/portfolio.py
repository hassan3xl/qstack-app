from django.db import models
import uuid

# Category and Tag models have been removed as per user request to hardcode them in HTML

class Portfolio(models.Model):
    STATUS_CHOICES = [
        ("live", "Live"),
        ("development", "In Development"),
        ("managing", "Managing")
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(help_text="Short summary for cards")
    long_description = models.TextField(blank=True, help_text="Detailed case study")
    
    image = models.ImageField(upload_to='portfolio/%Y/%m/', blank=True, null=True)
    
    # Relationships
    category = models.CharField(max_length=100, blank=True, default='')
    tags = models.JSONField(default=list, blank=True)
    is_pinned = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='development')
    client = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Staff, Skill, Role, Portfolio, Social, Contact, Notification
)
from .models.jobs import Job, Responsibility, Requirement, Benefit, SalaryRange

# --- Inlines ---
class ContactInline(admin.TabularInline):
    model = Contact
    extra = 1
    
    
class SocialInline(admin.TabularInline):
    model = Social
    extra = 1
    fields = ('platform', 'url')


class ResponsibilityInline(admin.TabularInline):
    model = Responsibility
    extra = 1


class RequirementInline(admin.TabularInline):
    model = Requirement
    extra = 1


class BenefitInline(admin.TabularInline):
    model = Benefit
    extra = 1


class SalaryRangeInline(admin.StackedInline):
    model = SalaryRange
    can_delete = False  # Usually 1-to-1 jobs have exactly one salary range


# --- Admin Classes ---
@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email')
    search_fields = ('name', 'email', 'message')


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    inlines = [SocialInline]
    list_display = ('display_avatar', 'user', 'active_status')
    list_display_links = ('display_avatar', 'user')
    list_filter = ('active_status', 'skills', 'role')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    filter_horizontal = ('skills',)  # Better UI for ManyToMany fields

    def display_avatar(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 50%;" />',
                obj.avatar.url
            )
        return "No Image"
    display_avatar.short_description = 'Avatar'


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description')


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    inlines = [ResponsibilityInline, RequirementInline, BenefitInline, SalaryRangeInline]
    list_display = ('title', 'job_type', 'posted_at')
    list_filter = ('job_type', 'posted_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'posted_at'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'title', 'read', 'created_at')
    list_filter = ('read', 'created_at')
    search_fields = ('recipient__email', 'title', 'message')

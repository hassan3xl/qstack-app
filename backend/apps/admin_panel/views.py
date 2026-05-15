from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.core.paginator import Paginator
from apps.core.models.staff import Staff
from apps.core.models.jobs import Job
from apps.core.models.portfolio import Portfolio
from apps.core.models.contact import Contact


def is_admin(user):
    """Check if user is admin."""
    return user.is_staff or user.is_superuser


@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """Admin dashboard with overview statistics."""
    total_members = Staff.objects.count()
    active_members = Staff.objects.filter(active_status='active').count()
    suspended_members = Staff.objects.filter(active_status='suspended').count()
    total_jobs = Job.objects.count()
    total_portfolios = Portfolio.objects.count()
    
    recent_members = Staff.objects.all().order_by('-created_at')[:5]
    recent_contacts = Contact.objects.all().order_by('-created_at')[:5]
    
    context = {
        'total_members': total_members,
        'active_members': active_members,
        'suspended_members': suspended_members,
        'total_jobs': total_jobs,
        'total_portfolios': total_portfolios,
        'recent_members': recent_members,
        'recent_contacts': recent_contacts,
    }
    return render(request, 'admin_panel/dashboard.html', context)


@login_required
@user_passes_test(is_admin)
def member_list(request):
    """List all members with pagination."""
    members = Staff.objects.all().order_by('-created_at')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        members = members.filter(active_status=status_filter)
    
    # Search
    search_query = request.GET.get('search')
    if search_query:
        members = members.filter(user__first_name__icontains=search_query) | \
                  members.filter(user__last_name__icontains=search_query) | \
                  members.filter(user__email__icontains=search_query)
    
    paginator = Paginator(members, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'members': page_obj.object_list,
        'status_filter': status_filter,
        'search_query': search_query,
    }
    return render(request, 'admin_panel/members/list.html', context)


@login_required
@user_passes_test(is_admin)
def member_detail(request, member_id):
    """Display member detail."""
    member = get_object_or_404(Staff, id=member_id)
    context = {
        'member': member,
    }
    return render(request, 'admin_panel/members/detail.html', context)


@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def member_activate(request, member_id):
    """Activate a member."""
    member = get_object_or_404(Staff, id=member_id)
    member.active_status = 'active'
    member.save()
    
    messages.success(request, f'{member.user.get_full_name()} has been activated.')
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True, 'status': 'active'})
    
    return redirect('admin_panel:member_detail', member_id=member_id)


@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def member_suspend(request, member_id):
    """Suspend a member."""
    member = get_object_or_404(Staff, id=member_id)
    member.active_status = 'suspended'
    member.save()
    
    messages.success(request, f'{member.user.get_full_name()} has been suspended.')
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True, 'status': 'suspended'})
    
    return redirect('admin_panel:member_detail', member_id=member_id)


@login_required
@user_passes_test(is_admin)
def job_list(request):
    """List all jobs with pagination."""
    jobs = Job.objects.all().order_by('-created_at')
    
    paginator = Paginator(jobs, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'jobs': page_obj.object_list,
    }
    return render(request, 'admin_panel/jobs/list.html', context)


@login_required
@user_passes_test(is_admin)
def job_detail(request, job_id):
    """Display job detail."""
    job = get_object_or_404(Job, id=job_id)
    context = {
        'job': job,
    }
    return render(request, 'admin_panel/jobs/detail.html', context)


@login_required
@user_passes_test(is_admin)
def portfolio_list(request):
    """List all portfolios with pagination."""
    portfolios = Portfolio.objects.all().order_by('-created_at')
    
    # Filter by category
    category_filter = request.GET.get('category')
    if category_filter:
        portfolios = portfolios.filter(category=category_filter)
    
    paginator = Paginator(portfolios, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = [] # Removed DB Categories
    
    context = {
        'page_obj': page_obj,
        'portfolios': page_obj.object_list,
        'categories': categories,
        'category_filter': category_filter,
    }
    return render(request, 'admin_panel/portfolios/list.html', context)


@login_required
@user_passes_test(is_admin)
def portfolio_detail(request, portfolio_id):
    """Display portfolio detail."""
    portfolio = get_object_or_404(Portfolio, id=portfolio_id)
    context = {
        'portfolio': portfolio,
    }
    return render(request, 'admin_panel/portfolios/detail.html', context)


@login_required
@user_passes_test(is_admin)
@require_http_methods(["GET", "POST"])
def portfolio_create(request):
    """Create a new portfolio."""
    categories = []
    tags = []
    
    if request.method == 'POST':
        try:
            portfolio = Portfolio.objects.create(
                title=request.POST.get('title'),
                description=request.POST.get('description'),
                long_description=request.POST.get('long_description', ''),
                status=request.POST.get('status', 'development'),
                client=request.POST.get('client', ''),
                url=request.POST.get('url', ''),
                is_pinned=request.POST.get('is_pinned') == 'on',
            )
            
            # Set category if provided
            category = request.POST.get('category')
            if category:
                portfolio.category = category
            
            # Set image if provided
            if 'image' in request.FILES:
                portfolio.image = request.FILES['image']
            
            # Add tags
            tags_list = request.POST.getlist('tags')
            if tags_list:
                portfolio.tags = tags_list
                
            portfolio.save()
            
            messages.success(request, 'Portfolio created successfully.')
            return redirect('admin_panel:portfolio_detail', portfolio_id=portfolio.id)
        except Exception as e:
            messages.error(request, f'Error creating portfolio: {str(e)}')
    
    context = {
        'categories': categories,
        'tags': tags,
    }
    return render(request, 'admin_panel/portfolios/form.html', context)


@login_required
@user_passes_test(is_admin)
@require_http_methods(["GET", "POST"])
def portfolio_edit(request, portfolio_id):
    """Edit an existing portfolio."""
    portfolio = get_object_or_404(Portfolio, id=portfolio_id)
    categories = []
    tags = []
    
    if request.method == 'POST':
        try:
            portfolio.title = request.POST.get('title', portfolio.title)
            portfolio.description = request.POST.get('description', portfolio.description)
            portfolio.long_description = request.POST.get('long_description', portfolio.long_description)
            portfolio.status = request.POST.get('status', portfolio.status)
            portfolio.client = request.POST.get('client', portfolio.client)
            portfolio.url = request.POST.get('url', portfolio.url)
            portfolio.is_pinned = request.POST.get('is_pinned') == 'on'
            
            # Update category if provided
            category = request.POST.get('category')
            if category:
                portfolio.category = category
            else:
                portfolio.category = ''
            
            # Update image if provided
            if 'image' in request.FILES:
                portfolio.image = request.FILES['image']
            
            # Update tags
            tags_list = request.POST.getlist('tags')
            portfolio.tags = tags_list
            
            portfolio.save()
            
            messages.success(request, 'Portfolio updated successfully.')
            return redirect('admin_panel:portfolio_detail', portfolio_id=portfolio.id)
        except Exception as e:
            messages.error(request, f'Error updating portfolio: {str(e)}')
    
    context = {
        'portfolio': portfolio,
        'categories': categories,
        'tags': tags,
    }
    return render(request, 'admin_panel/portfolios/form.html', context)


@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def portfolio_delete(request, portfolio_id):
    """Delete a portfolio."""
    portfolio = get_object_or_404(Portfolio, id=portfolio_id)
    portfolio_title = portfolio.title
    portfolio.delete()
    messages.success(request, f'Portfolio "{portfolio_title}" deleted successfully.')
    return redirect('admin_panel:portfolio_list')


@login_required
@user_passes_test(is_admin)
def contact_list(request):
    """List all contact submissions with pagination."""
    contacts = Contact.objects.all().order_by('-created_at')
    
    paginator = Paginator(contacts, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'contacts': page_obj.object_list,
    }
    return render(request, 'admin_panel/contacts/list.html', context)


@login_required
@user_passes_test(is_admin)
def contact_detail(request, contact_id):
    """Display contact submission detail."""
    contact = get_object_or_404(Contact, id=contact_id)
    context = {
        'contact': contact,
    }
    return render(request, 'admin_panel/contacts/detail.html', context)

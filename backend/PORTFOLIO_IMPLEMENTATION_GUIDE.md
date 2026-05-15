# Portfolio Management System - Implementation Guide

## What Was Built

We've successfully implemented a complete portfolio management system with API endpoints for creating and listing portfolios on your frontpage.

## Components Overview

### 1. **Database Models** (`apps/core/models/portfolio.py`)

- **Portfolio**: Main model with fields for title, description, image, status, category, tags, etc.
- **Category**: For organizing portfolios
- **Tag**: For tagging portfolios with skills/technologies

### 2. **API Serializers** (`api/frontpage/serializers.py`)

- **PortfolioListSerializer**: For reading/listing portfolios (with nested tags and category)
- **PortfolioCreateSerializer**: For creating portfolios (accepts tag_ids and category_id as write-only fields)
- **TagSerializer**: For serializing tags
- **CategorySerializer**: For serializing categories

### 3. **API ViewSet** (`api/frontpage/view.py`)

- **PortfolioViewSet**: ModelViewSet supporting full CRUD operations
  - LIST (GET /api/portfolio/) - Public, no auth required
  - CREATE (POST /api/portfolio/) - Requires authentication
  - RETRIEVE (GET /api/portfolio/{id}/) - Public
  - UPDATE (PUT/PATCH /api/portfolio/{id}/) - Requires authentication
  - DELETE (DELETE /api/portfolio/{id}/) - Requires authentication
- **Filtering capabilities:**
  - Filter by status: `?status=live|development|managing`
  - Filter by category: `?category=<category-id>`
  - Filter by pinned: `?pinned=true|false`

### 4. **API URLs** (`api/frontpage/urls.py`)

- `/api/portfolio/` - List and create
- `/api/portfolio/{id}/` - Retrieve, update, delete

### 5. **Frontend Template** (`templates/portfolio_frontpage_section.html`)

- Responsive portfolio grid layout
- Filter buttons (All, Live, In Development, Featured)
- Automatic image loading from API
- Shows tags, category, client, and project URL
- Mobile responsive design

## Key Features

✅ **Create Portfolios**

- Authenticated users can create new portfolios via API
- Support for title, description, long description, image, category, tags, status, client, and URL

✅ **List Portfolios**

- Public endpoint to list all portfolios
- Filter by status (live, development, managing)
- Filter by category
- Filter by pinned status
- Ordered by creation date (newest first)

✅ **Nested Data**

- Tags are fully serialized (not just IDs)
- Category information is nested
- Images are returned as full URLs

✅ **Frontend Ready**

- Responsive grid layout
- Dynamic filtering
- Error handling
- Loading states

## Usage Examples

### 1. Create a Portfolio via API

```bash
curl -X POST http://localhost:8000/api/portfolio/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-commerce Platform",
    "description": "A modern e-commerce platform built with React and Django",
    "long_description": "Detailed case study about the e-commerce platform...",
    "status": "live",
    "client": "Acme Corp",
    "url": "https://ecommerce.example.com",
    "category_id": "category-uuid",
    "tag_ids": ["react-uuid", "django-uuid"],
    "is_pinned": true
  }'
```

### 2. List Portfolios from Frontend

Include the portfolio section template in your frontpage:

```html
{% include 'portfolio_frontpage_section.html' %}
```

The JavaScript in the template will automatically:

- Fetch portfolios from `/api/portfolio/`
- Render a responsive grid
- Handle filtering
- Display all portfolio information

### 3. Get Portfolios with Filters

```javascript
// Get only live portfolios
fetch("/api/portfolio/?status=live")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Get featured portfolios
fetch("/api/portfolio/?pinned=true")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Get portfolios by category
fetch("/api/portfolio/?category=web-development-uuid")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## Integration Steps

1. **Add Categories and Tags** (Admin Panel)
   - Go to Django admin
   - Create Portfolio Categories
   - Create Tags for your technologies/skills

2. **Create Portfolios**
   - Option A: Via Django Admin
   - Option B: Via API POST request (requires authentication)
   - Option C: Via Admin Panel (if forms are added)

3. **Display on Frontpage**
   - Include `portfolio_frontpage_section.html` in your frontpage template
   - The component handles all API calls and rendering

4. **Customize Styling**
   - Modify CSS in the template to match your design
   - Edit the card layout as needed

## API Response Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "E-commerce Platform",
  "description": "A modern e-commerce platform built with React and Django",
  "image": "/media/portfolio/2026/05/ecommerce.jpg",
  "category": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Web Development"
  },
  "tags": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "React"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "name": "Django"
    }
  ],
  "is_pinned": true,
  "status": "live",
  "client": "Acme Corp",
  "url": "https://ecommerce.example.com",
  "created_at": "2026-05-15T10:30:00Z",
  "updated_at": "2026-05-15T10:30:00Z"
}
```

## Portfolio Status Options

- **live**: Project is live and active
- **development**: Currently in development
- **managing**: Currently being managed/maintained

## Admin Panel Features

Your admin panel already has portfolio management:

- Portfolio list view with category filtering
- Portfolio detail view
- Can be accessed at `/admin_panel/portfolios/`

## Next Steps (Optional)

1. **Add Admin Forms**
   - Create Django forms for easier portfolio creation in admin panel

2. **Add More Filters**
   - Filter by date range
   - Search by title/description
   - Multiple category selection

3. **Image Optimization**
   - Add image thumbnails
   - Implement lazy loading

4. **Frontend Features**
   - Add portfolio detail modal
   - Implement search functionality
   - Add animations

5. **Permissions**
   - Restrict portfolio creation to staff only
   - Add permission checks for update/delete

## Files Modified/Created

✅ `/api/frontpage/serializers.py` - Updated with portfolio serializers
✅ `/api/frontpage/view.py` - Updated with PortfolioViewSet
✅ `/api/frontpage/urls.py` - Updated with basenames
✅ `/templates/portfolio_frontpage_section.html` - New frontpage template
✅ `/PORTFOLIO_API_USAGE.md` - API documentation
✅ `/PORTFOLIO_IMPLEMENTATION_GUIDE.md` - This file

## Troubleshooting

**Issue**: Getting 404 on `/api/portfolio/`

- Check that router is properly configured in urls.py
- Verify the frontpage API URLs are included in main project urls

**Issue**: Images not showing

- Check that MEDIA_URL and MEDIA_ROOT are configured in settings
- Verify images are uploaded to the correct directory
- Check media folder permissions

**Issue**: Cannot create portfolio

- Verify you're authenticated
- Check that Authorization header is sent correctly
- Verify tag_ids and category_id are valid UUIDs

**Issue**: Filters not working

- Check query parameters are spelled correctly
- Verify filter values exist (e.g., category ID actually exists)
- Check browser console for JavaScript errors

## Questions or Issues?

Refer to:

- `/PORTFOLIO_API_USAGE.md` for detailed API documentation
- Django admin for managing categories and tags
- Admin panel at `/admin_panel/portfolios/` for existing portfolio management

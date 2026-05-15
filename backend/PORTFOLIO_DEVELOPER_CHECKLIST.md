# Portfolio API - Developer Checklist

## Pre-Setup (Admin/Database)

- [ ] Access Django admin panel at `/admin`
- [ ] Create at least 1 **Category** (e.g., "Web Development", "Mobile App")
- [ ] Create at least 3 **Tags** (e.g., "React", "Django", "Python")
- [ ] Keep note of the Category and Tag UUIDs for testing

## Testing API Endpoints

### 1. Test List Endpoint (No Auth Required)

```bash
# In terminal/Postman
curl http://localhost:8000/api/portfolio/

# Should return empty array if no portfolios yet: []
```

### 2. Create a Test Portfolio (Requires Auth Token)

First, get your auth token:

```bash
# Option A: Using Django shell
python manage.py shell
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

user = User.objects.first()  # or get your user
token, created = Token.objects.get_or_create(user=user)
print(token.key)
# Copy the token
```

Then create a portfolio:

```bash
curl -X POST http://localhost:8000/api/portfolio/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Portfolio Project",
    "description": "This is a test portfolio entry",
    "long_description": "A detailed description of the test project",
    "status": "live",
    "client": "Test Client",
    "url": "https://example.com",
    "category_id": "PASTE_CATEGORY_UUID_HERE",
    "tag_ids": ["PASTE_TAG_UUID_HERE", "PASTE_ANOTHER_TAG_UUID_HERE"],
    "is_pinned": true
  }'
```

### 3. Test List with Filters

```bash
# Get only live portfolios
curl http://localhost:8000/api/portfolio/?status=live

# Get only featured/pinned portfolios
curl http://localhost:8000/api/portfolio/?pinned=true

# Get portfolios by category
curl "http://localhost:8000/api/portfolio/?category=CATEGORY_UUID"
```

### 4. Get Portfolio Detail

```bash
# Get specific portfolio (replace UUID with real one)
curl http://localhost:8000/api/portfolio/PORTFOLIO_UUID/
```

## Frontend Integration

### 1. Add to Your Frontpage

Add this line to your frontpage template (e.g., `templates/frontpage.html`):

```html
<!-- Somewhere in your HTML body -->
{% include 'portfolio_frontpage_section.html' %}
```

### 2. Test in Browser

- Open http://localhost:8000/your-frontpage/
- You should see a "Portfolio" section
- Click filter buttons to test filtering
- Verify portfolios display correctly

### 3. Verify Components Display

- [ ] Portfolio grid shows up
- [ ] Filter buttons are visible
- [ ] Portfolio cards display images (or placeholder)
- [ ] Cards show title, category, tags, client
- [ ] Links to portfolio URLs work
- [ ] Featured badge shows on pinned portfolios
- [ ] Filters work correctly

## API Testing Tools

### Using cURL

```bash
# GET
curl http://localhost:8000/api/portfolio/

# POST
curl -X POST http://localhost:8000/api/portfolio/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", ...}'

# PUT
curl -X PUT http://localhost:8000/api/portfolio/PORTFOLIO_ID/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated", ...}'

# PATCH
curl -X PATCH http://localhost:8000/api/portfolio/PORTFOLIO_ID/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated"}'

# DELETE
curl -X DELETE http://localhost:8000/api/portfolio/PORTFOLIO_ID/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Using Postman

1. Install Postman
2. Create a new request collection for Portfolio API
3. Set base URL: `http://localhost:8000/api`
4. Add auth token in Headers: `Authorization: Token YOUR_TOKEN`
5. Test each endpoint

### Using Python

```python
import requests

# Get token
token = "YOUR_TOKEN_HERE"
headers = {"Authorization": f"Token {token}"}

# List portfolios
response = requests.get('http://localhost:8000/api/portfolio/')
print(response.json())

# Create portfolio
data = {
    "title": "Test",
    "description": "Test",
    "category_id": "uuid",
    "tag_ids": ["uuid"],
    "status": "live"
}
response = requests.post('http://localhost:8000/api/portfolio/',
                        json=data, headers=headers)
print(response.json())
```

## Common Issues & Solutions

### Issue: "Invalid UUID" Error

```
Solution: Make sure you're using correct UUIDs from the database.
Get them from Django admin or use:
python manage.py shell
from apps.core.models.portfolio import Category, Tag
Category.objects.all().values('id', 'name')
Tag.objects.all().values('id', 'name')
```

### Issue: "Authentication credentials were not provided"

```
Solution:
- Add Authorization header for POST/PUT/PATCH/DELETE
- Header format: "Authorization: Token YOUR_TOKEN_HERE"
- Get token from Django admin or shell
```

### Issue: Portfolios not showing on frontend

```
Solution:
1. Check browser console for JavaScript errors
2. Test API endpoint directly: curl http://localhost:8000/api/portfolio/
3. Verify at least one portfolio exists in database
4. Check that images exist in media folder
5. Check MEDIA_URL setting in settings.py
```

### Issue: Images not displaying

```
Solution:
1. Verify image file exists: ls media/portfolio/
2. Check MEDIA_URL and MEDIA_ROOT in settings
3. Verify web server serving media files (development mode OK)
4. Check image upload permissions
```

## Database Reset (if needed)

```bash
# Warning: This deletes all data!
python manage.py flush

# Then recreate:
python manage.py migrate
python manage.py createsuperuser
# Re-create categories and tags in admin
```

## Performance Tips

1. Use `?status=live` filter to only get active portfolios
2. Use `?pinned=true` to get featured portfolios for hero section
3. Implement pagination if > 100 portfolios
4. Cache API responses on frontend

## Next Development Steps

- [ ] Create admin forms for easier portfolio management
- [ ] Add search/filtering to admin panel
- [ ] Implement image optimization
- [ ] Add portfolio analytics
- [ ] Create portfolio showcase page
- [ ] Add portfolio testimonials/reviews
- [ ] Implement portfolio archiving

## Support Documents

- **PORTFOLIO_API_QUICK_REFERENCE.md** - Quick syntax reference
- **PORTFOLIO_API_USAGE.md** - Full API documentation
- **PORTFOLIO_IMPLEMENTATION_GUIDE.md** - Detailed guide
- **PORTFOLIO_SUMMARY.md** - Implementation overview

## Running the Project

```bash
# Activate virtual environment
source venv/bin/activate

# Apply migrations
python manage.py migrate

# Create superuser (if not exists)
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Access:
# - Admin: http://localhost:8000/admin
# - API: http://localhost:8000/api/portfolio/
# - Frontpage: http://localhost:8000/
```

## Useful Django Admin Links

- Portfolios: `/admin/core/portfolio/`
- Categories: `/admin/core/category/`
- Tags: `/admin/core/tag/`
- Contacts: `/admin/core/contact/`

---

**You're all set!** Follow this checklist to verify everything is working correctly.

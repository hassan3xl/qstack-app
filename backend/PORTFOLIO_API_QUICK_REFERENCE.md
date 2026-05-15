# Portfolio API - Quick Reference

## API Endpoints

| Method | Endpoint               | Auth Required | Description                   |
| ------ | ---------------------- | ------------- | ----------------------------- |
| GET    | `/api/portfolio/`      | No            | List all portfolios           |
| POST   | `/api/portfolio/`      | Yes           | Create new portfolio          |
| GET    | `/api/portfolio/{id}/` | No            | Get portfolio details         |
| PUT    | `/api/portfolio/{id}/` | Yes           | Update portfolio (all fields) |
| PATCH  | `/api/portfolio/{id}/` | Yes           | Update portfolio (partial)    |
| DELETE | `/api/portfolio/{id}/` | Yes           | Delete portfolio              |

## Query Filters

```
GET /api/portfolio/?status=live
GET /api/portfolio/?status=development
GET /api/portfolio/?status=managing
GET /api/portfolio/?category=<uuid>
GET /api/portfolio/?pinned=true
GET /api/portfolio/?pinned=false

# Combine filters
GET /api/portfolio/?status=live&pinned=true
```

## Create Portfolio (JSON)

```bash
POST /api/portfolio/
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Project Name",
  "description": "Short description",
  "long_description": "Detailed description",
  "category_id": "category-uuid",
  "tag_ids": ["tag-uuid1", "tag-uuid2"],
  "status": "live",
  "client": "Client Name",
  "url": "https://project-url.com",
  "is_pinned": true
}
```

## Create Portfolio (with Image)

```bash
POST /api/portfolio/
Authorization: Bearer {token}
Content-Type: multipart/form-data

title=Project&description=...&image=@file.jpg&...
```

## Frontend Example

```html
<!-- Include in your base or frontpage template -->
{% include 'portfolio_frontpage_section.html' %}
```

The included template provides:

- Responsive portfolio grid
- Filter buttons (All, Live, In Dev, Featured)
- Automatic API calls
- Error handling

## Get All Portfolios (JavaScript)

```javascript
fetch("/api/portfolio/")
  .then((r) => r.json())
  .then((portfolios) => {
    // portfolios is an array
    portfolios.forEach((p) => {
      console.log(p.title, p.category.name, p.tags);
    });
  });
```

## Get Live Portfolios Only

```javascript
fetch("/api/portfolio/?status=live")
  .then((r) => r.json())
  .then((data) => console.log(data));
```

## Response Structure

```javascript
{
  "id": "uuid",
  "title": "Project Title",
  "description": "Short description",
  "image": "/media/portfolio/2026/05/image.jpg",
  "category": {
    "id": "uuid",
    "name": "Web Development"
  },
  "tags": [
    { "id": "uuid", "name": "React" },
    { "id": "uuid", "name": "Django" }
  ],
  "is_pinned": false,
  "status": "live",
  "client": "Client Name",
  "url": "https://project-url.com",
  "created_at": "2026-05-15T10:00:00Z",
  "updated_at": "2026-05-15T10:00:00Z"
}
```

## Admin Panel

- List portfolios: `/admin_panel/portfolios/`
- View details: `/admin_panel/portfolios/<portfolio_id>/`

## Database Model

```python
class Portfolio(models.Model):
    STATUS_CHOICES = [
        ("live", "Live"),
        ("development", "In Development"),
        ("managing", "Managing")
    ]

    id = UUIDField(primary_key=True)
    title = CharField(max_length=200)
    description = TextField()
    long_description = TextField(blank=True)
    image = ImageField(upload_to='portfolio/%Y/%m/', blank=True, null=True)
    category = ForeignKey(Category, on_delete=SET_NULL, null=True, blank=True)
    tags = ManyToManyField(Tag, blank=True)
    is_pinned = BooleanField(default=False)
    status = CharField(max_length=20, choices=STATUS_CHOICES)
    client = CharField(max_length=100, blank=True)
    url = URLField(blank=True, null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

## Useful Admin Commands

```bash
# Create a category
python manage.py shell
from apps.core.models.portfolio import Category
Category.objects.create(name="Web Development")

# Create a tag
from apps.core.models.portfolio import Tag
Tag.objects.create(name="React")

# Get all categories
Category.objects.all()

# Get all tags
Tag.objects.all()
```

## Common Status Codes

- **200**: Success (GET, PUT, PATCH)
- **201**: Created (POST)
- **204**: No Content (DELETE)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (permission denied)
- **404**: Not Found

## Files

- API Serializers: `api/frontpage/serializers.py`
- API ViewSet: `api/frontpage/view.py`
- API URLs: `api/frontpage/urls.py`
- Frontend Template: `templates/portfolio_frontpage_section.html`
- Database Model: `apps/core/models/portfolio.py`

## Notes

- All timestamps are in UTC (ISO 8601 format)
- Images are stored in `MEDIA_ROOT/portfolio/{year}/{month}/`
- Portfolio listing is ordered by creation date (newest first)
- Anonymous users can list and view portfolios
- Only authenticated users can create/edit/delete

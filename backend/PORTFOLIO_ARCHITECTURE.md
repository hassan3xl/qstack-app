# Portfolio System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTPAGE (Public)                   │
│  - Portfolio Grid Display                                   │
│  - Filter Buttons (All, Live, Dev, Featured)                │
│  - Responsive Design (Mobile, Tablet, Desktop)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Fetch via fetch() / AJAX
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              REST API LAYER (api/frontpage/)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  GET  /api/portfolio/          → List all portfolios        │
│  GET  /api/portfolio/?filters  → Filtered list              │
│  GET  /api/portfolio/{id}/     → Get portfolio detail       │
│  POST /api/portfolio/          → Create portfolio (auth)    │
│  PUT  /api/portfolio/{id}/     → Update portfolio (auth)    │
│  PATCH/api/portfolio/{id}/     → Partial update (auth)      │
│  DELETE/api/portfolio/{id}/    → Delete portfolio (auth)    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Serializers:                                               │
│  ├─ PortfolioListSerializer (for reading)                   │
│  ├─ PortfolioCreateSerializer (for writing)                 │
│  ├─ CategorySerializer (nested data)                        │
│  └─ TagSerializer (nested data)                             │
│                                                              │
│  ViewSet:                                                   │
│  └─ PortfolioViewSet (ModelViewSet with filters)            │
│                                                              │
│  Permissions:                                               │
│  ├─ GET/LIST     → AllowAny (Public)                        │
│  ├─ POST/PUT/PATCH/DELETE → IsAuthenticated                │
│                                                              │
│  Filters:                                                   │
│  ├─ ?status=live|development|managing                       │
│  ├─ ?category={uuid}                                        │
│  └─ ?pinned=true|false                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Query
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            DATABASE MODELS (apps/core/models/)              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Portfolio                                                  │
│  ├─ id (UUID)                                               │
│  ├─ title (CharField)                                       │
│  ├─ description (TextField) - short                         │
│  ├─ long_description (TextField) - detailed                 │
│  ├─ image (ImageField) → media/portfolio/{year}/{month}/    │
│  ├─ status (live/development/managing)                      │
│  ├─ is_pinned (Boolean)                                     │
│  ├─ client (CharField)                                      │
│  ├─ url (URLField)                                          │
│  ├─ category_id (FK → Category)                             │
│  ├─ tags (M2M → Tag)                                        │
│  ├─ created_at (DateTimeField)                              │
│  └─ updated_at (DateTimeField)                              │
│                                                              │
│  Category                                                   │
│  ├─ id (UUID)                                               │
│  └─ name (CharField, unique)                                │
│                                                              │
│  Tag                                                        │
│  ├─ id (UUID)                                               │
│  └─ name (CharField, unique)                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Reading Portfolio Data (Public)

```
User Browser                                Server
     │                                        │
     ├─ GET /api/portfolio/────────────────► │
     │                                        ├─ Query Portfolio.objects.all()
     │                                        ├─ Filter by status/category/pinned
     │                                        ├─ Order by -created_at
     │                                        ├─ Serialize with PortfolioListSerializer
     │◄───────────────────────────── JSON Array │
     │                                        │
     └─ Display grid with cards ──────────────┘
```

### Creating Portfolio Data (Authenticated)

```
Admin/User                                  Server
     │                                        │
     ├─ POST /api/portfolio/────────────────► │
     │   {title, description, ...}            │
     │   Authorization: Token XXX             ├─ Check authentication
     │                                        ├─ Validate data
     │                                        ├─ Create Portfolio instance
     │                                        ├─ Set category relationship
     │                                        ├─ Set tags (M2M)
     │                                        ├─ Save image to media/
     │                                        ├─ Serialize response
     │◄───────────────────────────── 201 JSON │
     │                                        │
```

## Request/Response Examples

### GET /api/portfolio/ (List)

```
REQUEST:
─────────────────
GET /api/portfolio/
Accept: application/json


RESPONSE (200 OK):
──────────────────
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "E-commerce Platform",
    "description": "Modern e-commerce with React",
    "image": "/media/portfolio/2026/05/ecommerce.jpg",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Web Development"
    },
    "tags": [
      {"id": "770e8400-e29b-41d4-a716-446655440000", "name": "React"},
      {"id": "880e8400-e29b-41d4-a716-446655440000", "name": "Django"}
    ],
    "is_pinned": true,
    "status": "live",
    "client": "Acme Corp",
    "url": "https://ecommerce.example.com",
    "created_at": "2026-05-15T10:30:00Z",
    "updated_at": "2026-05-15T10:30:00Z"
  }
]
```

### GET /api/portfolio/?status=live&pinned=true

```
REQUEST:
─────────────────
GET /api/portfolio/?status=live&pinned=true
Accept: application/json


RESPONSE (200 OK):
──────────────────
[
  {
    "id": "550e8400-...",
    "title": "Featured Project",
    "status": "live",
    "is_pinned": true,
    ...
  }
]
```

### POST /api/portfolio/ (Create)

```
REQUEST:
─────────────────
POST /api/portfolio/
Authorization: Token abc123def456
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "long_description": "Detailed description...",
  "category_id": "660e8400-e29b-41d4-a716-446655440000",
  "tag_ids": [
    "770e8400-e29b-41d4-a716-446655440000",
    "880e8400-e29b-41d4-a716-446655440000"
  ],
  "status": "live",
  "client": "Client Name",
  "url": "https://project.com",
  "is_pinned": false
}


RESPONSE (201 CREATED):
──────────────────────
{
  "id": "990e8400-e29b-41d4-a716-446655440000",
  "title": "New Project",
  "description": "Project description",
  "image": null,
  "category": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Web Development"
  },
  "tags": [
    {"id": "770e8400-...", "name": "React"},
    {"id": "880e8400-...", "name": "Django"}
  ],
  "is_pinned": false,
  "status": "live",
  "client": "Client Name",
  "url": "https://project.com",
  "created_at": "2026-05-15T15:45:00Z",
  "updated_at": "2026-05-15T15:45:00Z"
}
```

## Frontend Integration Flow

```
┌─ frontpage.html
│  │
│  └─ {% include 'portfolio_frontpage_section.html' %}
│     │
│     ├─ HTML: Portfolio Grid Container
│     ├─ CSS: Responsive Styling
│     └─ JavaScript:
│        │
│        ├─ On DOMContentLoaded:
│        │  └─ loadPortfolios('all')
│        │     └─ fetch('/api/portfolio/')
│        │        └─ render portfolios
│        │
│        └─ On Filter Button Click:
│           ├─ Update URL parameter
│           └─ loadPortfolios(filter)
│              └─ fetch('/api/portfolio/?filter=value')
│                 └─ render filtered results
```

## File Organization

```
qstack-app/
│
├── api/
│   └── frontpage/
│       ├── serializers.py          ← Portfolio serializers
│       ├── view.py                 ← PortfolioViewSet
│       ├── urls.py                 ← Portfolio routes
│       └── __init__.py
│
├── apps/
│   └── core/
│       └── models/
│           ├── portfolio.py         ← Portfolio, Category, Tag models
│           └── __init__.py
│
├── templates/
│   ├── portfolio_frontpage_section.html  ← Frontpage component
│   └── base.html                         ← Base template
│
├── PORTFOLIO_API_USAGE.md           ← Full API docs
├── PORTFOLIO_IMPLEMENTATION_GUIDE.md ← Implementation guide
├── PORTFOLIO_API_QUICK_REFERENCE.md ← Quick reference
├── PORTFOLIO_DEVELOPER_CHECKLIST.md ← Testing checklist
├── PORTFOLIO_SUMMARY.md             ← Summary
└── PORTFOLIO_ARCHITECTURE.md        ← This file
```

## Deployment Considerations

### Development

- `DEBUG = True`
- Media files served by Django dev server
- Token authentication with headers

### Production

- `DEBUG = False`
- Media files served by CDN or reverse proxy
- Consider rate limiting on API
- Use environment variables for sensitive data
- Enable HTTPS for authentication

## Performance Optimization

```
Current:
└─ All portfolios listed (N+1 queries possible)

Optimized:
├─ Use select_related('category')
├─ Use prefetch_related('tags')
├─ Cache API responses (60 seconds)
└─ Implement pagination (20 items/page)
```

## Security

- ✅ Authentication required for mutations (POST/PUT/PATCH/DELETE)
- ✅ Public read access for listings
- ✅ CSRF protection enabled
- ✅ Rate limiting recommended
- ✅ Input validation on all fields
- ✅ Image upload validation

## Testing URLs

```bash
# List endpoint
http://localhost:8000/api/portfolio/

# Filtered endpoints
http://localhost:8000/api/portfolio/?status=live
http://localhost:8000/api/portfolio/?pinned=true
http://localhost:8000/api/portfolio/?category=<uuid>

# Detail endpoint
http://localhost:8000/api/portfolio/<uuid>/

# Admin
http://localhost:8000/admin/core/portfolio/
http://localhost:8000/admin_panel/portfolios/
```

---

This architecture provides a clean separation of concerns with:

- **Frontend**: Responsive UI with dynamic filtering
- **API**: RESTful endpoints with proper permissions
- **Database**: Normalized models with relationships
- **Security**: Authentication and validation

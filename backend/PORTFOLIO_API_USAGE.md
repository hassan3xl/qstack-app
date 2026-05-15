# Portfolio API Documentation

## Overview

The Portfolio API allows authenticated users to create portfolios and anyone to list and view them on the frontpage.

## API Endpoints

### List Portfolios (GET)

**Endpoint:** `/api/portfolio/`
**Authentication:** Not required
**Query Parameters:**

- `status` - Filter by status (live, development, managing)
- `category` - Filter by category ID
- `pinned` - Filter by pinned status (true/false)

**Example:**

```bash
GET /api/portfolio/
GET /api/portfolio/?status=live
GET /api/portfolio/?category=<category-id>
GET /api/portfolio/?pinned=true
```

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "title": "Project Title",
    "description": "Short description",
    "image": "url-to-image",
    "category": {
      "id": "uuid",
      "name": "Web Development"
    },
    "tags": [
      {
        "id": "uuid",
        "name": "React"
      }
    ],
    "is_pinned": false,
    "status": "live",
    "client": "Client Name",
    "url": "https://project-url.com",
    "created_at": "2026-05-15T10:00:00Z",
    "updated_at": "2026-05-15T10:00:00Z"
  }
]
```

### Get Portfolio Detail (GET)

**Endpoint:** `/api/portfolio/{id}/`
**Authentication:** Not required

### Create Portfolio (POST)

**Endpoint:** `/api/portfolio/`
**Authentication:** Required (IsAuthenticated)
**Content-Type:** `application/json` or `multipart/form-data` (for image upload)

**Request Body:**

```json
{
  "title": "New Portfolio Project",
  "description": "A brief description of the project",
  "long_description": "Detailed case study and information about the project",
  "category_id": "category-uuid",
  "tag_ids": ["tag-uuid-1", "tag-uuid-2"],
  "status": "live",
  "client": "Client Name",
  "url": "https://project-url.com",
  "is_pinned": false
}
```

**With Image Upload (multipart/form-data):**

```
title: New Portfolio Project
description: A brief description
long_description: Detailed case study
image: [binary file]
category_id: category-uuid
tag_ids: ["tag-uuid-1"]
status: live
client: Client Name
url: https://project-url.com
is_pinned: false
```

**Response (201 Created):**

```json
{
  "id": "new-uuid",
  "title": "New Portfolio Project",
  "description": "A brief description of the project",
  "image": "/media/portfolio/2026/05/filename.jpg",
  "category": {
    "id": "category-uuid",
    "name": "Web Development"
  },
  "tags": [
    {
      "id": "tag-uuid-1",
      "name": "React"
    }
  ],
  "is_pinned": false,
  "status": "live",
  "client": "Client Name",
  "url": "https://project-url.com",
  "created_at": "2026-05-15T10:00:00Z",
  "updated_at": "2026-05-15T10:00:00Z"
}
```

### Update Portfolio (PUT/PATCH)

**Endpoint:** `/api/portfolio/{id}/`
**Authentication:** Required (IsAuthenticated)
**HTTP Method:** PUT (full update) or PATCH (partial update)

### Delete Portfolio (DELETE)

**Endpoint:** `/api/portfolio/{id}/`
**Authentication:** Required (IsAuthenticated)

## Frontend Integration Example

### List Portfolios

```javascript
// Get all portfolios
fetch("/api/portfolio/")
  .then((res) => res.json())
  .then((portfolios) => console.log(portfolios));

// Get only live portfolios
fetch("/api/portfolio/?status=live")
  .then((res) => res.json())
  .then((portfolios) => console.log(portfolios));

// Get pinned portfolios
fetch("/api/portfolio/?pinned=true")
  .then((res) => res.json())
  .then((portfolios) => console.log(portfolios));
```

### Create Portfolio

```javascript
const formData = new FormData();
formData.append("title", "My New Project");
formData.append("description", "Short description");
formData.append("long_description", "Detailed description");
formData.append("category_id", "category-uuid");
formData.append("tag_ids", ["tag-uuid-1", "tag-uuid-2"]);
formData.append("status", "live");
formData.append("client", "Client Name");
formData.append("url", "https://project.com");
formData.append("image", imageFile);

fetch("/api/portfolio/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // or Cookie-based auth
  },
  body: formData,
})
  .then((res) => res.json())
  .then((data) => console.log("Portfolio created:", data));
```

## Available Categories and Tags

To see all available categories and tags for creating portfolios:

**Get Categories:**

```bash
GET /api/portfolio/categories/ (if endpoint exists)
```

**Get Tags:**

```bash
GET /api/portfolio/tags/ (if endpoint exists)
```

Or fetch them from the admin panel directly.

## Error Responses

### 400 Bad Request

```json
{
  "title": ["This field is required."],
  "category_id": ["Invalid pk \"invalid-uuid\" - object does not exist."]
}
```

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found

```json
{
  "detail": "Not found."
}
```

## Status Choices

- `live` - Live portfolio project
- `development` - In development
- `managing` - Being managed

## Notes

- Images are automatically saved to `media/portfolio/{year}/{month}/`
- Only authenticated users can create portfolios
- Anyone can view and list portfolios
- The `long_description` field is optional and useful for detailed case studies

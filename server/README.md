# Website Builder Backend (Express + MongoDB)

## Setup

1. Copy `.env.example` to `.env` and set values.
2. Install deps:
   - npm install
3. (Optional) Seed templates:
   - npm run seed
4. Start server:
   - npm run dev

## API

- Auth
  - POST /api/auth/register { name, email, password }
  - POST /api/auth/login { email, password }
  - GET /api/auth/me (Bearer token)
- Templates (auth required)
  - GET /api/templates
  - GET /api/templates/:id
  - POST /api/templates { title, html, description?, thumbnailUrl? }
  - DELETE /api/templates/:id
- Projects (auth required)
  - GET /api/projects
  - POST /api/projects { name, html, templateId? }
  - GET /api/projects/:id
  - PUT /api/projects/:id { name?, html? }
  - DELETE /api/projects/:id
  - GET /api/projects/:id/download (attachment .html)

## Notes
- Auth via Authorization: Bearer <token>.
- Configure `CORS_ORIGIN` to your frontend origin (comma-separated allowed origins supported).
- Ensure MongoDB is running and `MONGODB_URI` is correct.

# Alumni Tracking Monorepo

This branch scaffolds the initial "Alumni Tracking App" with a `server/` (Node.js + Express + Prisma + PostgreSQL) and `client/` (React + Vite + Tailwind) implementation.

## Stack
Server:
- Node.js / Express
- Prisma ORM (PostgreSQL)
- JWT Auth (Roles: ADMIN, ALUMNI, SCHOOL)

Client:
- React 18 (Vite)
- Tailwind CSS
- React Router v6
- Axios API layer

## Folder Structure
```
server/
	prisma/schema.prisma
	src/
		index.js
		lib/prisma.js
		middleware/auth.js
		routes/*.routes.js
		controllers/*.controller.js
client/
	src/
		App.jsx
		main.jsx
		pages/*
		components/*
		services/*
		context/AuthContext.jsx
```

## Environment Setup
Copy `.env.example` to `.env` in `server/` and set `DATABASE_URL` & `JWT_SECRET`.
Copy `client/.env.example` to `client/.env` if you need to override API URL.

## Install & Run
```powershell
# Server
cd server
npm install
npx prisma generate
# (Optional) create initial migration
npx prisma migrate dev --name init
npm run dev

# Client (in new terminal)
cd ../client
npm install
npm run dev
```

Access client at http://localhost:5173 and API at http://localhost:4000/api.

## Core API Endpoints
Auth:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password

Admin (requires ADMIN):
- GET /api/admin/alumni
- PUT /api/admin/alumni/:id
- DELETE /api/admin/alumni/:id
- PUT /api/admin/alumni/approve/:id
- GET /api/admin/schools
- POST /api/admin/schools
- PUT /api/admin/schools/:id
- DELETE /api/admin/schools/:id
- POST /api/admin/schools/assign-user
- GET /api/admin/analytics/global
- POST /api/admin/surveys

Alumni (requires ALUMNI):
- GET /api/alumni/profile/me
- PUT /api/alumni/profile/me

School (requires SCHOOL):
- GET /api/school/dashboard/analytics

## Next Steps / Ideas
- Add password reset email flow
- Add survey questions & responses models
- Improve analytics (salary capture, more KPIs)
- Pagination & filtering for admin tables
- Validation layer (e.g. zod or joi)
- Testing (Jest + Supertest)

## License
Internal project – no license specified yet.
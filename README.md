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

### Database Setup (PostgreSQL)

Run PostgreSQL in a Docker container:

```bash
docker run --name students \
  -e POSTGRES_PASSWORD=passwd1 \
  -p 5432:5432 \
  -d postgres
```

This creates a PostgreSQL container named `students` with password `passwd1` on port `5432`.

### Environment Variables

Copy `.env.example` to `.env` in `server/` and set `DATABASE_URL` & `JWT_SECRET`.
Copy `client/.env.example` to `client/.env` if you need to override API URL.

**Example server `.env`:**
```
DATABASE_URL=postgresql://postgres:passwd1@localhost:5432/students
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=4000
```

## Install & Run
```bash
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

## Initial Setup

### 1. Create Admin User

After setting up the database, create your first administrator account:

```bash
cd server
npm run seed:admin
```

**Default credentials:**
- Email: `admin@example.com`
- Password: `admin123`

**Custom credentials:**
You can set custom credentials in `server/.env`:
```env
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=your-secure-password
```

⚠️ **Important:** Change the default password after first login!

### 2. Seed Schools (Optional)

To populate the database with sample schools:

```bash
cd server
npm run seed:schools
```

This creates 5 sample schools that can be used for alumni registration.

### Available Scripts

**Server scripts:**
- `npm run dev` - Start development server
- `npm run start` - Start production server
- `npm run seed:admin` - Create admin user
- `npm run seed:schools` - Seed sample schools
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## API Documentation

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

After successful login or registration, you'll receive a token in the response that should be stored and sent with subsequent requests.

---

## API Endpoints Quick Reference

### Public Endpoints (No Authentication Required)
- `GET /api/auth/schools` - Get list of schools (for registration)
- `POST /api/auth/register` - Register a new alumni user
- `POST /api/auth/login` - Authenticate and receive JWT token
- `POST /api/auth/forgot-password` - Request password reset

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/alumni` - Get all alumni profiles
- `PUT /api/admin/alumni/:id` - Update an alumni profile
- `DELETE /api/admin/alumni/:id` - Delete an alumni profile
- `PUT /api/admin/alumni/approve/:id` - Approve an alumni profile
- `GET /api/admin/schools` - Get all schools
- `POST /api/admin/schools` - Create a new school
- `PUT /api/admin/schools/:id` - Update a school
- `DELETE /api/admin/schools/:id` - Delete a school
- `POST /api/admin/schools/assign-user` - Assign user to school
- `GET /api/admin/analytics/global` - Get global analytics
- `POST /api/admin/surveys` - Create a new survey

### Alumni Endpoints (Requires ALUMNI role)
- `GET /api/alumni/profile/me` - Get own profile
- `PUT /api/alumni/profile/me` - Update own profile

### School Endpoints (Requires SCHOOL role)
- `GET /api/school/dashboard/analytics` - Get school analytics

---

## Core API Endpoints

### Auth Endpoints (Public)

#### GET /api/auth/schools
Get list of all schools for registration purposes.

**Response (200):**
```json
[
  {
    "id": "school-id",
    "name": "University Name"
  }
]
```

**Error Responses:**
- `500` - Server error

---

#### POST /api/auth/register
Register a new alumni user.

**Request Body:**
```json
{
  "email": "alumni@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "graduationYear": 2020,
  "major": "Computer Science",
  "studentId": "STU123456",
  "currentJobTitle": "Software Engineer",
  "currentCompany": "Tech Corp",
  "employmentStatus": "EMPLOYED",
  "schoolId": "school-id-here"
}
```

**Required Fields:** `email`, `password`, `fullName`, `graduationYear`, `major`, `schoolId`, `employmentStatus`

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "alumni@example.com",
    "role": "ALUMNI"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Email already in use
- `500` - Server error

---

#### POST /api/auth/login
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "alumni@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "alumni@example.com",
    "role": "ALUMNI"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `500` - Server error

---

#### POST /api/auth/forgot-password
Request password reset (placeholder implementation).

**Request Body:**
```json
{
  "email": "alumni@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, password reset instructions will be sent."
}
```

---

### Admin Endpoints (Requires ADMIN role)

#### GET /api/admin/alumni
Get list of all alumni profiles.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**
```json
[
  {
    "id": "profile-id",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "graduationYear": 2020,
    "major": "Computer Science",
    "studentId": "STU123456",
    "currentJobTitle": "Software Engineer",
    "currentCompany": "Tech Corp",
    "employmentStatus": "EMPLOYED",
    "schoolId": "school-id",
    "isApproved": false,
    "user": {
      "id": "user-id",
      "email": "alumni@example.com",
      "role": "ALUMNI"
    },
    "school": {
      "id": "school-id",
      "name": "University Name"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### PUT /api/admin/alumni/:id
Update an alumni profile.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body (all fields optional):**
```json
{
  "fullName": "John Updated",
  "phone": "+9876543210",
  "graduationYear": 2021,
  "major": "Data Science",
  "studentId": "STU789012",
  "currentJobTitle": "Senior Engineer",
  "currentCompany": "New Corp",
  "employmentStatus": "EMPLOYED",
  "schoolId": "new-school-id",
  "isApproved": true
}
```

**Response (200):**
```json
{
  "id": "profile-id",
  "fullName": "John Updated",
  ...
}
```

**Error Responses:**
- `400` - Update failed
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### DELETE /api/admin/alumni/:id
Delete an alumni profile.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "deletedId": "profile-id"
}
```

**Error Responses:**
- `400` - Delete failed
- `401` - Unauthorized

---

#### PUT /api/admin/alumni/approve/:id
Approve an alumni profile.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**
```json
{
  "id": "profile-id",
  "isApproved": true,
  ...
}
```

**Error Responses:**
- `400` - Approve failed
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### GET /api/admin/schools
Get list of all schools.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**
```json
[
  {
    "id": "school-id",
    "name": "University Name",
    "description": "School description",
    "contactPerson": "Contact Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### POST /api/admin/schools
Create a new school.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "name": "University Name",
  "description": "School description (optional)",
  "contactPerson": "Contact Name (optional)"
}
```

**Response (201):**
```json
{
  "id": "school-id",
  "name": "University Name",
  "description": "School description",
  "contactPerson": "Contact Name",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Create failed (e.g., duplicate school name)
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### PUT /api/admin/schools/:id
Update a school.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "name": "Updated University Name",
  "description": "Updated description",
  "contactPerson": "Updated Contact"
}
```

**Response (200):**
```json
{
  "id": "school-id",
  "name": "Updated University Name",
  ...
}
```

**Error Responses:**
- `400` - Update failed
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### DELETE /api/admin/schools/:id
Delete a school.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "deletedId": "school-id"
}
```

**Error Responses:**
- `400` - Delete failed
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### POST /api/admin/schools/assign-user
Assign a user to a school and change their role to SCHOOL.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "userId": "user-id",
  "schoolId": "school-id"
}
```

**Response (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "SCHOOL",
  "schoolId": "school-id"
}
```

**Error Responses:**
- `400` - userId and schoolId required, or assign failed
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### GET /api/admin/analytics/global
Get global analytics for all alumni.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**
```json
{
  "totalAlumni": 150,
  "employmentRate": 85,
  "topSectors": [
    { "name": "Computer Science", "count": 45 },
    { "name": "Engineering", "count": 30 },
    { "name": "Business", "count": 25 }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized (not admin)
- `500` - Server error

---

#### POST /api/admin/surveys
Create a new survey.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "title": "2024 Alumni Survey",
  "description": "Annual survey for all alumni (optional)"
}
```

**Required Fields:** `title`

**Response (201):**
```json
{
  "id": "survey-id",
  "title": "2024 Alumni Survey",
  "description": "Annual survey for all alumni",
  "createdById": "admin-user-id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - title required, or create failed
- `401` - Unauthorized (not admin)
- `500` - Server error

---

### Alumni Endpoints (Requires ALUMNI role)

#### GET /api/alumni/profile/me
Get the authenticated alumni's own profile.

**Headers:**
```
Authorization: Bearer <alumni-jwt-token>
```

**Response (200):**
```json
{
  "id": "profile-id",
  "userId": "user-id",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "graduationYear": 2020,
  "major": "Computer Science",
  "studentId": "STU123456",
  "currentJobTitle": "Software Engineer",
  "currentCompany": "Tech Corp",
  "employmentStatus": "EMPLOYED",
  "schoolId": "school-id",
  "isApproved": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Profile not found
- `401` - Unauthorized

---

#### PUT /api/alumni/profile/me
Update the authenticated alumni's own profile (limited fields).

**Headers:**
```
Authorization: Bearer <alumni-jwt-token>
```

**Request Body (all fields optional):**
```json
{
  "phone": "+9876543210",
  "currentJobTitle": "Senior Software Engineer",
  "currentCompany": "New Company",
  "employmentStatus": "EMPLOYED"
}
```

**Note:** Alumni can only update: `phone`, `currentJobTitle`, `currentCompany`, `employmentStatus`

**Response (200):**
```json
{
  "id": "profile-id",
  "phone": "+9876543210",
  "currentJobTitle": "Senior Software Engineer",
  ...
}
```

**Error Responses:**
- `400` - Update failed
- `401` - Unauthorized

---

### School Endpoints (Requires SCHOOL role)

#### GET /api/school/dashboard/analytics
Get analytics for the school associated with the authenticated user.

**Headers:**
```
Authorization: Bearer <school-jwt-token>
```

**Response (200):**
```json
{
  "employmentRate": 90,
  "avgSalary": null,
  "topSectors": [
    { "name": "Computer Science", "count": 20 },
    { "name": "Engineering", "count": 15 }
  ]
}
```

**Error Responses:**
- `400` - User is not linked to a school
- `401` - Unauthorized
- `500` - Server error

---

## Employment Status Values

Valid values for `employmentStatus`:
- `EMPLOYED`
- `UNEMPLOYED`
- `SEARCHING`
- `FREELANCE`

## Error Response Format

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid/missing token, wrong role)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Dashboards & Features

### Admin Dashboard (`/admin`)
- **Global Analytics Tab:**
  - Total alumni count
  - Employment rate percentage
  - Top sectors (majors) by alumni count with percentages
  - Summary statistics
- **Manage Alumni Tab:**
  - View all alumni profiles
  - Search by name or email
  - Approve pending alumni
  - Delete alumni records
  - View approval status
- **Manage Schools Tab:**
  - Create new schools
  - View all schools
  - Delete schools
  - School management

### School Dashboard (`/school`)
- **School Analytics:**
  - Employment rate for school's alumni
  - Top sectors (majors) for the school
  - Total alumni tracked
  - Visual statistics cards

### Alumni Dashboard (`/alumni`)
- **Profile Management:**
  - View profile status (Approved/Pending)
  - View employment status with color-coded badges
  - Update contact information (phone, job title, company)
  - Update employment status
  - View personal information (read-only)
  - Tracking summary

## Troubleshooting

### "Profile not found" Error
If you see this error when logging in as an alumni:
1. Make sure you completed the registration process with all required fields
2. If you have an account but no profile, log out and register again
3. Contact an administrator to create your profile manually

### "Server error" in Analytics
If analytics fail to load:
1. Check that the database is running and connected
2. Verify migrations are up to date: `npx prisma migrate dev`
3. Check server logs for specific error messages
4. The system now handles empty databases gracefully

### Creating Admin Account
If you need to create an admin account:
```bash
cd server
npm run seed:admin
```
Or set custom credentials in `.env`:
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
```

## Next Steps / Ideas
- Add password reset email flow
- Add survey questions & responses models
- Improve analytics (salary capture, more KPIs)
- Pagination & filtering for admin tables
- Validation layer (e.g. zod or joi)
- Testing (Jest + Supertest)
- Export analytics to CSV/PDF
- Email notifications for profile approvals

## License
Internal project – no license specified yet.
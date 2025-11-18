# Basic Instructions For Running

## .ENV Backend File Configuration

This project requires a `.env` file in the backend directory.  
Below is the full configuration template and instructions for setting it up correctly.

### `.env` Template

Copy the following into your `.env` file (.env.example en directory) if you wish to only make a copy:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:passwd1@localhost:5432/students?schema=public"

# JWT Secret
JWT_SECRET="ISIajtNKu6wscSbScgsAXHUbj+6VrWn2zHg2Hvoev/8="

# Server Port
PORT=4000

# Email Configuration (Nodemailer + Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourmail@gmail.com
EMAIL_PASS=xxxxxxxxxxxxxxxxxxxx    # Gmail App Password, NOT your Google account password
EMAIL_FROM="UdeC Alumni Service" <yourmail@gmail.com>
```

## Generating a Real Gmail App Password

After enabling 2-Step Verification, you will gain access to the **App Passwords** section in your Google Account.

If 2FA is already enabled, you can go directly here:  
https://myaccount.google.com/apppasswords

Follow these steps to generate the App Password:

1. Open the **App Passwords** page.
2. Under _Select App_, choose **Mail**.
3. Under _Select Device_, choose **Other (Custom name)**.
4. Enter a custom name, for example: `alumni-api`.
5. Google will generate a 16-character App Password that looks like this:

```bash
abcd efg hijk lmno
```

Use this value (without spaces) in your '.env' file as:

```bash
EMAIL_PASS=abcdefghijklmnop
```

## Database Setup

```bash
docker run --name students -e POSTGRES_PASSWORD=passwd1 -p 5432:5432 -d postgres
```

### Install & Run

```bash
# Server
cd Backend
npm install
npx prisma generate
# (Optional) create initial migration
npx prisma migrate dev --name init
npm run dev

# Client (in new terminal)
cd Frontend
npm install
npm run dev
```

Access client at http://localhost:5173 and API at http://localhost:4000/api.

#### 1. Create Admin User

After setting up the database, create your first administrator account:

```bash
cd Backend
npm run seed:admin
```

**Default credentials:**

- Email: `admin@example.com`
- Password: `admin123`

**Custom credentials:**
You can set custom credentials in `Backend/.env`:

```env
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=your-secure-password
```

#### 2. Seed Schools (Optional)

To populate the database with sample schools:

```bash
cd server
npm run seed:schools
```

This creates 5 sample schools that can be used for alumni registration.

#### Available Scripts

**Server scripts:**

- `npm run dev` - Start development server
- `npm run start` - Start production server
- `npm run seed:admin` - Create admin user
- `npm run seed:schools` - Seed sample schools
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

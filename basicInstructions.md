# Basic Instructions For Running

## Database Setup

```bash
docker run --name students -e POSTGRES_PASSWORD=passwd1 -p 5432:5432 -d postgres
```

## .ENV Backend File Configuration

This project requires a `.env` file in the backend directory.  
Below is the full configuration template and instructions for setting it up correctly.

---

### `.env` Template

Copy the following into your `.env` file:

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

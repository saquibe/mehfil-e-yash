# AOICON 2026 KOLKATA - Digital Badge System

A Next.js application with NextAuth for managing digital badges for AOICON 2026 KOLKATA event participants.

## Features

- OTP-based authentication via Email (ZeptoMail) and SMS (SMS Gateway Hub)
- Digital badge generation with QR code
- Download and share badge functionality
- MongoDB integration for user data
- Secure session management with NextAuth

## Setup Instructions

### 1. Environment Variables

Copy the `.env.local` file and fill in the following credentials:

```env
MONGODB_URI=mongodb+srv://mn7331131070_db_user:46X5F4Pl2GpdlBeE@aoiconreg.hpdoot4.mongodb.net/
MONGODB_DB=aoiconreg

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# SMS Gateway Hub (https://www.smsgatewayhub.com)
SMS_GATEWAY_API_KEY=your_sms_gateway_api_key
SMS_GATEWAY_USER_ID=your_user_id
SMS_GATEWAY_PASSWORD=your_password

# ZeptoMail (https://zeptomail.zoho.in/)
ZEPTOMAIL_API_KEY=your_zeptomail_api_key
ZEPTOMAIL_FROM_EMAIL=noreply@registrationteam.in
ZEPTOMAIL_FROM_NAME=AOICON 2026 Registration Team
```

### 2. API Keys Required

#### SMS Gateway Hub
1. Login to https://www.smsgatewayhub.com/Account/Login
2. Navigate to API section
3. Get your API Key, User ID, and Password
4. Add them to `.env.local`

#### ZeptoMail
1. Login to https://zeptomail.zoho.in/
2. Go to Settings > SMTP & API Info
3. Generate API key
4. Add it to `.env.local`

### 3. MongoDB Collection Name

The application expects a collection named `users` in your MongoDB database with the following structure:

```json
{
  "_id": ObjectId,
  "Full Name": "Dr John Doe",
  "Email ID": "john@example.com",
  "Registration Number": "AOI26-0001",
  "Mobile": 1234567890,
  "cert_url": "https://certificate.example.com/cert.pdf"
}
```

### 4. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Add the output to `NEXTAUTH_SECRET` in `.env.local`

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## How It Works

1. **Login**: User enters their registered email or mobile number
2. **OTP**: System sends 6-digit OTP via email (ZeptoMail) or SMS (SMS Gateway Hub)
3. **Verify**: User enters OTP to verify their identity
4. **Badge**: Upon successful verification, user sees their digital badge with:
   - Full Name
   - Registration Number
   - QR Code (containing registration number)
5. **Actions**: User can download or share their badge

## MongoDB Collection Setup

If you need to update the collection name, modify the queries in:
- `/app/api/auth/send-otp/route.ts`
- `/app/api/auth/verify-otp/route.ts`

Current collection name: `users`

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Generate a new `NEXTAUTH_SECRET` for production
3. Ensure all API keys are properly set
4. Deploy to your hosting platform (Vercel, Netlify, etc.)

## Tech Stack

- Next.js 13 (App Router)
- NextAuth.js for authentication
- MongoDB for database
- TailwindCSS for styling
- shadcn/ui for components
- QRCode for QR code generation
- html2canvas for badge export
- ZeptoMail for email
- SMS Gateway Hub for SMS

## Support

For issues or questions, contact the registration team.

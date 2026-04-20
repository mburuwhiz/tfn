# TWOEM Fibre Network - Full-Stack Unified Monorepo

Welcome to the official TWOEM Fibre Network project! This is a premium ISP marketing website and admin portal built with a modern, unified full-stack architecture.

## 🚀 Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, React Query, Lucide Icons, React Quill.
- **Backend**: Node.js (Express), Mongoose, JWT Authentication, Multer, Cloudinary SDK.
- **Database**: MongoDB (Atlas or Local).
- **Communication**: Nodemailer with Brevo (formerly Sendinblue) SMTP.

## 📦 Architecture

This project uses a **Unified Monorepo Architecture**, meaning:
- A single `package.json` for both client and server dependencies.
- A single `.env` file at the root for all environment variables.
- Concurrent execution of the frontend and backend using `concurrently`.

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a cloud URI)

### 2. Installation
```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/whizpoint
JWT_SECRET=your_secure_random_jwt_secret
CLOUDINARY_CLOUD_NAME=dbcqnyavk
CLOUDINARY_API_KEY=771598969942895
CLOUDINARY_API_SECRET=Tu25seMFJTDpey8xUrc8gT6lmFI
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=a4ded8001@smtp-brevo.com
BREVO_SMTP_PASS=xsmtpsib-a4f6ab8a198d954ae2f718d1e6e408db8e5fd5adae2994bbdf30db29de04c3a2-KBNuTpx6HBe2HHw2
EMAIL_FROM=admin@whizpoint.app
EMAIL_FROM_NAME=TWOEM FIBRE NETWORK
REPLY_TO=twoem@whizpoint.app

ADMIN_EMAIL=admin@twoem.com
ADMIN_PASSWORD=Pass123
```

### 4. Running the Project
```bash
npm run dev
```
This will start the backend server on port `5000` and the frontend on port `5173` simultaneously.

## 📂 Project Structure
- `src/client`: Frontend React application.
- `src/server`: Backend Express API.
- `src/server/models`: Mongoose database schemas.
- `src/server/routes`: API endpoints for authentication, plans, news, etc.
- `public/`: Static assets (logo, favicon).

## 🔒 Admin Credentials
- **Email**: `admin@twoem.com`
- **Password**: `Pass123`

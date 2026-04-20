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
Create a `.env` file in the root directory (you can copy `.env.example`) and configure your variables:

```env
# Server Configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whizpoint
JWT_SECRET=your_secure_random_jwt_secret

# Admin Configuration
ADMIN_EMAIL=admin@twoem.com
ADMIN_PASSWORD=Pass123

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
# OR use individual parts:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=admin@whizpoint.app
EMAIL_FROM_NAME=TWOEM FIBRE NETWORK
REPLY_TO=twoem@whizpoint.app
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
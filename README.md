# TWOEM FIBRE NETWORK (TFN)

Welcome to the official repository for TWOEM FIBRE NETWORK, a premium ISP offering ultra-fast internet solutions.

This project features a **Modern, Premium UI/UX** designed with dense data layouts, subtle glassmorphism, and smooth micro-interactions powered by Framer Motion and shadcn/ui.

## Tech Stack
* **Frontend:** React (Vite/TSX), Tailwind CSS, shadcn/ui, Framer Motion, React Router DOM, React Query.
* **Backend:** Node.js (Express), MongoDB (Mongoose).
* **Integrations:** Cloudinary Node.js SDK (for media), Nodemailer with Brevo SMTP (for emails).

## Environment Variables

### Backend `.env` Example

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/twoem
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Brevo (Sendinblue) SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email
SMTP_PASS=your_brevo_password
CONTACT_EMAIL_TO=admin@twoem.com
```

### Frontend `.env` Example

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Getting Started

1. Clone the repository.
2. Install dependencies for the backend (`cd backend && npm install`).
3. Install dependencies for the frontend (`cd frontend && npm install`).
4. Set up the `.env` files.
5. Start the backend server (`cd backend && npm run dev`).
6. Start the frontend application (`cd frontend && npm run dev`).

import 'dotenv/config';
import dns from 'node:dns';

// Force IPv4 for DNS lookups to avoid ::1 issues
dns.setDefaultResultOrder('ipv4first');

// Centralized configuration and environment variable validation
const config = {
  mongodb_uri: (process.env.MONGODB_URI || 'mongodb://localhost:27017/whizpoint').trim(),
  jwt_secret: (process.env.JWT_SECRET || 'your_secure_random_jwt_secret').trim(),
  
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  },
  
  email: {
    host: (process.env.APP_SMTP_HOST || process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST || '').trim(),
    port: Number(process.env.APP_SMTP_PORT || process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT) || 587,
    user: (process.env.APP_SMTP_USER || process.env.SMTP_USER || process.env.BREVO_SMTP_USER || '').trim(),
    pass: (process.env.APP_SMTP_PASS || process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS || '').trim(),
    from: (process.env.EMAIL_FROM || 'admin@whizpoint.app').trim(),
    fromName: (process.env.EMAIL_FROM_NAME || 'TWOEM FIBRE NETWORK').trim(),
    replyTo: (process.env.REPLY_TO || 'twoem@whizpoint.app').trim(),
  },
  
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@twoem.com').trim(),
    password: (process.env.ADMIN_PASSWORD || 'Pass123').trim(),
  },
  
  port: process.env.PORT || 5000,
};

// Validation
const missing = [];
if (!config.cloudinary.cloud_name) missing.push('CLOUDINARY_CLOUD_NAME');
if (!config.cloudinary.api_key) missing.push('CLOUDINARY_API_KEY');
if (!config.cloudinary.api_secret) missing.push('CLOUDINARY_API_SECRET');
if (!config.email.host) missing.push('SMTP_HOST');
if (!config.email.user) missing.push('SMTP_USER');
if (!config.email.pass) missing.push('SMTP_PASS');

if (missing.length > 0) {
  console.warn('⚠️ CRITICAL: Missing environment variables:', missing.join(', '));
} else {
  console.log('✅ Configuration loaded successfully');
  // Log masked Cloudinary config for debugging
  console.log('Cloudinary Debug:', {
    cloud_name: config.cloudinary.cloud_name,
    api_key_length: config.cloudinary.api_key?.length,
    api_key_start: config.cloudinary.api_key?.substring(0, 3) + '...',
    api_secret_exists: !!config.cloudinary.api_secret
  });
}

// Construct Cloudinary URL for the SDK as an alternative
export const CLOUDINARY_URL = `cloudinary://${config.cloudinary.api_key}:${config.cloudinary.api_secret}@${config.cloudinary.cloud_name}`;

export default config;

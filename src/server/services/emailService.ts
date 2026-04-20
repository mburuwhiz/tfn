import nodemailer from 'nodemailer';
import config from '../config.js';
import dns from 'node:dns';

class EmailService {
  private transporter;

  constructor() {
    console.log('Initializing Email Service with host:', config.email.host);
    
    // DNS Diagnostic
    dns.lookup(config.email.host, (err, address, family) => {
      if (err) console.error('DNS Lookup Failed for', config.email.host, ':', err.message);
      else console.log('DNS Lookup Success:', config.email.host, '->', address, '(IPv' + family + ')');
    });

    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // HARDCODE temporarily to bypass any DNS/Env weirdness
      port: 587,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      // Force IPv4
      family: 4,
      // Aggressive timeout and debugging
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      debug: true,
      logger: true
    });

    // Verify connection on startup
    this.transporter.verify((error) => {
      if (error) {
        console.error('❌ Email Service Error:', error.message);
      } else {
        console.log('✅ Email Service is ready to send messages');
      }
    });
  }

  async sendTicketNotificationToAdmin(ticketData: any) {
    const { name, email, phone, message } = ticketData;
    
    const mailOptions = {
      from: `"${config.email.fromName}" <${config.email.from}>`,
      to: config.admin.email,
      subject: `[NEW TICKET] ${name} - TWOEM FIBRE`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      replyTo: email,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Admin Notification Sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      throw error;
    }
  }

  async sendConfirmationToUser(ticketData: any) {
    const { name, email, phone, message } = ticketData;

    const mailOptions = {
      from: `"${config.email.fromName}" <${config.email.from}>`,
      to: email,
      subject: `We've Received Your Request - TWOEM FIBRE`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 24px;">
          <h2 style="color: #00E5FF;">Hello ${name},</h2>
          <p>Thank you for reaching out to <strong>TWOEM FIBRE NETWORK</strong>. We've received your inquiry and our team is currently reviewing it.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">YOUR MESSAGE:</p>
            <p style="margin: 8px 0 0 0; font-weight: bold;">${message}</p>
          </div>
          <p>One of our representatives will contact you via <strong>${phone}</strong> or this email address shortly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 TWOEM FIBRE NETWORK. All rights reserved.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('User Confirmation Sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send user confirmation:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();

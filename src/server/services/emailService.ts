import nodemailer from 'nodemailer';
import config from '../config.js';

class EmailService {
  private transporter;

  constructor() {
    console.log('Initializing Email Service with host:', config.email.host);
    
    // We will use standard nodemailer configuration with environment variables
    // No hardcoded hosts. If not provided, it fails gracefully.
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    // Don't call .verify() on startup if using dummy/missing credentials,
    // as it crashes the server or shows annoying logs.
    // In production with valid credentials, it will work when sending.
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

  async sendTicketReply(ticketData: any, replyMessage: string) {
    const { name, email, message } = ticketData;

    const mailOptions = {
      from: `"${config.email.fromName}" <${config.email.from}>`,
      to: email,
      subject: `Re: Your Ticket - TWOEM FIBRE`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 24px;">
          <h2 style="color: #00E5FF;">Hello ${name},</h2>
          <p>We have an update regarding your recent inquiry.</p>
          <div style="background: #e0f2fe; padding: 20px; border-radius: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #0284c7; font-size: 14px;">OUR REPLY:</p>
            <p style="margin: 8px 0 0 0; font-weight: bold; white-space: pre-wrap;">${replyMessage}</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">YOUR ORIGINAL MESSAGE:</p>
            <p style="margin: 8px 0 0 0; font-style: italic; color: #475569;">${message}</p>
          </div>
          <p>If you need further assistance, feel free to reply to this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 TWOEM FIBRE NETWORK. All rights reserved.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Ticket Reply Sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send ticket reply:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();

const Ticket = require('../models/Ticket');
const nodemailer = require('nodemailer');

const createTicket = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const ticket = await Ticket.create({ name, email, phone, subject, message });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.CONTACT_EMAIL_TO || 'admin@twoem.com',
      subject: `New Ticket: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    };

    if(process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
       console.log('Mock email sent (missing SMTP credentials):', mailOptions);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }

  res.status(201).json(ticket);
};

const getTickets = async (req, res) => {
  const tickets = await Ticket.find({}).sort({ createdAt: -1 });
  res.json(tickets);
};

const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findById(id);
  if (ticket) {
    ticket.status = status;
    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } else {
    res.status(404).json({ message: 'Ticket not found' });
  }
};

const deleteTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  if (ticket) {
    await ticket.deleteOne();
    res.json({ message: 'Ticket removed' });
  } else {
    res.status(404).json({ message: 'Ticket not found' });
  }
};

module.exports = { createTicket, getTickets, updateTicketStatus, deleteTicket };

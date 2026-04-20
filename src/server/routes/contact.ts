import express from 'express';
import { Ticket } from '../models/index.js';
import { emailService } from '../services/emailService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create a new ticket (Public)
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const ticket = new Ticket({ name, email, phone, message });
    const savedTicket = await ticket.save();

    // Send emails asynchronously - don't block the response
    emailService.sendTicketNotificationToAdmin(savedTicket).catch(err => 
      console.error('Async Admin Notification Error:', err)
    );
    emailService.sendConfirmationToUser(savedTicket).catch(err => 
      console.error('Async User Confirmation Error:', err)
    );

    res.status(201).json(savedTicket);
  } catch (err: any) {
    console.error('CONTACT API POST ERROR:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Admin: Get all tickets
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update ticket status
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!updatedTicket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(updatedTicket);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete ticket
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log('ATTEMPTING TO DELETE TICKET:', id);
  
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    
    if (!deletedTicket) {
      console.warn('TICKET NOT FOUND DURING DELETE ATTEMPT:', id);
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    console.log('TICKET DELETED SUCCESSFULLY:', id);
    res.json({ message: 'Ticket deleted successfully', id });
  } catch (err: any) {
    console.error('DELETE TICKET SERVER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

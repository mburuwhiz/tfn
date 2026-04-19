const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicketStatus, deleteTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(createTicket).get(protect, getTickets);
router.route('/:id').put(protect, updateTicketStatus).delete(protect, deleteTicket);

module.exports = router;

import mongoose from 'mongoose';

const SubscriptionPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  speed: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
}, { timestamps: true });

export const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  richTextContent: { type: String, required: true },
  mediaUrl: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export const News = mongoose.model('News', NewsSchema);

const GallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export const Gallery = mongoose.model('Gallery', GallerySchema);

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
}, { timestamps: true });

export const Ticket = mongoose.model('Ticket', TicketSchema);

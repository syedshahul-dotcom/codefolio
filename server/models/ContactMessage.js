import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderName: { type: String, required: true, trim: true, maxlength: 100 },
    senderEmail: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    delivered: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);

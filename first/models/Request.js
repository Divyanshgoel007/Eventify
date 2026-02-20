import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    timestamp: { type: Date, default: Date.now }
});

export const Request = mongoose.model('Request', requestSchema);

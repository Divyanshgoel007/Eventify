import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    universityId: { type: String, required: true },
    batch: { type: String, required: true },
    branch: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now }
});

export const Registration = mongoose.model('Registration', registrationSchema);

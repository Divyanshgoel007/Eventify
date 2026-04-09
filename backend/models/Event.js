import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true }, // Store as string for simplicity or date object
    location: { type: String, required: true },
    description: { type: String, required: true },
    group: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const Event = mongoose.model('Event', eventSchema);

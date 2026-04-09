import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teamName: { type: String, default: 'New Hackathon Team' },
    createdAt: { type: Date, default: Date.now }
});

export const Team = mongoose.model('Team', teamSchema);

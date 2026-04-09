import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Event } from './models/Event.js';
import { Request as CollabRequest } from './models/Request.js';
import { Registration } from './models/Registration.js';
import { Team } from './models/Team.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon_db';

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
    res.send('Eventify Backend API is running!');
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- AUTHENTICATION ROUTES ---

// Sign Up
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sign In
app.post('/signin', async (req, res) => {
    const { email, password, loginRole, adminPasskey } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (loginRole === 'admin') {
            const secretKey = process.env.ADMIN_PASSKEY || 'masterAdmin123';
            if (adminPasskey !== secretKey) {
                return res.status(401).json({ error: 'Invalid Secret Passkey. Admin Access Denied.' });
            }
            user.isAdmin = true;
        } else {
            user.isAdmin = false;
        }
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- COLLABORATION ROUTES ---

// Get all users (excluding sensitive info)
app.get('/users', async (req, res) => {
    console.log("GET /users request received");
    try {
        const users = await User.find({}, 'name email'); // Select only name and email
        console.log(`Found ${users.length} users in DB`);
        const publicUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email
        }));
        res.json(publicUsers);
    } catch (err) {
        console.error("Error in GET /users:", err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Send a collaboration request
app.post('/requests', async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'Sender and Receiver IDs are required' });
    }

    if (senderId === receiverId) {
        return res.status(400).json({ error: 'Cannot send request to yourself' });
    }

    try {
        // Check if request already exists (any status)
        const existingRequest = await CollabRequest.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Request already exists', status: existingRequest.status });
        }

        const newRequest = new CollabRequest({ senderId, receiverId, status: 'pending' });
        await newRequest.save();

        // Populate for response
        await newRequest.populate('senderId', 'name email');
        await newRequest.populate('receiverId', 'name email');

        res.status(201).json({
            id: newRequest._id,
            senderId: newRequest.senderId._id,
            receiverId: newRequest.receiverId._id,
            status: newRequest.status,
            timestamp: newRequest.timestamp
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send request' });
    }
});

// Get requests for a specific user (both sent and received)
app.get('/requests/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find requests where user is sender or receiver
        // We need to populate user details
        const requests = await CollabRequest.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).populate('senderId', 'name email').populate('receiverId', 'name email');

        const formattedRequests = requests.map(req => {
            const isSender = req.senderId._id.toString() === userId;
            const otherUser = isSender ? req.receiverId : req.senderId;
            return {
                id: req._id,
                senderId: req.senderId._id,
                receiverId: req.receiverId._id,
                status: req.status,
                timestamp: req.timestamp,
                otherUser: {
                    id: otherUser._id,
                    name: otherUser.name,
                    email: otherUser.email
                },
                type: isSender ? 'sent' : 'received'
            };
        });

        res.json(formattedRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Update request status (Accept/Reject)
app.put('/requests/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const updatedRequest = await CollabRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Automatic Team Formation Logic
        if (status === 'accepted') {
            const senderId = updatedRequest.senderId;
            const acceptedRequests = await CollabRequest.find({ senderId, status: 'accepted' });
            
            if (acceptedRequests.length === 3) {
                const existingTeam = await Team.findOne({ leaderId: senderId });
                if (!existingTeam) {
                    const memberIds = acceptedRequests.map(r => r.receiverId);
                    if (!memberIds.includes(senderId)) memberIds.push(senderId); // Include leader
                    
                    const newTeam = new Team({
                        leaderId: senderId,
                        members: memberIds,
                        teamName: 'My Hackathon Team'
                    });
                    await newTeam.save();
                }
            }
        }

        res.json({
            id: updatedRequest._id,
            status: updatedRequest.status
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update request' });
    }
});

// --- TEAM ROUTES ---
app.get('/teams/:userId', async (req, res) => {
    try {
        const team = await Team.findOne({ members: req.params.userId }).populate('members', 'name email').populate('leaderId', 'name email');
        if (!team) return res.json(null);
        res.json({
            id: team._id,
            leaderId: team.leaderId._id,
            leaderName: team.leaderId.name,
            teamName: team.teamName,
            members: team.members.map(m => ({ id: m._id, name: m.name, email: m.email }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch team' });
    }
});

app.put('/teams/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const { teamName, userId } = req.body;
        
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });
        
        if (team.leaderId.toString() !== userId) {
            return res.status(403).json({ error: 'Only the team leader can edit the team name' });
        }
        
        team.teamName = teamName;
        await team.save();
        res.json({
            id: team._id,
            teamName: team.teamName
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update team name' });
    }
});

// Remove Member from Team
app.post('/teams/:teamId/remove-member', async (req, res) => {
    try {
        const { teamId } = req.params;
        const { memberId, requesterId } = req.body;
        
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });
        
        // Only leader can remove others. Member can remove themselves.
        if (requesterId !== team.leaderId.toString() && requesterId !== memberId) {
            return res.status(403).json({ error: 'Unauthorized to remove this member' });
        }
        
        // Remove member
        team.members = team.members.filter(m => m.toString() !== memberId);
        await team.save();
        res.json({ message: 'Member removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// Delete Team
app.delete('/teams/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const { requesterId } = req.query; // Sent via URL query
        
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });
        
        if (team.leaderId.toString() !== requesterId) {
            return res.status(403).json({ error: 'Only leader can delete team' });
        }
        
        await Team.findByIdAndDelete(teamId);
        res.json({ message: 'Team deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete team' });
    }
});

// --- EVENT ROUTES ---

// Get all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        const formattedEvents = events.map(e => ({
            id: e._id,
            title: e.title,
            date: e.date,
            location: e.location,
            description: e.description,
            image: e.image,
            group: e.group
        }));
        res.json(formattedEvents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Add Event
app.post('/events', async (req, res) => {
    const { title, date, location, description, image, group } = req.body;
    try {
        const newEvent = new Event({ title, date, location, description, image, group });
        await newEvent.save();
        res.status(201).json({
            id: newEvent._id,
            title, date, location, description, image, group
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save event' });
    }
});

// Delete Event
app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Event Registration
app.post('/events/:id/register', async (req, res) => {
    const { id: eventId } = req.params;
    const { name, universityId, batch, branch, userId } = req.body;

    if (!name || !universityId || !batch || !branch) {
        return res.status(400).json({ error: 'All fields (name, universityId, batch, branch) are required' });
    }

    try {
        // Check for duplicate
        const query = userId ? { eventId, userId } : { eventId, universityId };
        const existingReg = await Registration.findOne(query);
        
        if (existingReg) {
            return res.status(400).json({ error: 'Already registered for this event.' });
        }

        const newReg = new Registration({ eventId, userId, name, universityId, batch, branch });
        await newReg.save();
        res.status(201).json({ message: 'Registered successfully!' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to process registration' });
    }
});

// --- ADMIN ROUTES ---
app.get('/admin/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('eventId', 'title date')
            .sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching registrations' });
    }
});

// Check Registration Status
app.get('/events/:eventId/check-registration/:userId', async (req, res) => {
    try {
        const { eventId, userId } = req.params;
        const existing = await Registration.findOne({ eventId, userId });
        res.json({ isRegistered: !!existing });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

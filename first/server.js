import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Event } from './models/Event.js';
import { Request as CollabRequest } from './models/Request.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon_db';

// Middleware
app.use(cors());
app.use(express.json());

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
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sign In
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

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

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
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

        res.json({
            id: updatedRequest._id,
            status: updatedRequest.status
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update request' });
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
            image: e.image
        }));
        res.json(formattedEvents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Add Event
app.post('/events', async (req, res) => {
    const { title, date, location, description, image } = req.body;
    try {
        const newEvent = new Event({ title, date, location, description, image });
        await newEvent.save();
        res.status(201).json({
            id: newEvent._id,
            title, date, location, description, image
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

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

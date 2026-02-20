import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { API_URL } from '../api';

const Collaboration = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            console.log("Fetching collaboration data for user:", user.id);
            try {
                // Fetch all users
                const usersResponse = await fetch(`${API_URL}/users`);
                const usersData = await usersResponse.json();
                console.log("All Users Fetched:", usersData);

                // Fetch requests for current user
                const requestsResponse = await fetch(`${API_URL}/requests/${user.id}`);
                const requestsData = await requestsResponse.json();
                console.log("Requests Fetched:", requestsData);

                // Exclude self from users list
                setUsers(usersData.filter(u => u.id !== user.id));
                setRequests(requestsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching collaboration data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const sendRequest = async (receiverId) => {
        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: user.id, receiverId })
            });

            if (response.ok) {
                const newRequest = await response.json();

                // Manually construct the enriched request object to update UI immediately
                const receiver = users.find(u => u.id === receiverId);
                const enrichedRequest = {
                    ...newRequest,
                    otherUser: receiver,
                    type: 'sent'
                };

                setRequests([...requests, enrichedRequest]);
                alert('Request sent successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            alert('An unexpected error occurred');
        }
    };

    const updateRequestStatus = async (requestId, status) => {
        try {
            const response = await fetch(`${API_URL}/requests/${requestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setRequests(requests.map(req =>
                    req.id === requestId ? { ...req, status } : req
                ));
            } else {
                alert('Failed to update request');
            }
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    const getRequestStatusForUser = (otherUserId) => {
        // Find any existing request involving this user
        const req = requests.find(r => r.otherUser.id === otherUserId);
        return req ? req : null;
    };

    // Filtered Lists
    const pendingIncoming = requests.filter(req => req.type === 'received' && req.status === 'pending');
    const collaborators = requests.filter(req => req.status === 'accepted');

    return (
        <>
            <Navbar />
            <div className="container section" style={{ minHeight: '80vh', paddingTop: '8rem' }}>
                <h2 className="hero-title text-center mb-10">
                    Find <span className="gradient-text">Hackathon Teammates</span>
                </h2>

                <div className="flex flex-col gap-8">
                    {/* Your Profile Section */}
                    <div className="card mb-6 bg-gradient-to-r from-blue-900 to-slate-900" style={{ border: '1px solid rgba(59, 130, 246, 0.5)' }}>
                        <div className="flex items-center gap-6">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{user?.name}</h3>
                                <p className="text-gray-300">{user?.email}</p>
                                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                                    Looking for Teammates
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Incoming Requests */}
                    {pendingIncoming.length > 0 && (
                        <div className="card mb-6" style={{ borderColor: 'var(--color-secondary)' }}>
                            <h3 className="text-xl font-bold mb-4 text-white">Incoming Requests ({pendingIncoming.length})</h3>
                            <div className="flex flex-col gap-4">
                                {pendingIncoming.map(req => (
                                    <div key={req.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                                                {req.otherUser.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold">{req.otherUser.name}</p>
                                                <p className="text-sm text-muted">Invites you to collaborate</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateRequestStatus(req.id, 'accepted')}
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', minWidth: '80px' }}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateRequestStatus(req.id, 'rejected')}
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444', minWidth: '80px' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* My Collaborators */}
                    {collaborators.length > 0 && (
                        <div className="card mb-6" style={{ borderColor: 'var(--color-primary)' }}>
                            <h3 className="text-xl font-bold mb-4 text-white">My Collaborators ({collaborators.length})</h3>
                            <div className="events-grid">
                                {collaborators.map(req => (
                                    <div key={req.id} className="p-4 rounded-lg flex items-center gap-4" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xl">
                                            {req.otherUser.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{req.otherUser.name}</p>
                                            <p className="text-sm text-blue-300">{req.otherUser.email}</p>
                                            <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Connected</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Potential Teammates */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Discover Teammates</h3>

                        {users.length === 0 ? (
                            <div className="text-center py-10 card">
                                <p className="text-muted text-lg">No other users found. Invite your friends to join!</p>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {users.map(potentialMate => {
                                    const existingRequest = getRequestStatusForUser(potentialMate.id);

                                    // Don't show in "Discover" if already collaborating
                                    // if (existingRequest && existingRequest.status === 'accepted') return null;

                                    return (
                                        <div key={potentialMate.id} className="card flex flex-col items-center text-center">
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--color-surface-hover), var(--color-surface))',
                                                border: '2px solid var(--color-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '1rem',
                                                fontSize: '2rem',
                                                fontWeight: 'bold',
                                                color: 'white'
                                            }}>
                                                {potentialMate.name.charAt(0)}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{potentialMate.name}</h3>
                                            <p className="text-muted mb-6">{potentialMate.email}</p>

                                            {existingRequest ? (
                                                <div className={`px-4 py-2 rounded-full text-sm font-bold w-full border ${existingRequest.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                                    existingRequest.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                    }`}>
                                                    {existingRequest.status === 'accepted' ? '✓ Collaborating' :
                                                        existingRequest.status === 'rejected' ? '✕ Request Rejected' :
                                                            existingRequest.type === 'sent' ? '◷ Request Sent' : '◷ Request Received'}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => sendRequest(potentialMate.id)}
                                                    className="btn btn-outline w-full hover:bg-white hover:text-black transition-colors"
                                                >
                                                    + Send Request
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Collaboration;

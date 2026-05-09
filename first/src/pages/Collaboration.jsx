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
    const [team, setTeam] = useState(null);
    const userId = user?.id || user?._id;
    const [editingTeamName, setEditingTeamName] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            console.log("Fetching collaboration data for user:", userId);
            try {
                // Fetch all users
                const usersResponse = await fetch(`${API_URL}/users`);
                const usersData = await usersResponse.json();
                console.log("All Users Fetched:", usersData);

                // Fetch requests for current user
                const requestsResponse = await fetch(`${API_URL}/requests/${userId}`);
                const requestsData = await requestsResponse.json();

                const teamResponse = await fetch(`${API_URL}/teams/${userId}`);
                const teamData = await teamResponse.json();

                setUsers(Array.isArray(usersData) ? usersData.filter(u => (u.id || u._id) !== userId) : []);
                setRequests(Array.isArray(requestsData) ? requestsData : []);
                setTeam((teamData && !teamData.error) ? teamData : null);
                if (teamData && !teamData.error) setNewTeamName(teamData.teamName);
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
                body: JSON.stringify({ senderId: userId, receiverId })
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
                setRequests(requests.map(req => req.id === requestId ? { ...req, status } : req));
                if (status === 'accepted') {
                   // Refresh team if automatically formed
                   const teamResp = await fetch(`${API_URL}/teams/${userId}`);
                   const teamData = await teamResp.json();
                   setTeam(teamData);
                   if (teamData) setNewTeamName(teamData.teamName);
                }
            } else {
                alert('Failed to update request');
            }
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    const getRequestStatusForUser = (otherUserId) => {
        if (!Array.isArray(requests)) return null;
        const req = requests.find(r => r?.otherUser?.id === otherUserId);
        return req ? req : null;
    };

    const handleUpdateTeamName = async () => {
        if (!newTeamName.trim()) return;
        try {
            const response = await fetch(`${API_URL}/teams/${team.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamName: newTeamName, userId: userId })
            });
            if (response.ok) {
                const updated = await response.json();
                setTeam({ ...team, teamName: updated.teamName });
                setEditingTeamName(false);
            } else {
                const err = await response.json();
                alert(err.error || 'Failed to update team name');
            }
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };

    const handleRemoveMember = async (memberId) => {
        const isSelf = memberId === userId;
        if (!window.confirm(isSelf ? 'Are you sure you want to leave the team?' : 'Remove this member?')) return;

        try {
            const res = await fetch(`${API_URL}/teams/${team.id}/remove-member`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId, requesterId: userId })
            });

            if (res.ok) {
                if (isSelf) {
                    setTeam(null);
                    alert('You left the team');
                } else {
                    setTeam({ ...team, members: team.members.filter(m => m.id !== memberId) });
                    alert('Member removed');
                }
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to remove member');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTeam = async () => {
        if (!window.confirm('Are you sure you want to delete this team?')) return;
        try {
            const res = await fetch(`${API_URL}/teams/${team.id}?requesterId=${userId}`, { method: 'DELETE' });
            if (res.ok) {
                setTeam(null);
                alert('Team deleted successfully');
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to delete team');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Filtered Lists
    const pendingIncoming = Array.isArray(requests) ? requests.filter(req => req.type === 'received' && req.status === 'pending') : [];
    const collaborators = Array.isArray(requests) ? requests.filter(req => req.status === 'accepted') : [];

    return (
        <>
            <Navbar />
            <div className="container section" style={{ minHeight: '80vh', paddingTop: '8rem' }}>
                
                {/* 1. Centered Main Profile Section */}
                <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto 4rem auto', padding: '2rem' }}>
                    <div className="flex items-center justify-center font-bold text-6xl text-center" style={{ 
                        width: '100px', height: '100px', borderRadius: '50%', 
                        background: 'var(--gradient-primary)', margin: '0 auto 1.5rem auto' 
                    }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{user?.name}</h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{user?.email}</p>
                    <div style={{ 
                        display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', 
                        border: '1px solid var(--color-primary)', color: 'var(--color-primary)', 
                        fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' 
                    }}>
                        Looking for teammates
                    </div>
                </div>

                {/* 2. My Hackathon Team */}
                {team && (
                    <div style={{ marginBottom: '5rem' }}>
                        <div className="flex justify-between items-center mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            <div className="text-left w-full">
                                {editingTeamName && team.leaderId === userId ? (
                                    <div className="flex items-center gap-4">
                                        <input 
                                            className="form-input" 
                                            style={{ maxWidth: '300px', fontSize: '1.1rem' }} 
                                            value={newTeamName} 
                                            onChange={e => setNewTeamName(e.target.value)} 
                                            placeholder="Enter team name"
                                        />
                                        <button className="btn btn-primary" onClick={handleUpdateTeamName}>Save</button>
                                        <button className="btn btn-outline" onClick={() => setEditingTeamName(false)}>Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800' }}>{team.teamName}</h2>
                                        {team.leaderId === userId && (
                                            <button onClick={() => setEditingTeamName(true)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                                Edit Name
                                            </button>
                                        )}
                                        {team.leaderId === userId && (
                                            <button onClick={handleDeleteTeam} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#e11d48', color: 'white' }}>
                                                Delete Team
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-muted" style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                                Roster ({team.members.length}/4)
                            </div>
                        </div>

                        {/* Valid App.css grid */}
                        <div className="events-grid">
                            {team.members.map(member => (
                                <div key={member.id} className="card flex flex-col items-center text-center relative" style={{ padding: '2rem' }}>
                                    {member.id === team.leaderId && (
                                        <div style={{ 
                                            position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-warning)', 
                                            fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' 
                                        }}>
                                            Leader
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center font-bold text-center" style={{ 
                                        width: '80px', height: '80px', borderRadius: '50%', 
                                        border: '2px solid var(--color-primary)', fontSize: '2rem', marginBottom: '1rem' 
                                    }}>
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{member.name}</h3>
                                    <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{member.email}</p>
                                    
                                    {/* Remove / Leave Button */}
                                    <div style={{ marginTop: 'auto', width: '100%' }}>
                                        {team.leaderId === userId && (member.id || member._id) !== userId && (
                                            <button onClick={() => handleRemoveMember(member.id || member._id)} className="btn btn-outline w-full" style={{ color: '#e11d48', borderColor: '#e11d48', padding: '0.5rem' }}>
                                                Remove Member
                                            </button>
                                        )}
                                        {(member.id || member._id) === userId && team.leaderId !== userId && (
                                            <button onClick={() => handleRemoveMember(member.id || member._id)} className="btn btn-outline w-full" style={{ color: '#e11d48', borderColor: '#e11d48', padding: '0.5rem' }}>
                                                Leave Team
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Incoming Requests */}
                {pendingIncoming.length > 0 && (
                    <div style={{ marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            Incoming Requests
                        </h2>
                        <div className="events-grid">
                            {pendingIncoming.map(req => (
                                <div key={req.id} className="card flex flex-col items-center text-center" style={{ padding: '2rem' }}>
                                    <div className="flex flex-col items-center w-full mb-6">
                                        <div className="flex items-center justify-center font-bold text-center" style={{ 
                                            width: '60px', height: '60px', borderRadius: '50%', 
                                            background: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' 
                                        }}>
                                            {req.otherUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{req.otherUser.name}</h3>
                                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Wants to team up</p>
                                    </div>
                                    <div className="flex gap-4 w-full">
                                        <button onClick={() => updateRequestStatus(req.id, 'accepted')} className="btn btn-primary w-full" style={{ padding: '0.5rem' }}>
                                            Accept
                                        </button>
                                        <button onClick={() => updateRequestStatus(req.id, 'rejected')} className="btn btn-outline w-full" style={{ padding: '0.5rem' }}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Discover Teammates */}
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        Discover Teammates
                    </h2>
                    {users.length === 0 ? (
                        <div className="text-center card" style={{ padding: '4rem 1rem' }}>
                            <p className="text-muted text-lg">No other users found. Invite your friends!</p>
                        </div>
                    ) : (
                        <div className="events-grid">
                            {users.map(potentialMate => {
                                const existingRequest = getRequestStatusForUser(potentialMate.id);
                                return (
                                    <div key={potentialMate.id} className="card flex flex-col items-center text-center" style={{ padding: '2rem' }}>
                                        <div className="flex items-center justify-center font-bold text-center" style={{ 
                                            width: '70px', height: '70px', borderRadius: '50%', 
                                            background: 'rgba(255,255,255,0.05)', fontSize: '1.8rem', marginBottom: '1rem' 
                                        }}>
                                            {potentialMate.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{potentialMate.name}</h3>
                                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{potentialMate.email}</p>

                                        <div style={{ marginTop: 'auto', width: '100%' }}>
                                            {existingRequest ? (
                                                <div style={{ 
                                                    padding: '0.5rem', borderRadius: 'var(--radius-sm)', 
                                                    border: '1px solid var(--color-surface-hover)', color: 'var(--color-primary)', 
                                                    fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' 
                                                }}>
                                                    {existingRequest.status === 'accepted' ? 'Teammate' :
                                                        existingRequest.status === 'rejected' ? 'Rejected' :
                                                        existingRequest.type === 'sent' ? 'Pending' : 'Received'}
                                                </div>
                                            ) : (
                                                <button onClick={() => sendRequest(potentialMate.id || potentialMate._id)} className="btn btn-outline w-full" style={{ padding: '0.5rem' }}>
                                                    Invite
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Collaboration;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import { API_URL } from '../api';

const SuggestedCollaborators = ({ user, navigate }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetch(`${API_URL}/users`)
            .then(res => res.json())
            .then(data => {
                setUsers(data.filter(u => u.id !== user.id).slice(0, 4));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    if (loading) return <p className="text-muted">Loading suggestions...</p>;
    if (users.length === 0) return <p className="text-muted">No other users found yet.</p>;

    return (
        <>
            {users.map(u => (
                <div key={u.id} className="card p-4 flex flex-col items-center justify-center text-center" style={{ minWidth: '200px' }}>
                    <div className="w-16 h-16 rounded-full bg-blue-600 mb-3 flex items-center justify-center font-bold text-xl text-white">
                        {u.name.charAt(0)}
                    </div>
                    <h3 className="font-bold mb-1">{u.name}</h3>
                    <button
                        onClick={() => navigate('/collaboration')}
                        className="btn btn-primary text-xs mt-2 w-full py-2"
                    >
                        Connect
                    </button>
                </div>
            ))}
        </>
    );
};

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        image: ''
    });

    React.useEffect(() => {
        fetch(`${API_URL}/events`)
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE',
            })
                .then(res => {
                    if (res.ok) {
                        setEvents(prev => prev.filter(e => e.id !== id));
                    }
                })
                .catch(error => console.error('Error deleting event:', error));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        })
            .then(res => res.json())
            .then(data => {
                setEvents(prev => [data, ...prev]);
                setIsModalOpen(false);
                setNewEvent({ title: '', date: '', location: '', description: '', image: '' });
            })
            .catch(error => console.error('Error creating event:', error));
    };

    const handleAddClick = () => {
        if (user) {
            setIsModalOpen(true);
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <Navbar onJoinClick={handleAddClick} />
            <Hero />

            <section id="events" className="container section">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="hero-title text-center" style={{ fontSize: '2.5rem', marginBottom: 0 }}>
                        Upcoming <span className="gradient-text">Events</span>
                    </h2>
                    <button
                        className="btn btn-primary"
                        onClick={handleAddClick}
                    >
                        + Add Event
                    </button>
                </div>

                <div className="events-grid">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            title={event.title}
                            date={event.date}
                            location={event.location}
                            description={event.description}
                            image={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600"}
                            onDelete={() => handleDelete(event.id)}
                        />
                    ))}
                </div>
            </section>

            {/* Suggested Collaborators Section - Only visible if logged in */}
            {user && (
                <section className="container section" style={{ paddingTop: '1rem' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Suggested <span className="gradient-text">Collaborators</span></h2>
                        <button onClick={() => navigate('/collaboration')} className="btn btn-outline text-sm">View All</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        <SuggestedCollaborators user={user} navigate={navigate} />
                    </div>
                </section>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <h2 className="text-xl font-bold mb-6">Add New Event</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    className="form-input"
                                    value={newEvent.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Summer Coding Camp"
                                />
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    required
                                    type="text"
                                    name="date"
                                    className="form-input"
                                    value={newEvent.date}
                                    onChange={handleInputChange}
                                    placeholder="e.g. July 15, 2026"
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    required
                                    type="text"
                                    name="location"
                                    className="form-input"
                                    value={newEvent.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Room 204 or Online"
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    className="form-input"
                                    value={newEvent.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    required
                                    name="description"
                                    className="form-textarea"
                                    value={newEvent.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief details about the event..."
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full">
                                Create Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};


export default Home;




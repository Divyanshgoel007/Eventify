import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import { API_URL } from '../api';

const ClubEvents = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const clubNames = {
        'acm': 'ACM',
        'ieee': 'IEEE',
        'vibinz': 'Vibinz',
        'cuarcs': 'CUArcs',
        'euphony': 'Euphony'
    };

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/events`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filteredEvents = data.filter(event => event.group === clubId);
                    setEvents(filteredEvents);
                } else {
                    console.error('Expected array of events but received:', data);
                    setEvents([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setLoading(false);
                setEvents([]);
            });
    }, [clubId]);

    const displayClubName = clubNames[clubId] || clubId.toUpperCase();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow container section mt-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-secondary text-sm mb-4 hover:text-primary flex items-center gap-2 transition-colors"
                        >
                            ← Back to Home
                        </button>
                        <h2 className="hero-title m-0 p-0 text-left" style={{ fontSize: '2.5rem' }}>
                            <span className="gradient-text">{displayClubName}</span> Events
                        </h2>
                    </div>
                </div>

                {loading ? (
                    <p className="text-muted text-center py-10">Loading events...</p>
                ) : events.length > 0 ? (
                    <div className="events-grid">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                id={event.id}
                                title={event.title}
                                date={event.date}
                                location={event.location}
                                description={event.description}
                                image={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600"}
                                group={event.group}
                                onDelete={() => { }} // Usually prefer handling delete at global level, keeping it blank or same logic here
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-dark-secondary rounded-xl">
                        <h3 className="text-xl font-bold mb-2">No Events Found</h3>
                        <p className="text-muted">There are currently no upcoming events for {displayClubName}.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ClubEvents;

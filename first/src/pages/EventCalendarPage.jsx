import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import { API_URL } from '../api';
import 'react-calendar/dist/Calendar.css';
import './EventCalendarPage.css'; // custom styles

const EventCalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/events`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEvents(data);
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
    }, []);

    // Format utility
    const formatDateObj = (date) => {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Parse the event date string (e.g. "July 15, 2026") to Date object to compare
    const isSameDay = (d1, d2String) => {
        const d2 = new Date(d2String);
        if (isNaN(d2.getTime())) return false;
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Filter events based on selected date
    const selectedDateEvents = events.filter(event => isSameDay(selectedDate, event.date));

    // Custom calendar tile content to add dots under dates with events
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasEvent = events.some(event => isSameDay(date, event.date));
            if (hasEvent) {
                return <div className="event-dot"></div>;
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow container section mt-10">
                <div className="flex justify-between items-center mb-10 text-center">
                    <h2 className="hero-title m-0 p-0 w-full" style={{ fontSize: '2.5rem' }}>
                        Event <span className="gradient-text">Calendar</span>
                    </h2>
                </div>

                <div className="calendar-layout gap-8">
                    <div className="calendar-container card">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            tileContent={tileContent}
                            className="custom-calendar"
                        />
                    </div>

                    <div className="calendar-events">
                        <h3 className="text-2xl font-bold mb-6">
                            Events on <span className="gradient-text-alt">{formatDateObj(selectedDate)}</span>
                        </h3>

                        {loading ? (
                            <p className="text-muted">Loading events...</p>
                        ) : selectedDateEvents.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {selectedDateEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        id={event.id}
                                        title={event.title}
                                        date={event.date}
                                        location={event.location}
                                        description={event.description}
                                        image={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600"}
                                        group={event.group}
                                        onDelete={() => { }} // typically hide delete on generic views, or replicate home page logic
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-dark-secondary rounded-xl card opacity-75">
                                <p className="text-muted">No events scheduled for this date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventCalendarPage;

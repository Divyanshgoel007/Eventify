import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from '../api';

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.isAdmin === false) {
            navigate('/');
            return;
        }

        fetch(`${API_URL}/admin/registrations`)
            .then(res => res.json())
            .then(data => {
                // Ensure data is array
                if (Array.isArray(data)) {
                    setRegistrations(data);
                } else {
                    setRegistrations([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user, navigate]);

    if (!user || user.isAdmin === false) return null;

    // Grouping registrations by Event
    const groupedRegistrations = registrations.reduce((acc, curr) => {
        const eventTitle = curr.eventId?.title || 'Deleted / Unknown Event';
        if (!acc[eventTitle]) acc[eventTitle] = [];
        acc[eventTitle].push(curr);
        return acc;
    }, {});

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container section" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
                <h2 className="hero-title mb-10 text-center" style={{ fontSize: '3rem', marginBottom: '3rem' }}>
                    Admin <span className="gradient-text">Dashboard</span>
                </h2>

                {loading ? (
                    <div className="text-center card" style={{ padding: '4rem 1rem' }}>
                        <p className="text-muted text-lg">Loading registration data...</p>
                    </div>
                ) : Object.keys(groupedRegistrations).length === 0 ? (
                    <div className="text-center card" style={{ padding: '4rem 1rem' }}>
                        <p className="text-muted text-lg">No event registrations found yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {Object.entries(groupedRegistrations).map(([eventTitle, regs]) => (
                            <div key={eventTitle} className="card" style={{ padding: '2rem' }}>
                                <div className="flex justify-between items-center mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold' }} className="gradient-text-alt">{eventTitle}</h3>
                                    <div style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        Total: {regs.length}
                                    </div>
                                </div>
                                
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Student Name</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>University ID</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Branch</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Batch</th>
                                                <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Date Registered</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {regs.map(reg => (
                                                <tr key={reg._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{reg.name}</td>
                                                    <td style={{ padding: '1rem', color: 'var(--color-secondary)', fontWeight: 'bold', letterSpacing: '1px' }}>{reg.universityId}</td>
                                                    <td style={{ padding: '1rem' }}>{reg.branch}</td>
                                                    <td style={{ padding: '1rem' }}>{reg.batch}</td>
                                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AdminPanel;

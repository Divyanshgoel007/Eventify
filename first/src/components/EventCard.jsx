import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";

const EventCard = ({ id, title, date, location, description, image, group, onDelete, isFeatured }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', universityId: '', batch: '', branch: '' });
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (user?.id && id) {
      fetch(`${API_URL}/events/${id}/check-registration/${user.id}`)
        .then(res => res.json())
        .then(data => setIsRegistered(!!data.isRegistered))
        .catch(e => console.error(e));
    }
  }, [user?.id, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
       alert("Event ID missing. Cannot register.");
       return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user?.id })
      });
      if (res.ok) {
        alert("Registered successfully!");
        setShowModal(false);
        setIsRegistered(true);
      } else {
        let errorMsg = "Failed to register";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseErr) {
          console.error("Non-JSON error response received");
        }
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Error processing registration. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`event-card ${isFeatured ? 'featured' : ''}`}>
        {!isFeatured && (
          <button
            className="delete-btn-card"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete Event"
          >
            ×
          </button>
        )}
        
        {/* Top: Event Image */}
        <div className="event-card-header">
          {(!isFeatured || image) && (
            <div
              className="event-image"
              style={{ backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600'})` }}
            >
              <div className="event-badge">
                {group ? group.toUpperCase() : 'EVENT'}
              </div>
            </div>
          )}
        </div>

        {/* Middle: Content */}
        <div className="event-card-body">
          <h3 className="event-title">{title}</h3>
          
          <div className="event-meta">
            <span className="meta-item">
              <span className="icon">📅</span>
              {date}
            </span>
            <span className="meta-item">
              <span className="icon">📍</span>
              {location}
            </span>
          </div>

          <p className="event-description">
            {description}
          </p>
        </div>
        
        {/* Bottom: Organizer & CTA */}
        <div className="event-card-footer">
          <div className="organizer-info">
            <div className="organizer-avatar">
               {group ? group.charAt(0).toUpperCase() : 'O'}
            </div>
            <span className="organizer-name">By {group ? group.toUpperCase() : 'Organizer'}</span>
          </div>

          <div className="action-button">
            {isRegistered ? (
              <button className="btn btn-disabled" disabled>
                Registered
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Register
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            <h2 className="text-2xl font-bold mb-6">Register for <span className="gradient-text">{title}</span></h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>University ID</label>
                <input required className="form-input" value={formData.universityId} onChange={e => setFormData({...formData, universityId: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <input required className="form-input" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} placeholder="e.g. 2026" />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <input required className="form-input" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} placeholder="e.g. Computer Science" />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                {loading ? "Registering..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;

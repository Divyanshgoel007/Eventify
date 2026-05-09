import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const EventCard = ({ id, title, date, location, description, image, group, onDelete, isFeatured }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', universityId: '', batch: '', branch: '' });
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // 3D Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
      <motion.div 
        className={`event-card ${isFeatured ? 'featured' : ''}`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {!isFeatured && user?.isAdmin && (
          <button
            className="delete-btn-card"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete Event"
          >
            ×
          </button>
        )}
        
        {/* Top: Event Image */}
        <div className="event-card-header" style={{ transform: "translateZ(30px)" }}>
          {(!isFeatured || image) && (
            <div
              className="event-image"
              style={{ backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600'})`, cursor: 'pointer', zIndex: 10, position: 'relative' }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowImageModal(true); }}
            >
              <div className="event-badge">
                {group ? group.toUpperCase() : 'EVENT'}
              </div>
            </div>
          )}
        </div>

        {/* Middle: Content */}
        <div className="event-card-body" style={{ transform: "translateZ(40px)" }}>
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
        <div className="event-card-footer" style={{ transform: "translateZ(50px)" }}>
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
      </motion.div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
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
          </motion.div>
        </div>
      )}

      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)} style={{ zIndex: 1000 }}>
          <motion.div 
            className="modal-content" 
            style={{ padding: 0, background: 'transparent', boxShadow: 'none', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
              <button 
                className="close-btn" 
                style={{ top: '-40px', right: '0', color: 'white', fontSize: '40px', background: 'transparent' }} 
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
              <img 
                src={image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600'} 
                alt={title} 
                style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '10px' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default EventCard;

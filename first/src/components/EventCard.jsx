import React from "react";

const EventCard = ({ title, date, location, description, image, onDelete }) => {
  return (
    <div className="card flex flex-col justify-between h-full">
      <button
        className="delete-btn-card"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Delete Event"
      >
        ×
      </button>
      <div>
        <div
          className="card-image"
          style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">
          {date}
        </p>
        <p className="text-muted text-sm mb-4">📍 {location}</p>
        <p className="text-muted mb-6">
          {description}
        </p>
      </div>
      <button className="btn btn-outline w-full group">
        Register Now
      </button>
    </div>
  );
};

export default EventCard;

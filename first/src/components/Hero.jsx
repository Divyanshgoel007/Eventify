import React, { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate finding an event -> Scroll to events section
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-wrapper flex items-center justify-center">
      {/* Abstract Blobs / Glassmorphism Backgrounds */}
      <div className="hero-bg-glow"></div>
      <div className="hero-bg-glow-2"></div>
      <div className="hero-bg-glow-3"></div>

      <div className="container flex items-center justify-between hero-container">
        {/* Left Column: Content */}
        <div className="hero-content">
          <span className="hero-tagline flex items-center gap-2">
            <span className="live-dot"></span>
            Premier Event Discovery
          </span>

          <h1 className="hero-title">
            Unforgettable <br />
            <span className="gradient-text">Experiences</span> Await
          </h1>

          <p className="hero-description text-muted">
            Connect, discover, and elevate your moments. Explore premium events, cultural fests, and workshops tailored to your passions.
          </p>

          <form className="hero-search-bar" onSubmit={handleSearch}>
            <div className="search-input-group">
               <span className="search-icon">🔍</span>
               <input 
                 type="text" 
                 placeholder="Search events..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="search-input"
               />
            </div>
            <div className="search-divider"></div>
            <div className="search-input-group">
               <span className="search-icon">📍</span>
               <input 
                 type="text" 
                 placeholder="Location" 
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
                 className="search-input"
               />
            </div>
            <div className="search-divider"></div>
            <div className="search-input-group category-group">
               <select value={category} onChange={(e) => setCategory(e.target.value)} className="search-select">
                  <option value="all">Categories</option>
                  <option value="tech">Tech</option>
                  <option value="culture">Cultural</option>
                  <option value="workshop">Workshop</option>
               </select>
            </div>
            <button type="submit" className="search-btn btn-primary">
              Search
            </button>
          </form>
          
          <div className="hero-stats flex gap-8">
             <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Events Hosted</span>
             </div>
             <div className="stat-item">
                <span className="stat-value">20k+</span>
                <span className="stat-label">Active Users</span>
             </div>
             <div className="stat-item">
                <span className="stat-value">50+</span>
                <span className="stat-label">Partners</span>
             </div>
          </div>
        </div>

        {/* Right Column: Floating Images */}
        <div className="hero-images hidden lg-block">
          <div className="floating-img-container img-1">
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80" alt="Concert Crowd" />
          </div>
          <div className="floating-img-container img-2">
            <img src="https://images.unsplash.com/photo-1558008258-3256797b43f3?w=500&q=80" alt="Tech Event" />
          </div>
          <div className="floating-img-container img-3">
            <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=80" alt="Networking" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

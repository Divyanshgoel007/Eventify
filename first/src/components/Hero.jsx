import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Search, MapPin, Calendar, ArrowRight, Star } from "lucide-react";
import "../App.css";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 40;
    const y = (clientY / innerHeight - 0.5) * 40;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="hero-wrapper" 
      onMouseMove={handleMouseMove}
      style={{ perspective: "1000px" }}
    >
      {/* 3D Animated Background Orbs */}
      <motion.div 
        className="hero-orb primary-orb"
        style={{ x: springX, y: springY }}
      />
      <motion.div 
        className="hero-orb secondary-orb"
        style={{ x: useTransform(springX, v => -v), y: useTransform(springY, v => -v) }}
      />
      
      <div className="container hero-container relative z-10">
        <div className="hero-grid">
          {/* Left Content Area */}
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="hero-badge"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="live-dot pulse-animation"></span>
              <span className="badge-text">Eventify Platform</span>
              <Star size={14} className="text-warning ml-2" />
            </motion.div>

            <h1 className="hero-title-3d">
              Discover, Join & <br />
              <span className="gradient-text animate-gradient">
                Create College Events
              </span>
            </h1>

            <p className="hero-subtitle">
              The ultimate platform for college students to explore hackathons, cultural fests, and workshops. Find teammates, collaborate, and build the future together.
            </p>

            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Events
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  const addBtn = document.querySelector('.add-event-trigger');
                  if (addBtn) addBtn.click();
                }}
              >
                Create Event
              </button>
            </div>
          </motion.div>

          {/* Right Floating 3D Image Composition */}
          <div className="hero-visuals-3d">
            <motion.div 
              className="visual-card-main"
              style={{ y: y1, rotateX: springY, rotateY: springX }}
            >
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800" alt="Main Event" />
              <div className="card-overlay-3d">
                <div className="card-info">
                  <h3>Tech Symposium '26</h3>
                  <p>Main Auditorium</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="visual-card-floating visual-card-1"
              style={{ y: y2 }}
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <img src="https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&q=80&w=500" alt="Tech Event" />
            </motion.div>

            <motion.div 
              className="visual-card-floating visual-card-2"
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            >
              <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=500" alt="Networking" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


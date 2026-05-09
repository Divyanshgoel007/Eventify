import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const mockSlides = [
  {
    id: 's1',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600',
    title: 'Global Tech Summit 2026',
    description: 'Join thousands of developers to shape the future of technology.',
  },
  {
    id: 's2',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1600',
    title: 'Spring Music Festival',
    description: 'Experience an unforgettable night of live performances.',
  },
  {
    id: 's3',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1600',
    title: 'Career Fair & Networking',
    description: 'Connect with top employers and land your dream job.',
  }
];

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.8,
      z: -300
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    rotateY: 0,
    scale: 1,
    z: 0
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      scale: 0.8,
      z: -300
    };
  }
};

const EventCarousel = ({ events }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  const validEvents = events && events.length > 0 ? events.slice(0, 5) : mockSlides;
  const slides = validEvents.map(ev => ({
    id: ev.id || Math.random().toString(),
    title: ev.title,
    description: ev.description,
    image: ev.image || mockSlides[0].image
  }));

  const imageIndex = Math.abs(page % slides.length);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [page, isHovered]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "2000px" }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            rotateY: { duration: 0.6 },
            z: { duration: 0.6 }
          }}
          className="carousel-slide"
          style={{ backgroundImage: `url(${slides[imageIndex].image})`, transformStyle: "preserve-3d", position: "absolute", inset: 0 }}
        >
          <div className="carousel-overlay" />
          
          <motion.div 
            className="carousel-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ transform: "translateZ(100px)", paddingLeft: '8%' }}
          >
            <h1 className="carousel-title">
              {slides[imageIndex].title}
            </h1>
            <p className="carousel-description">
              {slides[imageIndex].description}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="carousel-btn"
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Secure Your Spot
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button 
        className="carousel-arrow left"
        onClick={() => paginate(-1)}
      >
        <ArrowLeft size={24} />
      </button>
      <button 
        className="carousel-arrow right"
        onClick={() => paginate(1)}
      >
        <ArrowRight size={24} />
      </button>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`carousel-dot ${index === imageIndex ? 'active' : ''}`}
            onClick={() => {
              setPage([index, index > imageIndex ? 1 : -1]);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;

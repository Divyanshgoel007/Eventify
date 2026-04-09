import React, { useState, useEffect } from "react";

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

const EventCarousel = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Use real events if available and have images, otherwise use mock slides
  const validEvents = events && events.length > 0 ? events.slice(0, 5) : mockSlides;
  const slides = validEvents.map(ev => ({
    id: ev.id || Math.random().toString(),
    title: ev.title,
    description: ev.description,
    image: ev.image || mockSlides[0].image
  }));

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="carousel-container" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="carousel-slide" style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
              <h1 className="carousel-title">{slide.title}</h1>
              <p className="carousel-description">{slide.description}</p>
              <button 
                className="carousel-btn"
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-arrow left" onClick={prevSlide}>&#10094;</button>
      <button className="carousel-arrow right" onClick={nextSlide}>&#10095;</button>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;

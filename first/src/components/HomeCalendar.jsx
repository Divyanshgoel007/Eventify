import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { motion } from 'framer-motion';
import 'react-calendar/dist/Calendar.css';
import './HomeCalendar.css';

const HomeCalendar = ({ events }) => {
  const [date, setDate] = useState(new Date());

  // Function to highlight days with events
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const hasEvent = events.some(e => e.date === dateString);
      return hasEvent ? 'highlighted-date' : null;
    }
    return null;
  };

  return (
    <section className="container section">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <motion.div 
          className="calendar-wrapper w-full md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="calendar-glass">
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={tileClassName}
              className="futuristic-calendar"
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Never Miss An <span className="gradient-text">Event</span>
          </h2>
          <p className="text-muted mb-8 text-lg leading-relaxed">
            Stay on top of your schedule with our modern calendar. Important dates like hackathons, tech symposiums, and cultural fests are highlighted so you can plan your college life effectively.
          </p>
          
          <div className="flex gap-4">
            <div className="legend-item flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#818cf8]"></div>
               <span className="text-sm">Event Scheduled</span>
            </div>
            <div className="legend-item flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_#38bdf8]"></div>
               <span className="text-sm">Hackathon</span>
            </div>
          </div>
          
          <button 
            className="btn btn-outline mt-8"
            onClick={() => window.location.href = '/calendar'}
          >
            View Full Calendar
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeCalendar;

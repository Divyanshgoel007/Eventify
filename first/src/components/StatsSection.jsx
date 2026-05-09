import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy } from 'lucide-react';
import './StatsSection.css';

const stats = [
  { label: 'Events Hosted', value: '500+', icon: <Calendar size={28} />, color: '#818cf8' },
  { label: 'Active Users', value: '20k+', icon: <Users size={28} />, color: '#34d399' },
  { label: 'Hackathons', value: '50+', icon: <Trophy size={28} />, color: '#fbbf24' }
];

const StatsSection = () => {
  return (
    <section className="container section">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            style={{ '--stat-color': stat.color }}
          >
            <div className="stat-icon-wrapper" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;

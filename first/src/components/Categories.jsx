import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Music, Lightbulb } from 'lucide-react';
import '../App.css';
import './Categories.css';

const categories = [
  { name: 'Hackathons', icon: <Code size={32} />, color: '#ec4899' },
  { name: 'Tech', icon: <Cpu size={32} />, color: '#3b82f6' },
  { name: 'Cultural', icon: <Music size={32} />, color: '#8b5cf6' },
  { name: 'Workshops', icon: <Lightbulb size={32} />, color: '#fbbf24' }
];

const Categories = () => {
  return (
    <section className="container section">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Explore <span className="gradient-text">Categories</span>
        </h2>
        <p className="text-muted text-center max-w-2xl">
          Dive into your favorite topics. From coding marathons to cultural nights, find what moves you.
        </p>
      </div>
      
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            className="category-card"
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ '--cat-color': cat.color }}
          >
            <div className="category-icon" style={{ color: cat.color }}>
              {cat.icon}
            </div>
            <h3 className="category-name">{cat.name}</h3>
            <div className="category-glow" style={{ background: cat.color }}></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

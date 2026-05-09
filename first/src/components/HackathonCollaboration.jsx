import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import './HackathonCollaboration.css';

const teams = [
  { id: 1, name: 'CyberKnights', members: ['A', 'J', 'S'], needed: 'Frontend', color: '#38bdf8' },
  { id: 2, name: 'AI Builders', members: ['M', 'R'], needed: 'ML Engineer', color: '#c084fc' },
  { id: 3, name: 'Web3 Innovators', members: ['K', 'L', 'T'], needed: 'Smart Contract', color: '#34d399' }
];

const HackathonCollaboration = () => {
  return (
    <section className="container section">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-center">
          Hackathon <span className="gradient-text-alt">Collaboration</span>
        </h2>
        <p className="text-muted text-center max-w-2xl">
          Don't hack alone. Find your dream team, join forces, and build something extraordinary this weekend.
        </p>
      </div>

      <div className="collab-grid">
        {teams.map((team, index) => (
          <motion.div 
            key={team.id}
            className="collab-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: `0 10px 30px -10px ${team.color}` }}
          >
            <div className="collab-card-header">
              <h3 className="collab-team-name">{team.name}</h3>
              <span className="collab-badge" style={{ borderColor: team.color, color: team.color }}>
                Need {team.needed}
              </span>
            </div>
            
            <div className="collab-members">
              {team.members.map((m, i) => (
                <div key={i} className="collab-avatar" style={{ zIndex: 10 - i }}>
                  {m}
                </div>
              ))}
              <div className="collab-avatar empty-avatar">
                <Plus size={14} />
              </div>
            </div>

            <button className="btn btn-outline w-full collab-btn">
              Join Team
            </button>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <motion.button 
          className="btn btn-primary collab-main-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={18} className="mr-2 inline" />
          Find Teammates
        </motion.button>
      </div>
    </section>
  );
};

export default HackathonCollaboration;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onJoinClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          Event<span>ify</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li><Link to="/" style={{ textDecoration: 'none' }}>Events</Link></li>
            <li><Link to="/collaboration" style={{ textDecoration: 'none' }}>Collaboration</Link></li>
            <li><a href="#about" style={{ textDecoration: 'none' }}>About</a></li>
            {user ? (
              <>
                <li><span className="text-muted">Hi, {user.name}</span></li>
                <li>
                  <button onClick={handleLogout} className="btn-outline" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" style={{ textDecoration: 'none' }}>Login</Link></li>
                <li><Link to="/signup" style={{ textDecoration: 'none' }}>Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>

        {onJoinClick && (
          <button
            className="btn btn-primary text-sm"
            onClick={onJoinClick}
          >
            + Create Event
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

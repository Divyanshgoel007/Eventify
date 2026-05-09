import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/#events" },
  { name: "Hackathons", path: "/collaboration" },
  { name: "Calendar", path: "/calendar" },
];

const Navbar = ({ onJoinClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/" className="nav-logo flex items-center gap-2">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#paint0_linear)" />
              <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="paint0_linear" x1="2" y1="7" x2="22" y2="7" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9333ea" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="2" y1="19.5" x2="22" y2="19.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ec4899" />
                  <stop offset="1" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="paint2_linear" x1="2" y1="14.5" x2="22" y2="14.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">Event<span className="gradient-text">ify</span></span>
        </Link>

        {/* Hamburger Toggle */}
        <button 
          className="hamburger-menu md-hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ cursor: 'pointer', fontSize: '1.5rem', background: 'transparent', color: 'white', border: 'none', display: 'none' }}
        >
          ☰
        </button>

        {/* Center: Dynamic Navigation */}
        <nav className={`nav-center ${mobileMenuOpen ? 'mobile-open' : 'hidden'} md-block`}>
          <ul className="nav-links flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link to={item.path} className={location.pathname === item.path ? "active" : ""}>
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="dropdown">
              <span className="dropdown-trigger">Clubs</span>
              <ul className="dropdown-menu">
                <li><Link to="/clubs/acm">ACM</Link></li>
                <li><Link to="/clubs/ieee">IEEE</Link></li>
                <li><Link to="/clubs/vibinz">Vibinz</Link></li>
                <li><Link to="/clubs/cuarcs">CUArcs</Link></li>
                <li><Link to="/clubs/euphony">Euphony</Link></li>
              </ul>
            </li>
            {user?.isAdmin && (
              <li><Link to="/admin" className="admin-link">Admin Dashboard</Link></li>
            )}
          </ul>
        </nav>

        {/* Right Side: Actions & Profile */}
        <div className={`nav-actions ${mobileMenuOpen ? 'mobile-open' : 'hidden'} md-block`}>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="user-profile flex items-center gap-2">
                <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name hidden sm-block">{user.name}</span>
              </div>
              {user.isAdmin && onJoinClick ? (
                <button className="btn btn-primary btn-sm" onClick={onJoinClick}>
                  Create Event
                </button>
              ) : null}
              <button onClick={handleLogout} className="btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="login-link text-sm font-bold">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

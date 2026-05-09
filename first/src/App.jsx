import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Collaboration from './pages/Collaboration';
import ClubEvents from './pages/ClubEvents';
import EventCalendarPage from './pages/EventCalendarPage';
import AdminPanel from './pages/AdminPanel';
import './App.css';
import PwaInstallButton from './components/PwaInstallButton';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/calendar" element={<EventCalendarPage />} />
          <Route path="/clubs/:clubId" element={<ClubEvents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <PwaInstallButton />
      </AuthProvider>
    </Router>
  );
}

export default App;

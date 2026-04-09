import React from "react";

const Footer = () => {
  return (
    <footer className="footer text-center">
      <div className="container">
        <div className="mb-4">
          <h4 className="font-bold mb-2">Our Clubs</h4>
          <div className="flex justify-center gap-4 text-sm text-secondary">
            <span>ACM</span>
            <span>IEEE</span>
            <span>Vibinz</span>
            <span>CUArcs</span>
            <span>Euphony</span>
          </div>
        </div>
        <p>© 2026 Eventify. All rights reserved.</p>
        <p className="text-secondary text-sm mt-2">Designed for Campus Innovators</p>
      </div>
    </footer>
  );
};

export default Footer;

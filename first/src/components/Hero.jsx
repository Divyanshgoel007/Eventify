import React from "react";
const Hero = () => {
  return (
    <section className="hero-wrapper">
      <div className="hero-bg-glow"></div>

      <div className="container text-center flex flex-col items-center">
        <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-4">
          Campus Events Reimagined
        </span>

        <h1 className="hero-title tracking-tight mb-6">
          Discover. Connect. <br />
          <span className="gradient-text">Experience.</span>
        </h1>

        <p className="text-muted text-lg max-w-2xl mb-10 leading-relaxed">
          Your one-stop platform for hackathons, workshops, and cultural fests.
          Never miss out on what's happening on campus again.
        </p>

        <div className="flex gap-4">
          <button className="btn btn-primary">Explore Events</button>
          <button className="btn btn-outline">Learn More</button>
        </div>
      </div>
    </section>
  );
};
export default Hero;

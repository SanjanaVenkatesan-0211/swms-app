import React from "react";
import Card from "../components/Card";
import "./Home.css"; // 👈 Create this file for CSS below

export default function Home() {
  const recycleImage = "/images/recycle_green.png"; // your recycle image
  const bgFallback = "https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=1400&q=80";

  return (
    
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="brand">Smart Waste Management System</div>
        <nav className="home-nav">
          <a href="/" className="nav-link">Homeeeeeeeeeeeeeeeeee</a>
          <a href="/login" className="nav-link">Login</a>
          <a href="/register" className="nav-link">Register</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="home-hero">
        <div className="hero-left">
          <h1 className="hero-title">Clean City, Green Future 🌱</h1>
          <p className="hero-sub">
            A Smart Waste Management System that encourages sustainable living through technology and responsibility.
          </p>

          <div className="hero-ctas">
            <a className="btn primary" href="/login">Login</a>
            <a className="btn ghost" href="/register">Register</a>
          </div>

          <blockquote className="hero-quote">
            “Cleanliness and order are not matters of instinct; they are matters of education.” — Benjamin Disraeli
          </blockquote>
        </div>

        <div className="hero-right">
          <img
            src={recycleImage}
            alt="Recycle for a better tomorrow"
            className="hero-image"
            onError={(e) => { e.target.onerror = null; e.target.src = bgFallback; }}
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="features">
        <div className="feature-grid">
          <Card title="♻️ Smart Waste Pickup">
            <p className="small">Citizens can easily raise pickup requests for household or community waste.</p>
          </Card>

          <Card title="🚛 Real-time Task Updates">
            <p className="small">Drivers receive assigned routes instantly and can track completion status live.</p>
          </Card>

          <Card title="👨‍💼 Efficient Management">
            <p className="small">Admins can monitor requests, assign drivers, and maintain operational transparency.</p>
          </Card>
        </div>
      </section>
    </div>
    
  );
}

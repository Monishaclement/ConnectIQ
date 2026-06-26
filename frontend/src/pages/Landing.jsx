import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/pages/Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">ConnectIQ</Link>
        <ul className="landing-nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="landing-nav-actions">
          <Link to="/login"><Button variant="secondary" size="sm">Login</Button></Link>
          <Link to="/signup"><Button size="sm">Get Started</Button></Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-content animate-fade-in">
          <span className="hero-badge">🚀 Professional Networking Platform</span>
          <h1>Build meaningful connections that grow your network</h1>
          <p>
            ConnectIQ helps students and professionals discover people,
            connect instantly, and communicate through real-time chat.
          </p>
          <div className="hero-actions">
            <Link to="/signup"><Button size="lg">Get Started Free</Button></Link>
            <a href="#features"><Button variant="secondary" size="lg">Learn More</Button></a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle" />
          <div className="hero-card hero-card-1 card">
            <h3>Professional Profile</h3>
            <p>Create your digital identity</p>
          </div>
          <div className="hero-card hero-card-2 card">💬 Real-time Chat</div>
          <div className="hero-card hero-card-3 card">🤝 Smart Matching</div>
        </div>
      </section>

      <section id="about" className="landing-section landing-trusted">
        <p>Trusted by students and professionals</p>
        <div className="trusted-logos">
          {["Google", "Microsoft", "Amazon", "Zoho", "Infosys"].map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="section-header">
          <span className="section-tag">FEATURES</span>
          <h2>Everything you need to build your professional network</h2>
          <p>Designed for students and professionals to connect, communicate and grow together.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: "🎯", title: "Intent-Based Matching", desc: "Find people based on your goals and purpose." },
            { icon: "🧠", title: "Smart Recommendations", desc: "AI-powered matching based on skills and interests." },
            { icon: "💬", title: "Real-time Chat", desc: "Instantly communicate with your connections." },
            { icon: "🤝", title: "Connection System", desc: "Send and manage connection requests seamlessly." },
            { icon: "🛡️", title: "Trust & Safety", desc: "Verified accounts and secure interactions." },
            { icon: "📈", title: "Network Growth", desc: "Expand your reach and opportunities." },
          ].map((f) => (
            <div key={f.title} className="feature-card card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-stats">
        {[
          { num: "1,500+", label: "Users" },
          { num: "6,200+", label: "Connections" },
          { num: "3,400+", label: "Messages" },
          { num: "98%", label: "Satisfaction" },
        ].map((s) => (
          <div key={s.label} className="stat-card card">
            <h2>{s.num}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      <section id="pricing" className="landing-section">
        <div className="section-header">
          <span className="section-tag">PRICING</span>
          <h2>Simple pricing for everyone</h2>
        </div>
        <div className="pricing-grid">
          <div className="price-card card">
            <h3>Free</h3>
            <div className="price-amount">₹0</div>
            <p>Forever free</p>
            <ul>
              <li>✔ Create Profile</li>
              <li>✔ Connections</li>
              <li>✔ Chat</li>
            </ul>
            <Link to="/signup"><Button className="price-btn">Start Free</Button></Link>
          </div>
          <div className="price-card card price-popular">
            <span className="popular-badge">Most Popular</span>
            <h3>Pro</h3>
            <div className="price-amount">₹199</div>
            <p>Per month</p>
            <ul>
              <li>✔ Unlimited Requests</li>
              <li>✔ Premium Visibility</li>
              <li>✔ Analytics</li>
            </ul>
            <Link to="/signup"><Button className="price-btn">Upgrade</Button></Link>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to grow your network?</h2>
        <p>Join thousands of users building meaningful connections.</p>
        <Link to="/signup"><Button size="lg" variant="secondary">Get Started</Button></Link>
      </section>

      <footer id="contact" className="landing-footer">
        <div className="footer-grid">
          <div>
            <h3 className="footer-logo">ConnectIQ</h3>
            <p>Build meaningful connections and communicate in real-time.</p>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Support</a>
            <a href="#">Privacy</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 ConnectIQ. All rights reserved.</p>
      </footer>
    </div>
  );
}

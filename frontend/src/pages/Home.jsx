import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="home">

        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">ConnectIQ</div>

       <ul>
  <li><a href="#about">About</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#pricing">Pricing</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>

<div className="nav-buttons">
  <button
    className="login-btn"
    onClick={() => navigate("/login?mode=login")}
  >
    Login
  </button>

  <button
    className="start-btn"
    onClick={() => navigate("/login?mode=signup")}
  >
    Get Started
  </button>
</div>
        </nav>

        {/* Hero */}
        <section className="hero">

          <div className="hero-left">

            <span className="badge">
              🚀 Professional Networking Platform
            </span>

            <h1>
              Build meaningful
              <br />
              connections that
              <br />
              grow your network
            </h1>

            <p>
              ConnectIQ helps students and professionals discover people,
              connect instantly, and communicate through real-time chat.
            </p>

            <div className="hero-buttons">
             <button
  className="primary-btn"
  onClick={() => navigate("/login?mode=signup")}
>
  Get Started
</button>

<button
  className="secondary-btn"
  onClick={() =>
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
>
  Learn More
</button>
            </div>

          </div>

          {/* Right Side */}
          <div className="hero-right">

            <div className="blue-circle"></div>

            <div className="card profile-card">
              <h3>Professional Profile</h3>
              <p>Create your digital identity.</p>
            </div>

            <div className="card chat-card">
              💬 Real-time Chat
            </div>

            <div className="card connect-card">
              🤝 New Connection
            </div>

          </div>

        </section>

        {/* Trusted */}
        <section id = "about" className="trusted">

          <p>Trusted by students and professionals</p>

          <div className="companies">
            <span>Google</span>
            <span>Microsoft</span>
            <span>Amazon</span>
            <span>Zoho</span>
            <span>Infosys</span>
          </div>

        </section>
        {/* FEATURES */}

<section id ="features" className="features">

  <div className="section-heading">
    <span>FEATURES</span>

    <h2>
      Everything you need to build
      your professional network
    </h2>

    <p>
      Designed for students and professionals to connect,
      communicate and grow together.
    </p>
  </div>

  <div className="feature-grid">

    <div className="feature-card">
      <div className="icon">👥</div>

      <h3>Smart Connections</h3>

      <p>
        Discover relevant people based on your interests.
      </p>
    </div>

    <div className="feature-card">
      <div className="icon">💬</div>

      <h3>Real-time Chat</h3>

      <p>
        Instantly communicate with your connections.
      </p>
    </div>

    <div className="feature-card">
      <div className="icon">🔒</div>

      <h3>Secure Profiles</h3>

      <p>
        Verified accounts and secure interactions.
      </p>
    </div>

    <div className="feature-card">
      <div className="icon">🚀</div>

      <h3>Fast Requests</h3>

      <p>
        Send and receive requests instantly.
      </p>
    </div>

    <div className="feature-card">
      <div className="icon">📈</div>

      <h3>Network Growth</h3>

      <p>
        Expand your reach and opportunities.
      </p>
    </div>

    <div className="feature-card">
      <div className="icon">⭐</div>

      <h3>Premium Experience</h3>

      <p>
        Beautiful interface built for productivity.
      </p>
    </div>

  </div>

</section>


{/* STATS */}

<section className="stats">

  <div className="stat-box">
    <h1>1,500+</h1>
    <p>Users</p>
  </div>

  <div className="stat-box">
    <h1>6,200+</h1>
    <p>Connections</p>
  </div>

  <div className="stat-box">
    <h1>3,400+</h1>
    <p>Messages</p>
  </div>

  <div className="stat-box">
    <h1>98%</h1>
    <p>Satisfaction</p>
  </div>

</section>



{/* WHY CONNECTIQ */}

<section className="why">

<div className="why-left">

<h2>
Why users choose ConnectIQ
</h2>

<p>
ConnectIQ helps students and professionals
build genuine relationships and communicate
in real-time with a modern experience.
</p>

<button className="primary-btn">
Learn More
</button>

</div>


<div className="why-right">

<div className="why-card">
<h3>Professional Profiles</h3>
<p>Create your digital identity.</p>
</div>

<div className="why-card">
<h3>Live Messaging</h3>
<p>Talk instantly after connecting.</p>
</div>

<div className="why-card">
<h3>Connection Requests</h3>
<p>Grow your network naturally.</p>
</div>

</div>

</section>
{/* TESTIMONIALS */}

<section className="testimonials">

  <div className="section-heading">
    <span>TESTIMONIALS</span>

    <h2>
      Loved by students and professionals
    </h2>
  </div>

  <div className="testimonial-grid">

    <div className="testimonial-card">
      ⭐⭐⭐⭐⭐

      <p>
        ConnectIQ helped me connect with developers and build projects together.
      </p>

      <h3>Arjun Kumar</h3>

      <span>Software Engineer</span>
    </div>

    <div className="testimonial-card">
      ⭐⭐⭐⭐⭐

      <p>
        Beautiful interface and very smooth messaging experience.
      </p>

      <h3>Priya Sharma</h3>

      <span>Frontend Developer</span>
    </div>

    <div className="testimonial-card">
      ⭐⭐⭐⭐⭐

      <p>
        Feels like LinkedIn designed especially for students.
      </p>

      <h3>Rahul Jain</h3>

      <span>Full Stack Developer</span>
    </div>

  </div>

</section>


{/* PRICING */}

<section id = "pricing" className="pricing">

  <div className="section-heading">
    <span>PRICING</span>

    <h2>
      Simple pricing for everyone
    </h2>
  </div>

  <div className="pricing-grid">

    <div className="price-card">

      <h3>Free</h3>

      <h1>₹0</h1>

      <p>Forever free</p>

      <ul>
        <li>✔ Create Profile</li>
        <li>✔ Connections</li>
        <li>✔ Chat</li>
      </ul>

      <button className="primary-btn">
        Start Free
      </button>

    </div>


    <div className="price-card popular">

      <div className="popular-tag">
        Most Popular
      </div>

      <h3>Pro</h3>

      <h1>₹199</h1>

      <p>Per month</p>

      <ul>
        <li>✔ Unlimited Requests</li>
        <li>✔ Premium Visibility</li>
        <li>✔ Analytics</li>
      </ul>

      <button className="primary-btn">
        Upgrade
      </button>

    </div>

  </div>

</section>


{/* FAQ */}

<section className="faq">

<div className="section-heading">
<span>FAQ</span>

<h2>
Frequently asked questions
</h2>
</div>

<div className="faq-box">

<h3>How does ConnectIQ work?</h3>

<p>
Find users, connect and chat instantly.
</p>

</div>

<div className="faq-box">

<h3>Is messaging real-time?</h3>

<p>
Yes, powered by Socket.io.
</p>

</div>

<div className="faq-box">

<h3>Is it free?</h3>

<p>
Yes. Premium features are optional.
</p>

</div>

</section>


{/* CTA */}

<section className="cta-section">

<h1>
Ready to grow your network?
</h1>

<p>
Join thousands of users building meaningful connections.
</p>

<button className="cta-button">
Get Started
</button>

</section>
{/* FOOTER */}

<footer id = "contact" className="footer">

<div className="footer-top">

<div className="footer-brand">
<h2>ConnectIQ</h2>

<p>
Build meaningful connections and communicate
in real-time with professionals around the world.
</p>
</div>

<div className="footer-links">

<div>
<h3>Company</h3>

<p>About</p>
<p>Features</p>
<p>Pricing</p>
<p>Contact</p>
</div>

<div>
<h3>Resources</h3>

<p>Documentation</p>
<p>Community</p>
<p>Support</p>
<p>Privacy</p>
</div>

<div>
<h3>Social</h3>

<p>LinkedIn</p>
<p>GitHub</p>
<p>Instagram</p>
<p>X</p>
</div>

</div>

</div>

<hr />

<div className="copyright">
© 2026 ConnectIQ. All rights reserved.
</div>

</footer>

      </div>

      <style>{`

      *{
      margin:0;
      padding:0;
      box-sizing:border-box;
      font-family:Inter,sans-serif;
      }

      body{
      background:#fafafa;
      }

      .home{
      max-width:1400px;
      margin:auto;
      }

      .navbar{
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:30px 80px;
      }

      .logo{
      font-size:32px;
      font-weight:700;
      color:#4f46e5;
      }

      .navbar ul{
      display:flex;
      gap:40px;
      list-style:none;
      color:#666;
      }

      .nav-buttons{
      display:flex;
      gap:15px;
      }

      .login-btn{
      background:white;
      border:1px solid #ddd;
      padding:12px 22px;
      border-radius:15px;
      cursor:pointer;
      }

      .start-btn{
      background:#4f46e5;
      color:white;
      border:none;
      padding:12px 22px;
      border-radius:15px;
      cursor:pointer;
      }

      .hero{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:80px;
      }

      .hero-left{
      width:50%;
      }

      .badge{
      background:#eef2ff;
      color:#4f46e5;
      padding:10px 20px;
      border-radius:30px;
      font-weight:600;
      }

      .hero-left h1{
      font-size:60px;
      line-height:72px;
      margin-top:30px;
      color:#111827;
      }

      .hero-left p{
      margin-top:25px;
      color:#6b7280;
      line-height:35px;
      font-size:18px;
      max-width:550px;
      }

      .hero-buttons{
      margin-top:40px;
      display:flex;
      gap:20px;
      }

      .primary-btn{
      background:#4f46e5;
      color:white;
      border:none;
      padding:18px 30px;
      border-radius:18px;
      cursor:pointer;
      }

      .secondary-btn{
      background:white;
      border:1px solid #ddd;
      padding:18px 30px;
      border-radius:18px;
      cursor:pointer;
      }

      .hero-right{
      width:500px;
      height:500px;
      position:relative;
      }

      .blue-circle{
      width:350px;
      height:350px;
      background:#6366f1;
      border-radius:50%;
      position:absolute;
      right:80px;
      top:70px;
      }

      .card{
      background:white;
      box-shadow:0 15px 50px rgba(0,0,0,.1);
      border-radius:30px;
      position:absolute;
      padding:25px;
      transition:.3s;
      }

      .card:hover{
      transform:translateY(-8px);
      }

      .profile-card{
      width:260px;
      height:280px;
      right:100px;
      top:90px;
      }

      .chat-card{
      left:0;
      bottom:120px;
      }

      .connect-card{
      right:0;
      top:220px;
      }

      .trusted{
      text-align:center;
      padding:80px;
      }

      .trusted p{
      color:#777;
      margin-bottom:30px;
      }

      .companies{
      display:flex;
      justify-content:center;
      gap:70px;
      font-size:22px;
      color:#999;
      }
      .features{
padding:120px 80px;
}

.section-heading{
text-align:center;
max-width:700px;
margin:auto;
}

.section-heading span{
color:#4f46e5;
font-weight:700;
}

.section-heading h2{
font-size:42px;
margin-top:20px;
line-height:54px;
color:#111827;
}

.section-heading p{
margin-top:20px;
color:#6b7280;
line-height:32px;
}

.feature-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:30px;
margin-top:70px;
}

.feature-card{
background:white;
padding:40px;
border-radius:30px;
box-shadow:0 15px 40px rgba(0,0,0,.08);
transition:.3s;
}

.feature-card:hover{
transform:translateY(-10px);
}

.icon{
font-size:40px;
margin-bottom:20px;
}

.feature-card h3{
margin-bottom:15px;
}

.feature-card p{
color:#6b7280;
line-height:28px;
}

.stats{
padding:120px 80px;
display:flex;
justify-content:space-between;
}

.stat-box{
background:white;
width:250px;
padding:50px;
border-radius:30px;
box-shadow:0 15px 40px rgba(0,0,0,.08);
text-align:center;
}

.stat-box h1{
font-size:50px;
color:#4f46e5;
}

.stat-box p{
margin-top:10px;
color:#777;
}

.why{
display:flex;
justify-content:space-between;
padding:120px 80px;
align-items:center;
}

.why-left{
width:45%;
}

.why-left h2{
font-size:60px;
line-height:75px;
}

.why-left p{
margin-top:30px;
line-height:35px;
color:#6b7280;
}

.why-right{
width:45%;
display:flex;
flex-direction:column;
gap:30px;
}

.why-card{
background:white;
padding:40px;
border-radius:30px;
box-shadow:0 15px 40px rgba(0,0,0,.08);
transition:.3s;
}

.why-card:hover{
transform:translateY(-8px);
}
.testimonials{
padding:120px 80px;
}

.testimonial-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:30px;
margin-top:60px;
}

.testimonial-card{
background:white;
padding:40px;
border-radius:30px;
box-shadow:0 15px 40px rgba(0,0,0,.08);
line-height:35px;
transition:.3s;
}

.testimonial-card:hover{
transform:translateY(-8px);
}

.testimonial-card p{
margin:20px 0;
color:#6b7280;
}

.pricing{
padding:120px 80px;
}

.pricing-grid{
display:flex;
justify-content:center;
gap:40px;
margin-top:60px;
}

.price-card{
background:white;
padding:50px;
border-radius:35px;
width:350px;
box-shadow:0 15px 40px rgba(0,0,0,.08);
position:relative;
}

.price-card h1{
font-size:60px;
margin:20px 0;
color:#4f46e5;
}

.price-card ul{
margin:30px 0;
line-height:40px;
list-style:none;
}

.popular{
transform:scale(1.05);
border:2px solid #4f46e5;
}

.popular-tag{
position:absolute;
top:-15px;
left:50%;
transform:translateX(-50%);
background:#4f46e5;
color:white;
padding:10px 20px;
border-radius:30px;
}

.faq{
padding:120px 80px;
}

.faq-box{
background:white;
padding:35px;
border-radius:25px;
margin-top:25px;
box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.faq-box h3{
margin-bottom:15px;
}

.faq-box p{
color:#6b7280;
}

.cta-section{
margin:120px 80px;
padding:100px;
background:#4f46e5;
color:white;
border-radius:40px;
text-align:center;
}

.cta-section h1{
font-size:50px;
}

.cta-section p{
margin-top:25px;
font-size:20px;
}

.cta-button{
margin-top:40px;
padding:20px 40px;
background:white;
color:#4f46e5;
border:none;
border-radius:20px;
font-size:18px;
font-weight:600;
cursor:pointer;
}
.footer{
background:#111827;
color:white;
padding:100px 80px 40px;
margin-top:120px;
border-top-left-radius:50px;
border-top-right-radius:50px;
}

.footer-top{
display:flex;
justify-content:space-between;
}

.footer-brand{
width:35%;
}

.footer-brand h2{
font-size:38px;
color:#6366f1;
margin-bottom:25px;
}

.footer-brand p{
color:#d1d5db;
line-height:32px;
}

.footer-links{
display:flex;
gap:100px;
}

.footer-links h3{
margin-bottom:20px;
}

.footer-links p{
color:#9ca3af;
line-height:40px;
cursor:pointer;
transition:.3s;
}

.footer-links p:hover{
color:white;
}

.footer hr{
margin:60px 0 30px;
border:.5px solid #374151;
}

.copyright{
text-align:center;
color:#9ca3af;
}
      `}</style>
    </>
  );
}
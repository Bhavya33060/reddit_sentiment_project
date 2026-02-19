import React, { useState } from "react";


function About() {
    const [showRatePopup, setShowRatePopup] = useState(true);
  const [rating, setRating] = useState(0);

  return (
    <div className="about-container">

      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>RedditIQ</h1>
        <p>
          Transforming Reddit discussions into real-time sentiment intelligence.
        </p>
      </div>

      {/* PROBLEM */}
      <div className="about-card">
        <h2>💡 Problem We Solve</h2>
        <p>
          Social platforms generate massive unstructured discussion data.
          Extracting actionable sentiment insights from Reddit manually
          is inefficient and inconsistent.
        </p>
      </div>

      {/* SOLUTION */}
      <div className="about-card">
        <h2>🚀 Our Solution</h2>
        <p>
          RedditIQ integrates Reddit API, NLP sentiment models,
          and a scalable dashboard to classify posts and comments
          into positive, negative, and neutral sentiments —
          presenting structured analytics in real time.
        </p>
      </div>

      {/* TECH STACK */}
      <div className="about-card">
        <h2>🛠 Tech Stack</h2>

        <div className="tech-grid">
  <div>JavaScript (ES6+)</div>
  <div>React.js</div>
  <div>HTML5</div>
  <div>CSS3</div>
  <div>Firebase</div>
  <div>FastAPI</div>
  <div>Python</div>
  <div>NLP Sentiment Models</div>
  <div>Reddit API</div>
  <div>REST APIs</div>
</div>

      </div>

      {/* TEAM */}
      <div className="about-card">
        <h2>👥 Meet The Team</h2>

        <p className="team-subtext">
          A collaborative team combining product architecture,
          backend integration, and analytics intelligence.
        </p>

        <div className="team-grid">

          {/* TEAM LEAD */}
          <div className="team-member lead">
            <div className="leader-badge">TEAM LEAD</div>
            <h3>Eeswar</h3>
            <p>System Strategy & Backend Oversight</p>
            <span>ID: 2300032349</span>

            <div className="contribution">
              Defined system architecture, coordinated backend integration,
              guided deployment pipeline, and ensured project direction alignment.
            </div>
          </div>

          {/* BHAVYA */}
          <div className="team-member highlight">
            <h3>Bhavya Chowdary</h3>
            <p>Lead Product Engineer & UI Systems Architect</p>
            <span>ID: 2300033060</span>

            <div className="contribution">
              Architected the complete frontend system, designed scalable layout
  and theming engine (dark mode & density control), structured routing
  architecture, integrated APIs, and led overall product experience strategy.
            </div>
          </div>

          

          {/* HARSHITHA */}
          <div className="team-member">
            <h3>Harshitha</h3>
            <p>Data & Analytics Engineer</p>
            <span>ID: 2300032723</span>

            <div className="contribution">
              Implemented sentiment classification models,
              built analytics aggregation logic,
              and optimized data insights pipeline.
            </div>
          </div>

           {/* MANJU */}
          <div className="team-member">
            <h3>Katta Manju Sri</h3>
            <p>Backend Integration Engineer</p>
            <span>ID: 2300032570</span>

            <div className="contribution">
              Developed API endpoints, integrated Reddit API,
              handled server-side processing and data communication workflows.
            </div>
          </div>

        </div>
      </div>

      {/* VISION */}
      <div className="about-card">
        <h2>🎯 Our Vision</h2>
        <p>
          To bridge the gap between raw online discussions and
          actionable business intelligence through scalable,
          real-time sentiment analytics platforms.
        </p>
      </div>
{showRatePopup && (
  <div className="rate-popup-overlay">
    <div className="rate-popup">
      <h3>❤️ Do You Love REDDITIQ?</h3>
      <p>Rate your experience with our AI Sentiment Dashboard</p>

      <div className="heart-row">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`heart ${rating >= num ? "active" : ""}`}
            onClick={() => setRating(num)}
          >
            ❤️
          </span>
        ))}
      </div>

      {rating > 0 && (
        <p className="rate-caption">
          {rating >= 4
            ? "You're making our AI blush! 💖"
            : rating === 3
            ? "We’ll work harder to impress you!"
            : "Thanks for the honest feedback!"}
        </p>
      )}

      <button
        className="accent-btn"
        onClick={() => setShowRatePopup(false)}
      >
        Submit
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default About;

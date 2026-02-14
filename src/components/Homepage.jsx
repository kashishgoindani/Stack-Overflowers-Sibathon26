import React, { useEffect, useRef } from 'react';

const LandingPage = ({ navigateTo }) => {
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Create floating shapes
    const bgAnimation = backgroundRef.current;
    if (bgAnimation) {
      const shapes = ['◆', '▲', '●', '■', '★'];
      const colors = ['rgba(59, 130, 246, 0.1)', 'rgba(99, 179, 237, 0.1)', 'rgba(147, 51, 234, 0.1)'];
      
      for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.position = 'absolute';
        shape.style.fontSize = `${Math.random() * 40 + 20}px`;
        shape.style.color = colors[Math.floor(Math.random() * colors.length)];
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.opacity = '0.3';
        shape.style.animation = `floatShape ${Math.random() * 10 + 10}s ease-in-out infinite`;
        bgAnimation.appendChild(shape);
      }
    }
  }, []);

  return (
    <div className="page active">
      <div className="background-animation" ref={backgroundRef}></div>
      
      <div className="container">
        <div className="ai-badge">
          <span>✨</span>
          Powered by AI
        </div>

        <div className="hero-section">
          <h1 className="main-heading">
            Predict Your<br/>
            Marketing<br/>
            <span className="gradient-text">ROI with AI</span>
          </h1>
          <p className="subtitle">Upload your ad data and get instant AI-powered profit insights.</p>

          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigateTo('upload')}>
              Upload Dataset
            </button>
            <button className="btn btn-secondary">View Demo</button>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-value">98%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Campaigns Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$5M+</div>
              <div className="stat-label">ROI Predicted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
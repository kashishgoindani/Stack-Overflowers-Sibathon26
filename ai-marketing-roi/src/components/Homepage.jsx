import React, { useEffect, useRef, useState } from 'react';

const LandingPage = ({ navigateTo }) => {
  const backgroundRef = useRef(null);
  const [showDemo, setShowDemo] = useState(false);

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
            <button className="btn btn-secondary" onClick={() => setShowDemo(true)}>
              View Demo
            </button>
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

      {/* Demo Modal */}
      {showDemo && (
        <div className="demo-modal-overlay" onClick={() => setShowDemo(false)}>
          <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowDemo(false)}>×</button>
            
            <h2 className="demo-title">🎯 Interactive Demo</h2>
            <p className="demo-subtitle">See how our AI predicts your marketing ROI in real-time</p>

            <div className="demo-content">
              {/* Sample Input Section */}
              <div className="demo-section">
                <h3>📊 Sample Campaign Data</h3>
                <div className="demo-data-grid">
                  <div className="demo-data-item">
                    <span className="data-label">Ad Spend:</span>
                    <span className="data-value">$5,000</span>
                  </div>
                  <div className="demo-data-item">
                    <span className="data-label">Impressions:</span>
                    <span className="data-value">100,000</span>
                  </div>
                  <div className="demo-data-item">
                    <span className="data-label">Clicks:</span>
                    <span className="data-value">2,500</span>
                  </div>
                  <div className="demo-data-item">
                    <span className="data-label">Conversions:</span>
                    <span className="data-value">125</span>
                  </div>
                </div>
              </div>

              {/* AI Processing Animation */}
              <div className="demo-section">
                <div className="ai-processing">
                  <div className="processing-icon">🤖</div>
                  <div className="processing-text">AI Analyzing Data...</div>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>

              {/* Prediction Results */}
              <div className="demo-section">
                <h3>✨ AI Prediction Results</h3>
                <div className="prediction-card">
                  <div className="prediction-main">
                    <span className="prediction-label">Predicted ROI</span>
                    <span className="prediction-value">320%</span>
                  </div>
                  <div className="prediction-details">
                    <div className="detail-item">
                      <span>Expected Revenue:</span>
                      <span className="highlight">$16,000</span>
                    </div>
                    <div className="detail-item">
                      <span>Profit:</span>
                      <span className="highlight success">$11,000</span>
                    </div>
                    <div className="detail-item">
                      <span>Confidence Score:</span>
                      <span className="highlight">98%</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => {
                setShowDemo(false);
                navigateTo('upload');
              }}>
                Try It With Your Data →
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .demo-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .demo-modal {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 24px;
          padding: 40px;
          max-width: 700px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(59, 130, 246, 0.2);
          animation: slideUp 0.4s ease;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 32px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: rotate(90deg);
        }

        .demo-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
          text-align: center;
        }

        .demo-subtitle {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .demo-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .demo-section h3 {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .demo-data-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .demo-data-item {
          background: rgba(59, 130, 246, 0.1);
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .data-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .data-value {
          color: #3b82f6;
          font-weight: 700;
          font-size: 18px;
        }

        .ai-processing {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
          padding: 30px;
          border-radius: 16px;
          text-align: center;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .processing-icon {
          font-size: 48px;
          margin-bottom: 15px;
          animation: bounce 1s infinite;
        }

        .processing-text {
          color: white;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 3px;
          animation: progress 2s ease-in-out infinite;
        }

        .prediction-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
          padding: 25px;
          border-radius: 16px;
          border: 2px solid rgba(59, 130, 246, 0.3);
        }

        .prediction-main {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .prediction-label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 10px;
        }

        .prediction-value {
          display: block;
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .prediction-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
        }

        .highlight {
          color: #3b82f6;
          font-weight: 700;
          font-size: 18px;
        }

        .highlight.success {
          color: #10b981;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        @media (max-width: 768px) {
          .demo-modal {
            padding: 30px 20px;
          }

          .demo-data-grid {
            grid-template-columns: 1fr;
          }

          .demo-title {
            font-size: 24px;
          }

          .prediction-value {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
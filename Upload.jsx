import React, { useState, useRef, useEffect } from 'react';

const UploadPage = ({ navigateTo }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('Uploading...');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Create floating shapes
    const bg = backgroundRef.current;
    if (bg) {
      const shapes = ['◆', '▲', '●', '■'];
      for (let i = 0; i < 10; i++) {
        const el = document.createElement('div');
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.cssText = `position:absolute;font-size:${Math.random()*30+20}px;color:rgba(139,92,246,${Math.random()*0.2+0.05});left:${Math.random()*100}%;top:${Math.random()*100}%;animation:floatShape ${Math.random()*15+10}s ease-in-out infinite`;
        bg.appendChild(el);
      }
    }
  }, []);

  const handleFileSelect = (file) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please upload a CSV or Excel file');
      return;
    }

    setSelectedFile(file);
    simulateUpload();
  };

  const simulateUpload = () => {
    let progress = 0;
    setUploadStatus('Uploading...');

    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadStatus('Upload complete! Processing data...');
        
        setTimeout(() => {
          setUploadStatus('Analyzing your data...');
          setTimeout(() => {
            navigateTo('dashboard');
          }, 1500);
        }, 2000);
      }
      setUploadProgress(progress);
    }, 200);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('Uploading...');
  };

  return (
    <div className="page active">
      <div className="background" ref={backgroundRef}></div>
      
      <div className="upload-container">
        <header className="upload-header">
          <h1 className="title">AI Marketing ROI Predictor</h1>
          <p className="subtitle">Upload your marketing data to get instant ROI predictions</p>
        </header>

        <div className="upload-section">
          {!selectedFile ? (
            <div 
              className={`upload-box ${isDragging ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="30" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4"/>
                  <path d="M40 30V50M40 30L33 37M40 30L47 37" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 55H50" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="10" y1="10" x2="70" y2="70">
                      <stop stopColor="#8B5CF6"/>
                      <stop offset="1" stopColor="#6366F1"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2 className="upload-title">Upload CSV or Excel File</h2>
              <p className="upload-description">Drag and drop your dataset here</p>
              <button className="browse-btn" onClick={() => fileInputRef.current.click()}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 14L10 6M10 6L7 9M10 6L13 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Browse File
              </button>
              <p className="supported-formats">Supported formats: .csv, .xlsx</p>
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".csv,.xlsx,.xls" 
                style={{display: 'none'}}
                onChange={(e) => e.target.files.length > 0 && handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <div className="file-icon">📊</div>
                <div className="file-details">
                  <h3>{selectedFile.name}</h3>
                  <p>{formatFileSize(selectedFile.size)}</p>
                </div>
                <button className="remove-btn" onClick={resetUpload}>✕</button>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${uploadProgress}%`}}></div>
              </div>
              <p className={`upload-status ${uploadProgress === 100 ? 'success' : ''}`}>
                {uploadStatus}
              </p>
            </div>
          )}
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Powered</h3>
            <p className="feature-description">Advanced machine learning algorithms</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Instant Results</h3>
            <p className="feature-description">Get predictions in seconds</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Accurate Insights</h3>
            <p className="feature-description">95% prediction accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
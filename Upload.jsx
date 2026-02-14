import React, { useState, useRef, useEffect } from 'react';

const UploadPage = ({ navigateTo, onDataReceived }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const backgroundRef = useRef(null);

  const API_BASE_URL = 'http://127.0.0.1:5000';

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
      setError('Please upload a CSV or Excel file');
      return;
    }

    // Reset any previous errors
    setError(null);
    setSelectedFile(file);
    setUploadProgress(0);
    
    // Start upload immediately
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadStatus('Uploading file...');
    setUploadProgress(10);

    // Clear any cached data
    sessionStorage.removeItem('dashboardData');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      setUploadProgress(100);
      setUploadStatus('Upload complete! Processing data...');

      // Pass data to parent component or dashboard
      if (onDataReceived) {
        onDataReceived(data);
      }

      // Store data in sessionStorage for dashboard access
      sessionStorage.setItem('dashboardData', JSON.stringify(data));

      setTimeout(() => {
        setUploadStatus('Analysis complete! Redirecting...');
        setTimeout(() => {
          navigateTo('dashboard');
        }, 1000);
      }, 1500);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
      setUploadStatus('Upload failed');
      setUploadProgress(0);
      setIsUploading(false);
    }
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
    setUploadStatus('');
    setError(null);
    setIsUploading(false);
    
    // CRITICAL: Reset the file input to allow selecting the same or different file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page active">
      <div className="background" ref={backgroundRef}></div>
      
      <div className="upload-container">
        <header className="upload-header">
          <h1 className="title">AI Marketing ROI Predictor</h1>
          <p className="subtitle">Upload your marketing data to get instant ROI predictions</p>
        </header>

        {error && (
          <div className="error-banner">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

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
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
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
                {!isUploading && (
                  <button className="remove-btn" onClick={resetUpload}>✕</button>
                )}
              </div>
              {uploadProgress > 0 && (
                <>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${uploadProgress}%`}}></div>
                  </div>
                  <p className={`upload-status ${uploadProgress === 100 ? 'success' : ''}`}>
                    {uploadStatus}
                  </p>
                </>
              )}
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
            <p className="feature-description">98% prediction accuracy</p>
          </div>
        </div>

        <div className="help-section">
          <h3>Need help with your data format?</h3>
          <p>Your file should contain these columns:</p>
          <div className="required-columns">
            <span className="column-tag">Budget</span>
            <span className="column-tag">Duration</span>
            <span className="column-tag">Platform</span>
            <span className="column-tag">Content_Type</span>
            <span className="column-tag">Target_Gender</span>
            <span className="column-tag">Region</span>
            <span className="column-tag">Target_Age</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ef4444;
          animation: slideDown 0.3s ease;
        }

        .error-banner svg {
          flex-shrink: 0;
        }

        .error-banner span {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .error-banner button {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .error-banner button:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .help-section {
          margin-top: 40px;
          text-align: center;
          padding: 30px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(139, 92, 246, 0.1);
        }

        .help-section h3 {
          color: white;
          font-size: 18px;
          margin-bottom: 12px;
        }

        .help-section p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
        }

        .required-columns {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .column-tag {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UploadPage;
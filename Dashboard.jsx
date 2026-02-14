import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

const DashboardPage = ({ navigateTo }) => {
  const platformChartRef = useRef(null);
  const roiChartRef = useRef(null);
  const backgroundRef = useRef(null);
  const [charts, setCharts] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from sessionStorage
    const storedData = sessionStorage.getItem('dashboardData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setLoading(false);
    } else {
      setLoading(false);
      // No data available - show default
    }
  }, []);

  useEffect(() => {
    if (!data) return;

    // Chart.js configuration
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.borderColor = 'rgba(99, 102, 241, 0.1)';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    const createGradient = (ctx, color1, color2) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      return gradient;
    };

    // Process platform data from actual results
    const platformData = {};
    data.campaigns.forEach(campaign => {
      const platform = campaign.Platform;
      if (!platformData[platform]) {
        platformData[platform] = {
          total: 0,
          successful: 0,
          budget: 0
        };
      }
      platformData[platform].total++;
      if (campaign.Predicted_Success === 1) {
        platformData[platform].successful++;
      }
      platformData[platform].budget += campaign.Budget || 0;
    });

    const platforms = Object.keys(platformData);
    const successRates = platforms.map(p => 
      (platformData[p].successful / platformData[p].total * 100).toFixed(1)
    );
    const budgets = platforms.map(p => platformData[p].budget);

    // Platform Chart
    if (platformChartRef.current) {
      const platformCtx = platformChartRef.current.getContext('2d');
      const platformGradient1 = createGradient(platformCtx, 'rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.3)');
      const platformGradient2 = createGradient(platformCtx, 'rgba(99, 102, 241, 0.8)', 'rgba(99, 102, 241, 0.3)');
      
      const platformChart = new Chart(platformCtx, {
        type: 'bar',
        data: {
          labels: platforms,
          datasets: [{
            label: 'Success Rate (%)',
            data: successRates,
            backgroundColor: platforms.map((_, i) => i % 2 === 0 ? platformGradient1 : platformGradient2),
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(99, 102, 241, 0.1)' },
              ticks: { callback: (value) => value + '%' }
            },
            x: { grid: { display: false } }
          }
        }
      });

      // ROI Distribution Chart
      if (roiChartRef.current) {
        const roiCtx = roiChartRef.current.getContext('2d');
        
        const roiChart = new Chart(roiCtx, {
          type: 'doughnut',
          data: {
            labels: ['Successful Campaigns', 'Unsuccessful Campaigns'],
            datasets: [{
              data: [data.predicted_successful, data.predicted_unsuccessful],
              backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)'
              ],
              borderWidth: 0,
              borderRadius: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: { padding: 20, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } }
              }
            }
          }
        });

        setCharts({ platformChart, roiChart });
      }
    }

    // Floating shapes
    const bg = backgroundRef.current;
    if (bg && bg.children.length === 0) {
      const shapes = ['◆', '▲', '●', '■'];
      for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.cssText = `position:absolute;font-size:${Math.random()*30+20}px;color:rgba(139,92,246,${Math.random()*0.1+0.03});left:${Math.random()*100}%;top:${Math.random()*100}%;animation:floatShape ${Math.random()*20+15}s ease-in-out infinite;pointer-events:none;`;
        bg.appendChild(el);
      }
    }

    // Cleanup
    return () => {
      Object.values(charts).forEach(chart => chart?.destroy());
    };
  }, [data]);

  const handleDownload = () => {
    if (!data) return;
    
    const reportContent = `
AI MARKETING ROI ANALYSIS REPORT
================================
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
------------------
Total Campaigns: ${data.total_campaigns}
Predicted Successful: ${data.predicted_successful}
Predicted Unsuccessful: ${data.predicted_unsuccessful}
Success Rate: ${data.success_rate}%
Average Confidence: ${data.avg_confidence}%

CAMPAIGN DETAILS
------------------
${data.campaigns.slice(0, 20).map((c, i) => 
`${i+1}. Platform: ${c.Platform}, Budget: $${c.Budget}, Recommendation: ${c.Recommendation}, Confidence: ${c.Success_Probability?.toFixed(1)}%`
).join('\n')}

---
This report was generated by AI Marketing ROI Predictor
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Marketing_Report_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page active">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page active">
        <div className="background" ref={backgroundRef}></div>
        <div className="dashboard-container">
          <div className="empty-state">
            <h2>No Data Available</h2>
            <p>Please upload a dataset first</p>
            <button className="btn btn-primary" onClick={() => navigateTo('upload')}>
              Upload Dataset
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="background" ref={backgroundRef}></div>
      
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <h1 className="title">AI Analysis Dashboard</h1>
            <p className="subtitle">Real-time marketing performance insights</p>
          </div>
          <div className="header-right">
            <button className="btn-new-upload" onClick={() => navigateTo('upload')}>
              📊 Upload New Dataset
            </button>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Campaigns</p>
              <h3 className="stat-value">{data.total_campaigns}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Predicted Successful</p>
              <h3 className="stat-value">{data.predicted_successful}</h3>
              <p className="stat-change positive">+{data.success_rate}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Predicted Unsuccessful</p>
              <h3 className="stat-value">{data.predicted_unsuccessful}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Avg Confidence</p>
              <h3 className="stat-value">{data.avg_confidence}%</h3>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Success Rate by Platform</h3>
            <canvas ref={platformChartRef}></canvas>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Campaign Predictions</h3>
            <canvas ref={roiChartRef}></canvas>
          </div>
        </div>

        <div className="recommendations-section">
          <div className="recommendations-header">
            <div className="ai-badge-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Top Campaigns to Invest In
            </div>
          </div>
          
          <div className="recommendations-list">
            {data.campaigns
              .filter(c => c.Predicted_Success === 1)
              .sort((a, b) => b.Success_Probability - a.Success_Probability)
              .slice(0, 5)
              .map((campaign, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-icon">✅</div>
                  <div className="recommendation-content">
                    <p className="recommendation-text">
                      <strong>{campaign.Platform}</strong> - {campaign.Content_Type} 
                      {campaign.Budget && ` | Budget: $${campaign.Budget.toLocaleString()}`}
                    </p>
                    <p className="recommendation-meta">
                      Confidence: {campaign.Success_Probability?.toFixed(1)}% 
                      {campaign.Target_Age && ` | Age: ${campaign.Target_Age}`}
                      {campaign.Region && ` | Region: ${campaign.Region}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="footer-actions">
          <button className="btn-download" onClick={handleDownload}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

const DashboardPage = ({ navigateTo }) => {
  const platformChartRef = useRef(null);
  const roiChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const forecastChartRef = useRef(null);
  const backgroundRef = useRef(null);
  const [charts, setCharts] = useState({});

  useEffect(() => {
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

    // Platform Chart
    const platformCtx = platformChartRef.current.getContext('2d');
    const platformGradient1 = createGradient(platformCtx, 'rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.3)');
    const platformGradient2 = createGradient(platformCtx, 'rgba(99, 102, 241, 0.8)', 'rgba(99, 102, 241, 0.3)');
    
    const platformChart = new Chart(platformCtx, {
      type: 'bar',
      data: {
        labels: ['Facebook', 'Google', 'Instagram', 'TikTok'],
        datasets: [{
          label: 'Profit ($)',
          data: [45000, 62000, 38000, 28000],
          backgroundColor: [platformGradient1, platformGradient2, platformGradient1, platformGradient2],
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
            grid: { color: 'rgba(99, 102, 241, 0.1)' },
            ticks: { callback: (value) => '$' + value.toLocaleString() }
          },
          x: { grid: { display: false } }
        }
      }
    });

    // ROI Trend Chart
    const roiCtx = roiChartRef.current.getContext('2d');
    const roiGradient = roiCtx.createLinearGradient(0, 0, 0, 300);
    roiGradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    roiGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    const roiChart = new Chart(roiCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'ROI %',
          data: [65, 75, 82, 88, 95, 102],
          borderColor: '#6366F1',
          backgroundColor: roiGradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6366F1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(99, 102, 241, 0.1)' },
            ticks: { callback: (value) => value + '%' }
          },
          x: { grid: { display: false } }
        }
      }
    });

    // Revenue Chart
    const revenueCtx = revenueChartRef.current.getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
      type: 'doughnut',
      data: {
        labels: ['Facebook 38%', 'Google 36%', 'Instagram 26%'],
        datasets: [{
          data: [38, 36, 26],
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)',
            'rgba(99, 102, 241, 0.8)',
            'rgba(147, 197, 253, 0.8)'
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

    // Forecast Chart
    const forecastCtx = forecastChartRef.current.getContext('2d');
    const forecastGradient = forecastCtx.createLinearGradient(0, 0, 0, 300);
    forecastGradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
    forecastGradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');

    const forecastChart = new Chart(forecastCtx, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Predicted ROI',
          data: [100, 115, 130, 155, 175, 195],
          borderColor: '#8B5CF6',
          backgroundColor: forecastGradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#8B5CF6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(99, 102, 241, 0.1)' },
            ticks: { callback: (value) => '$' + value + 'K' }
          },
          x: { grid: { display: false } }
        }
      }
    });

    setCharts({ platformChart, roiChart, revenueChart, forecastChart });

    // Floating shapes
    const bg = backgroundRef.current;
    if (bg) {
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
  }, []);

  const handleDownload = () => {
    const reportContent = `
AI MARKETING ROI ANALYSIS REPORT
================================
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
------------------
Total Revenue: $124,500 (+12.5%)
Total Cost: $342,800 (+8.2%)
Success Rate: 175% (+4.2%)
Predicted Profit: $218,300 (+16.4%)

PROFIT BY PLATFORM
------------------
• Facebook: $45,000
• Google: $62,000
• Instagram: $38,000
• TikTok: $28,000

REVENUE CONTRIBUTION
--------------------
• Facebook: 38%
• Google: 36%
• Instagram: 26%

AI RECOMMENDATIONS
------------------
1. Increase budget on Google Ads by 15% for optimal ROI
2. Reduce spending on low ROI campaigns on Facebook
3. TikTok shows strong growth potential - consider scaling
4. Instagram engagement is declining - review creative assets
5. Best performing time: Weekdays 10AM-11AM

ROI TREND (Jan-Jun)
-------------------
Jan: 65%
Feb: 75%
Mar: 82%
Apr: 88%
May: 95%
Jun: 102%

AI FORECAST (Jul-Dec)
---------------------
Jul: $100K
Aug: $115K
Sep: $130K
Oct: $155K
Nov: $175K
Dec: $195K

---
This report was generated by AI Marketing ROI Predictor
For more information, visit our dashboard
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
            <p className="last-updated">Last updated: 1/02/2025</p>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Revenue</p>
              <h3 className="stat-value">$124,500</h3>
              <p className="stat-change positive">+12.5%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Cost</p>
              <h3 className="stat-value">$342,800</h3>
              <p className="stat-change positive">+8.2%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Success Rate</p>
              <h3 className="stat-value">175%</h3>
              <p className="stat-change positive">+4.2%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Predicted Profit</p>
              <h3 className="stat-value">$218,300</h3>
              <p className="stat-change positive">+16.4%</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Profit by Platform</h3>
            <canvas ref={platformChartRef}></canvas>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">ROI Trend Over Time</h3>
            <canvas ref={roiChartRef}></canvas>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Revenue Contribution per Platform</h3>
            <canvas ref={revenueChartRef}></canvas>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">AI ROI Forecast</h3>
            <canvas ref={forecastChartRef}></canvas>
          </div>
        </div>

        <div className="recommendations-section">
          <div className="recommendations-header">
            <div className="ai-badge-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              AI Recommendations
            </div>
          </div>
          
          <div className="recommendations-list">
            {[
              'Increase budget on Google Ads by 15% for optimal ROI',
              'Reduce spending on low ROI campaigns on Facebook',
              'TikTok shows strong growth potential - consider scaling',
              'Instagram engagement is declining - review creative assets',
              'Best performing time: Weekdays 10AM-11AM'
            ].map((text, index) => (
              <div key={index} className="recommendation-item">
                <div className="recommendation-icon">💡</div>
                <p className="recommendation-text">{text}</p>
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
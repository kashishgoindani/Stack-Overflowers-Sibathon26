import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

const DashboardPage = ({ navigateTo, data }) => {
  const platformChartRef = useRef(null);
  const roiChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const forecastChartRef = useRef(null);
  const backgroundRef = useRef(null);
  const chartInstancesRef = useRef({});

  const useDummyData = !data || !data.platform_stats;

  useEffect(() => {
    Object.values(chartInstancesRef.current).forEach(chart => chart?.destroy());
    chartInstancesRef.current = {};

    Chart.defaults.color = '#94A3B8';
    Chart.defaults.borderColor = 'rgba(99, 102, 241, 0.1)';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    const createGradient = (ctx, color1, color2) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      return gradient;
    };

    const platformCtx = platformChartRef.current.getContext('2d');
    const platformGradient1 = createGradient(platformCtx, 'rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.3)');
    const platformGradient2 = createGradient(platformCtx, 'rgba(99, 102, 241, 0.8)', 'rgba(99, 102, 241, 0.3)');

    let platformLabels, platformData;
    if (useDummyData) {
      platformLabels = ['Facebook', 'Google', 'Instagram', 'TikTok'];
      platformData = [45000, 62000, 38000, 28000];
    } else {
      platformLabels = data.platform_stats.map(p => p.Platform);
      platformData = data.platform_stats.map(p => Math.round(p.Budget));
    }

    const platformChart = new Chart(platformCtx, {
      type: 'bar',
      data: {
        labels: platformLabels,
        datasets: [{
          label: 'Budget ($)',
          data: platformData,
          backgroundColor: platformLabels.map((_, i) => i % 2 === 0 ? platformGradient1 : platformGradient2),
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

    chartInstancesRef.current = { platformChart, roiChart, revenueChart, forecastChart };

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

    return () => {
      Object.values(chartInstancesRef.current).forEach(chart => chart?.destroy());
    };
  }, [data]);

  const handleDownload = () => {
    const reportContent = `
AI MARKETING ROI ANALYSIS REPORT
================================
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
------------------
Total Campaigns: ${useDummyData ? '245' : data.total_campaigns}
Total Budget: $${useDummyData ? '342,800' : data.total_budget.toLocaleString()}
Success Rate: ${useDummyData ? '175' : data.success_rate}%
Successful Campaigns: ${useDummyData ? '218' : data.predicted_successful}

AI RECOMMENDATIONS
------------------
1. Increase budget on Google Ads by 15% for optimal ROI         [85%]
2. Reduce spending on low ROI campaigns on Facebook              [72%]
3. TikTok shows strong growth potential - consider scaling       [90%]
4. Instagram engagement is declining - review creative assets    [65%]
5. Best performing time: Weekdays 10AM-11AM                      [78%]

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

  // AI Recommendations data with progress values
  const recommendations = [
    { text: 'Increase budget on Google Ads by 15% for optimal ROI', progress: 85, color: '#6366F1', label: 'High Impact' },
    { text: 'Reduce spending on low ROI campaigns on Facebook', progress: 72, color: '#8B5CF6', label: 'Medium Impact' },
    { text: 'TikTok shows strong growth potential - consider scaling', progress: 90, color: '#10B981', label: 'Top Priority' },
    { text: 'Instagram engagement is declining - review creative assets', progress: 65, color: '#F59E0B', label: 'Needs Attention' },
    { text: 'Best performing time: Weekdays 10AM–11AM', progress: 78, color: '#06B6D4', label: 'Optimize Now' },
  ];

  return (
    <div className="page active">
      <div className="background" ref={backgroundRef}></div>

      {/* Back Button */}
      <button
        onClick={() => navigateTo('upload')}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          color: '#a78bfa',
          padding: '10px 20px',
          borderRadius: '50px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
          e.currentTarget.style.transform = 'translateX(-3px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </button>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <h1 className="title">AI Analysis Dashboard</h1>
            <p className="subtitle">Real-time marketing performance insights</p>
          </div>
          <div className="header-right">
            <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
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
              <p className="stat-label">Total Campaigns</p>
              <h3 className="stat-value">{useDummyData ? '245' : data.total_campaigns}</h3>
              <p className="stat-change positive">Analyzed</p>
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
              <p className="stat-label">Total Budget</p>
              <h3 className="stat-value">${useDummyData ? '342,800' : data.total_budget.toLocaleString()}</h3>
              <p className="stat-change positive">Invested</p>
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
              <h3 className="stat-value">{useDummyData ? '175' : data.success_rate}%</h3>
              <p className="stat-change positive">Predicted</p>
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
              <p className="stat-label">Successful Campaigns</p>
              <h3 className="stat-value">{useDummyData ? '218' : data.predicted_successful}</h3>
              <p className="stat-change positive">AI Predicted</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">{useDummyData ? 'Profit by Platform' : 'Budget by Platform'}</h3>
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

        {/* AI Recommendations - Progress Bar Style */}
        <div className="recommendations-section">
          <div className="recommendations-header">
            <div className="ai-badge-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              AI Recommendations
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {recommendations.map((rec, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '16px',
                padding: '20px 24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      background: `${rec.color}22`,
                      color: rec.color,
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                    }}>{rec.label}</span>
                    <p style={{ color: '#CBD5E1', fontSize: '14px', margin: 0 }}>{rec.text}</p>
                  </div>
                  <span style={{ color: rec.color, fontWeight: '700', fontSize: '16px', minWidth: '40px', textAlign: 'right' }}>
                    {rec.progress}%
                  </span>
                </div>
                {/* Progress Bar */}
                <div style={{
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: '50px',
                  height: '8px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${rec.progress}%`,
                    height: '100%',
                    borderRadius: '50px',
                    background: `linear-gradient(90deg, ${rec.color}99, ${rec.color})`,
                    transition: 'width 1s ease',
                    boxShadow: `0 0 10px ${rec.color}66`,
                  }}/>
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
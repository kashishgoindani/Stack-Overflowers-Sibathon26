// PAGE NAVIGATION
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Initialize dashboard charts when dashboard is shown
    if (pageId === 'dashboardPage') {
        setTimeout(initDashboard, 100);
    }
}

// LANDING PAGE SCRIPTS
document.addEventListener('DOMContentLoaded', function() {
    // Landing page - Create floating shapes
    const bgAnimation = document.querySelector('#landingPage .background-animation');
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

        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatShape {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(20px, -30px) rotate(90deg); }
                50% { transform: translate(-20px, -60px) rotate(180deg); }
                75% { transform: translate(-40px, -30px) rotate(270deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // UPLOAD PAGE SCRIPTS
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const filePreview = document.getElementById('filePreview');
    const removeBtn = document.getElementById('removeBtn');
    const progressFill = document.getElementById('progressFill');
    const uploadStatus = document.getElementById('uploadStatus');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');

    if (browseBtn) {
        browseBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });
    }

    if (uploadBox) {
        uploadBox.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadBox.classList.add('dragover');
        });

        uploadBox.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
        });

        uploadBox.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', resetUpload);
    }

    function handleFile(file) {
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            alert('Please upload a CSV or Excel file');
            return;
        }

        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        uploadBox.style.display = 'none';
        filePreview.style.display = 'block';
        simulateUpload();
    }

    function simulateUpload() {
        let progress = 0;
        uploadStatus.textContent = 'Uploading...';
        uploadStatus.classList.remove('success');

        const interval = setInterval(function() {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                uploadStatus.textContent = 'Upload complete! Processing data...';
                uploadStatus.classList.add('success');
                
                setTimeout(function() {
                    uploadStatus.textContent = 'Analyzing your data...';
                    setTimeout(function() {
                        showPage('dashboardPage');
                    }, 1500);
                }, 2000);
            }
            progressFill.style.width = progress + '%';
        }, 200);
    }

    function resetUpload() {
        fileInput.value = '';
        uploadBox.style.display = 'block';
        filePreview.style.display = 'none';
        progressFill.style.width = '0%';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Upload page floating shapes
    const uploadBg = document.querySelector('#uploadPage .background');
    if (uploadBg) {
        const shapes = ['◆', '▲', '●', '■'];
        for (let i = 0; i < 10; i++) {
            const el = document.createElement('div');
            el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            el.style.cssText = `position:absolute;font-size:${Math.random()*30+20}px;color:rgba(139,92,246,${Math.random()*0.2+0.05});left:${Math.random()*100}%;top:${Math.random()*100}%;animation:floatShape ${Math.random()*15+10}s ease-in-out infinite`;
            uploadBg.appendChild(el);
        }
    }
});

// DASHBOARD SCRIPTS
let chartsInitialized = false;

function initDashboard() {
    if (chartsInitialized) return;
    chartsInitialized = true;

    // Chart.js default configuration
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
    const platformCtx = document.getElementById('platformChart').getContext('2d');
    const platformGradient1 = createGradient(platformCtx, 'rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.3)');
    const platformGradient2 = createGradient(platformCtx, 'rgba(99, 102, 241, 0.8)', 'rgba(99, 102, 241, 0.3)');
    
    new Chart(platformCtx, {
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
                    ticks: { callback: function(value) { return '$' + value.toLocaleString(); } }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // ROI Trend Chart
    const roiCtx = document.getElementById('roiTrendChart').getContext('2d');
    const roiGradient = roiCtx.createLinearGradient(0, 0, 0, 300);
    roiGradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    roiGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    new Chart(roiCtx, {
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
                    ticks: { callback: function(value) { return value + '%'; } }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
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
    const forecastCtx = document.getElementById('forecastChart').getContext('2d');
    const forecastGradient = forecastCtx.createLinearGradient(0, 0, 0, 300);
    forecastGradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
    forecastGradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');

    new Chart(forecastCtx, {
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
                    ticks: { callback: function(value) { return '$' + value + 'K'; } }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // Download button
    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Create downloadable report content
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
            
            // Create blob and download
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AI_Marketing_Report_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Show success message
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Downloaded!';
            downloadBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)';
            }, 2000);
        });
    }

    // Dashboard floating shapes
    const dashBg = document.querySelector('#dashboardPage .background');
    if (dashBg) {
        const shapes = ['◆', '▲', '●', '■'];
        for (let i = 0; i < 8; i++) {
            const el = document.createElement('div');
            el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            el.style.cssText = `position:absolute;font-size:${Math.random()*30+20}px;color:rgba(139,92,246,${Math.random()*0.1+0.03});left:${Math.random()*100}%;top:${Math.random()*100}%;animation:floatShape ${Math.random()*20+15}s ease-in-out infinite;pointer-events:none;`;
            dashBg.appendChild(el);
        }
    }
}
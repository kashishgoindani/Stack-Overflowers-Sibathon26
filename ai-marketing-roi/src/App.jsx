import React, { useState } from 'react';
import LandingPage from './components/Homepage';
import UploadPage from './components/Upload';
import DashboardPage from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [predictionData, setPredictionData] = useState(null);

  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    if (data) {
      setPredictionData(data);
    }
  };

  return (
    <div className="App">
      {currentPage === 'landing' && <LandingPage navigateTo={navigateTo} />}
      {currentPage === 'upload' && <UploadPage navigateTo={navigateTo} />}
      {currentPage === 'dashboard' && <DashboardPage navigateTo={navigateTo} data={predictionData} />}
    </div>
  );
}

export default App;
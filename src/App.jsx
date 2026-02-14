import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import DashboardPage from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {currentPage === 'landing' && <LandingPage navigateTo={navigateTo} />}
      {currentPage === 'upload' && <UploadPage navigateTo={navigateTo} />}
      {currentPage === 'dashboard' && <DashboardPage navigateTo={navigateTo} />}
    </div>
  );
}

export default App;
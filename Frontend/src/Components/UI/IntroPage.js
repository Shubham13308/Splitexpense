import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../Css/IntroPage.css'

const IntroPage = () => {
  const navigate = useNavigate(); 

  const handleGetStarted = () => {
    navigate('/group'); 
  };

  return (
    <div className="intro-container">
      <h1 className="intro-title">Welcome to Split Expense</h1>
      <button className="get-started-btn" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default IntroPage;

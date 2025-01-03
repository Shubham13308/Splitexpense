import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Header.css";

const Header = () => {
  const currentDate = new Date().toLocaleDateString();
  const navigate = useNavigate();

  const handleNavigate = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token"); 
    }
    navigate("/group"); 
  };

  return (
    <header className="header-container">
      <div className="header-section">
        <button type="button" onClick={handleNavigate} className="btn btn-danger">
          Back
        </button>
      </div>
      <div className="header-section">
        <span className="animated-link">Split The Money</span>
      </div>
      <div className="header-section">
        <span>{currentDate}</span>
      </div>
      <div className="menu-icon">
        <i className="fas fa-bars"></i>
      </div>
    </header>
  );
};

export default Header;

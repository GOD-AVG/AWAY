import React, { useEffect } from "react";
import "../styles/logopage.css";
import { useNavigate } from "react-router-dom";

const LogoPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth", { replace: true }); // Replace in history
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logo-page-container">
      <h1 className="app-title">AWAY</h1>
      <div className="loading-animation">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    </div>
  );
};

export default LogoPage;

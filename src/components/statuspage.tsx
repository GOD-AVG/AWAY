import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/statuspage.css";

const StatusPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="status-page">
      <div className="status-container">
        <button
          className="home-button"
          onClick={() => navigate("/home")}
          aria-label="Go to homepage"
        >
          <svg
            viewBox="0 0 24 24"
            className="home-icon"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default StatusPage;

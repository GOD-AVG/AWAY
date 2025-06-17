import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profilepage.css";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleReload = () => {
    navigate("/home");
  };

  return (
    <div className="profile-page">
      <h1>ProfilePage</h1>
      <button className="reload-button" onClick={handleReload}>
        Reload
      </button>
    </div>
  );
};

export default ProfilePage;

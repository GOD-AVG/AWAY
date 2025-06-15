import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogoPage from "./components/logopage";
import AuthPage from "./components/authpage";
import HomePage from "./components/homepage"; // Import the HomePage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogoPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} /> {/* Add HomePage route */}
        {/* Redirect any unknown paths to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

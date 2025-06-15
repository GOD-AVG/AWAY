import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/authpage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    fullname: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Only proceed to home if it's a login attempt
      console.log("Login attempt with:", {
        email: formData.email,
        password: formData.password,
      });
      navigate("/home");
    } else {
      // Handle signup logic without navigation
      console.log("Signup attempt with:", formData);
      // After signup, switch back to login form
      setIsLogin(true);
      // Clear form or keep fields as needed
      setFormData({
        email: formData.email, // Keep email for convenience
        password: "", // Clear password
        username: "",
        fullname: "",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-logo">AWAY</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="auth-input"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="auth-input"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="auth-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="auth-input"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button
            className="social-btn google-login"
            onClick={() => navigate("/home")}
          >
            Continue with Google
          </button>
        </div>

        <div className="auth-footer">
          {isLogin ? (
            <>
              <span>Don't have an account?</span>
              <button
                type="button"
                className="switch-btn"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button
                type="button"
                className="switch-btn"
                onClick={() => setIsLogin(true)}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

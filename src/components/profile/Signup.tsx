"use client";

import { useState } from "react";

interface SignupProps {
  onSwitchToLogin: () => void;
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up to your auth API
    console.log("signup", { name, email, password, confirmPassword });
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Create Account</h1>
      <p className="auth-subtitle">Join STYLEVIN — new drops land every week.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-name">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            className="auth-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-confirm-password">
            Confirm Password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <label className="auth-checkbox auth-terms">
          <input type="checkbox" required />
          <span>
            I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
          </span>
        </label>

        <button type="submit" className="auth-btn-primary">
          Create Account
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <p className="auth-switch-text">
        Already have an account?{" "}
        <button type="button" className="auth-switch-btn" onClick={onSwitchToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}
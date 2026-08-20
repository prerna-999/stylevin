"use client";

import { useState } from "react";

interface LoginProps {
  onSwitchToSignup: () => void;
}

export default function Login({ onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up to your auth API
    console.log("login", { email, password });
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-subtitle">Log in to keep the fits coming.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-row-between">
          <label className="auth-checkbox">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" className="auth-link">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="auth-btn-primary">
          Login
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <p className="auth-switch-text">
        Don&apos;t have an account yet?{" "}
        <button type="button" className="auth-switch-btn" onClick={onSwitchToSignup}>
          Sign Up
        </button>
      </p>
    </div>
  );
}
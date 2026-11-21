"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginProps {
  onSwitchToSignup: () => void;
}

export default function Login({ onSwitchToSignup }: LoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message.join(", ") : data.message || "Login failed"
        );
      }

   saveSession(data.token, data.user, remember);
router.replace("/");
    } catch (err: any) {
      setError(err.message || "Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
       <div className="trending-now__badge" aria-hidden="true">
        <span className="trending-now__badge-pin" />
        <span className="trending-now__badge-eyebrow">Welcome Back </span>
        {/* <span className="trending-now__badge-title">Login</span> */}
        <span className="trending-now__badge-underline" />
      </div>
      <p className="auth-subtitle mb-20">Log in to keep the fits coming.</p>
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
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="auth-link">
            Forgot password?
          </a>
        </div>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
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




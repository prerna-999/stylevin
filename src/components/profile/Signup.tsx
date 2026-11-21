"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignupProps {
  onSwitchToLogin: () => void;
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message.join(", ") : data.message || "Signup failed"
        );
      }

 saveSession(data.token, data.user, true);
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
        <span className="trending-now__badge-eyebrow">Create Account</span>
        {/* <span className="trending-now__badge-title">Login</span> */}
        <span className="trending-now__badge-underline" />
      </div>
      {/* <h1 className="auth-title">Create Account</h1> */}
      <p className="auth-subtitle mb-20">Join STYLEVIN — new drops land every week.</p>

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
            minLength={2}
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
            minLength={8}
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
            I agree to the <a href="/terms-and-condition">Terms</a> and{" "}
            <a href="/privacy-policy">Privacy Policy</a>
          </span>
        </label>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
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
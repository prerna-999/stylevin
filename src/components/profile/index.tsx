"use client";

import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

type AuthView = "login" | "signup";

export default function AuthProfile() {
  const [view, setView] = useState<AuthView>("login");

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-brand">
          <span className="auth-brand-highlight">STYLEVIN</span>
        </div>

        {view === "login" ? (
          <Login onSwitchToSignup={() => setView("signup")} />
        ) : (
          <Signup onSwitchToLogin={() => setView("login")} />
        )}
      </div>
    </div>
  );
}
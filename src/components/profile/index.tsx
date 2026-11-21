"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserRound, Package, Heart, LogOut, Mail, Tag, CalendarDays, ArrowRight,
} from "lucide-react";

import Login from "./Login";
import Signup from "./Signup";
import { useAuth, clearSession } from "@/lib/auth";

type AuthView = "login" | "signup";
type Tab = "profile" | "orders" | "wishlist";

const TABS: { key: Tab; label: string; icon: typeof UserRound }[] = [
  { key: "profile", label: "My Profile", icon: UserRound },
  { key: "orders", label: "My Orders", icon: Package },
  { key: "wishlist", label: "My Wishlist", icon: Heart },
];

export default function AuthProfile() {
  const [view, setView] = useState<AuthView>("login");
  const [tab, setTab] = useState<Tab>("profile");
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="acc-loading">
        <span className="acc-loader" />
        <p>Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-wrapper">
          {view === "login" ? (
            <Login onSwitchToSignup={() => setView("signup")} />
          ) : (
            <Signup onSwitchToLogin={() => setView("login")} />
          )}
        </div>
      </div>
    );
  }

  const firstName = user.name?.trim().split(/\s+/)[0] || "Customer";
  const initials =
    user.name?.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "S";

  const createdAt = (user as any).createdAt as string | undefined;
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <main className="acc-page">
      {/* slim header strip */}
      <section className="acc-band">
        <div className="acc-wrap acc-band__inner">
          <span className="acc-avatar">{initials}</span>
          <div>
            <h1>Hi, {firstName}!</h1>
            <p>{user.email}</p>
          </div>
        </div>
      </section>

      <div className="acc-wrap acc-body">
        {/* left menu */}
        <aside className="acc-menu">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`acc-menu__item ${tab === key ? "is-active" : ""}`}
              onClick={() => setTab(key)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}

          <button type="button" className="acc-menu__item acc-menu__logout" onClick={clearSession}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </aside>

        {/* content */}
        <section className="acc-panel">
          {tab === "profile" && (
            <>
              <h2 className="acc-panel__title">My Profile</h2>
              <div className="acc-info">
                <div className="acc-info__row">
                  <span className="acc-info__icon"><UserRound size={18} /></span>
                  <div><small>Full Name</small><p>{user.name}</p></div>
                </div>
                <div className="acc-info__row">
                  <span className="acc-info__icon"><Mail size={18} /></span>
                  <div><small>Email Address</small><p>{user.email}</p></div>
                </div>
                <div className="acc-info__row">
                  <span className="acc-info__icon"><CalendarDays size={18} /></span>
                  <div><small>Member Since</small><p>{memberSince}</p></div>
                </div>
                <div className="acc-info__row">
                  <span className="acc-info__icon"><Tag size={18} /></span>
                  <div><small>Account Type</small><p className="acc-cap">{user.role || "customer"}</p></div>
                </div>
              </div>
            </>
          )}

          {tab === "orders" && (
            <>
              <h2 className="acc-panel__title">My Orders</h2>
              <div className="acc-empty">
                <span className="acc-empty__icon"><Package size={30} /></span>
                <h3>No orders yet</h3>
                <p>When you place an order, you can track it here.</p>
                <Link href="/" className="acc-btn">Start Shopping <ArrowRight size={16} /></Link>
              </div>
            </>
          )}

          {tab === "wishlist" && (
            <>
              <h2 className="acc-panel__title">My Wishlist</h2>
              <div className="acc-empty">
                <span className="acc-empty__icon"><Heart size={30} /></span>
                <h3>Your saved styles</h3>
                <p>Open your wishlist to see everything you've saved.</p>
                <Link href="/wishlist" className="acc-btn">Open Wishlist <ArrowRight size={16} /></Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
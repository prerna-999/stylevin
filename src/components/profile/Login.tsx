// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import type { ConfirmationResult } from "firebase/auth";
// import { saveSession, getRedirectTarget } from "@/lib/auth";
// import { sendFirebaseOtp, confirmFirebaseOtp, firebaseErrorMessage } from "@/lib/phoneAuth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// interface LoginProps {
//   onSwitchToSignup: () => void;
// }

// export default function Login({ onSwitchToSignup }: LoginProps) {
//   const router = useRouter();
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"phone" | "otp">("phone");
//   const [remember, setRemember] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [cooldown, setCooldown] = useState(0);
//   const confirmation = useRef<ConfirmationResult | null>(null);

//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
//     return () => clearTimeout(t);
//   }, [cooldown]);

//   const post = async (path: string, body: object) => {
//     const res = await fetch(`${API_URL}${path}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     const data = await res.json();
//     if (!res.ok) {
//       throw new Error(Array.isArray(data.message) ? data.message.join(", ") : data.message || "Request failed");
//     }
//     return data;
//   };

//   const sendOtp = async (e?: React.FormEvent) => {
//     e?.preventDefault();
//     setError("");
//     if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit mobile number");
//     setLoading(true);
//     try {
//       await post("/auth/phone/check", { phone, purpose: "login" }); // account must exist
//       confirmation.current = await sendFirebaseOtp(phone);
//       setStep("otp");
//       setOtp("");
//       setCooldown(30);
//     } catch (err: any) {
//       setError(err.code ? firebaseErrorMessage(err) : err.message || "Could not reach the server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     if (otp.length !== 6) return setError("Enter the 6-digit OTP");
//     if (!confirmation.current) return setError("Please request an OTP first");
//     setLoading(true);
//     try {
//       const idToken = await confirmFirebaseOtp(confirmation.current, otp);
//       const data = await post("/auth/firebase/login", { idToken, remember });
//       saveSession(data.token, data.user, remember);
//       router.replace(getRedirectTarget("/") as string);
//     } catch (err: any) {
//       setError(err.code ? firebaseErrorMessage(err) : err.message || "Could not reach the server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-card">
//       <div className="trending-now__badge" aria-hidden="true">
//         <span className="trending-now__badge-pin" />
//         <span className="trending-now__badge-eyebrow">Welcome Back</span>
//         <span className="trending-now__badge-underline" />
//       </div>
//       <p className="auth-subtitle mb-20">
//         {step === "phone" ? "Log in with your mobile number." : `Enter the OTP sent to +91 ${phone}`}
//       </p>

//       {step === "phone" ? (
//         <form className="auth-form" onSubmit={sendOtp}>
//           <div className="auth-field">
//             <label className="auth-label" htmlFor="login-phone">Mobile Number</label>
//             <input
//               id="login-phone"
//               type="tel"
//               inputMode="numeric"
//               className="auth-input"
//               placeholder="10-digit mobile number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
//               required
//             />
//           </div>

//           <label className="auth-checkbox">
//             <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
//             <span>Remember me</span>
//           </label>

//           {error && <p className="auth-error" role="alert">{error}</p>}

//           <button type="submit" className="auth-btn-primary" disabled={loading}>
//             {loading ? "Sending OTP…" : "Send OTP"}
//           </button>
//         </form>
//       ) : (
//         <form className="auth-form" onSubmit={verifyOtp}>
//           <div className="auth-field">
//             <label className="auth-label" htmlFor="login-otp">OTP</label>
//             <input
//               id="login-otp"
//               type="text"
//               inputMode="numeric"
//               autoComplete="one-time-code"
//               className="auth-input"
//               placeholder="6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
//               required
//               autoFocus
//             />
//           </div>

//           <div className="auth-row-between">
//             <button type="button" className="auth-link" onClick={() => { setStep("phone"); setError(""); }}>
//               Change number
//             </button>
//             <button type="button" className="auth-link" disabled={cooldown > 0 || loading} onClick={() => sendOtp()}>
//               {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
//             </button>
//           </div>

//           {error && <p className="auth-error" role="alert">{error}</p>}

//           <button type="submit" className="auth-btn-primary" disabled={loading}>
//             {loading ? "Verifying…" : "Verify & Login"}
//           </button>
//         </form>
//       )}

//       {/* invisible reCAPTCHA required by Firebase */}
//       <div id="recaptcha-container" />

//       <div className="auth-divider"><span>or</span></div>

//       <p className="auth-switch-text">
//         Don&apos;t have an account yet?{" "}
//         <button type="button" className="auth-switch-btn" onClick={onSwitchToSignup}>Sign Up</button>
//       </p>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ConfirmationResult } from "firebase/auth";
import { saveSession, getRedirectTarget } from "@/lib/auth";
import { sendFirebaseOtp, confirmFirebaseOtp, firebaseErrorMessage } from "@/lib/phoneAuth";
import OtpVerification from "./OtpVerification";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginProps {
  onSwitchToSignup: () => void;
}

export default function Login({ onSwitchToSignup }: LoginProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const confirmation = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const post = async (path: string, body: object) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(Array.isArray(data.message) ? data.message.join(", ") : data.message || "Request failed");
    }
    return data;
  };

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit mobile number");
    setLoading(true);
    try {
      await post("/auth/phone/check", { phone, purpose: "login" }); // account must exist
      confirmation.current = await sendFirebaseOtp(phone);
      setStep("otp");
      setOtp("");
      setCooldown(30);
    } catch (err: any) {
      setError(err.code ? firebaseErrorMessage(err) : err.message || "Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("Enter the 6-digit OTP");
    if (!confirmation.current) return setError("Please request an OTP first");
    setLoading(true);
    try {
      const idToken = await confirmFirebaseOtp(confirmation.current, otp);
      const data = await post("/auth/firebase/login", { idToken, remember });
      saveSession(data.token, data.user, remember);
      router.replace(getRedirectTarget("/") as string);
    } catch (err: any) {
      setError(err.code ? firebaseErrorMessage(err) : err.message || "Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-card">
      <div className="login-split-banner">
        <img className="login-split-banner-image" src="/images/login-banner.jpg" alt="" />
        <div className="login-split-banner-overlay" />
        <img className="login-split-banner-logo" src="/images/login-logo.png" alt="Simcocart" />
        <div className="login-split-banner-content">
          <div className="login-split-banner-eyebrow">
            <span className="login-split-banner-eyebrow-line" />
            <span className="login-split-banner-eyebrow-text">Your everyday store</span>
          </div>
          <h2 className="login-split-banner-heading">
            SHOP WHAT
            <span className="login-split-banner-heading-accent">YOU LOVE.</span>
          </h2>
        </div>
      </div>

      <div className="login-modern-card">
        {step === "phone" && <h2 className="login-modern-title">Welcome back</h2>}

        {step === "phone" ? (
          <form className="login-modern-form" onSubmit={sendOtp}>
            <div className="login-modern-field">
              <label className="login-modern-label" htmlFor="login-phone">Mobile number</label>
              <div className="login-modern-input-group">
                <span className="login-modern-input-prefix">+91</span>
                <input
                  id="login-phone"
                  type="tel"
                  inputMode="numeric"
                  className="login-modern-input"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                />
                <svg className="login-modern-input-icon" width="16" height="18" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="1" width="12" height="18" rx="2.5" />
                  <line x1="6.5" y1="16" x2="9.5" y2="16" />
                </svg>
              </div>
            </div>

            <label className="login-modern-checkbox">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>

            {error && <p className="login-modern-error" role="alert">{error}</p>}

            <button
              type="submit"
              className={`login-modern-confirm-btn${phone.length === 10 ? " is-ready" : ""}`}
              disabled={loading}
            >
              {loading ? "Sending OTP…" : "Confirm"}
            </button>
          </form>
        ) : (
          <OtpVerification
            title="Welcome back"
            subtitle="Verify your mobile number to log in"
            phone={phone}
            otp={otp}
            onOtpChange={setOtp}
            onSubmit={verifyOtp}
            onChangeNumber={() => { setStep("phone"); setError(""); }}
            onResend={() => sendOtp()}
            cooldown={cooldown}
            loading={loading}
            error={error}
            submitLabel="Verify & Login"
            loadingLabel="Verifying…"
          />
        )}

        {/* invisible reCAPTCHA required by Firebase */}
        <div id="recaptcha-container" />

        {step === "phone" && (
          <>
            <p className="login-modern-terms">
              By continuing you agree to our <a href="/terms-and-conditions">Terms &amp; Conditions</a> and <a href="/privacy-policy">Privacy Policy</a>.
            </p>

            <p className="login-modern-switch-text">
              Not a member?{" "}
              <button type="button" className="login-modern-switch-btn" onClick={onSwitchToSignup}>Register now</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
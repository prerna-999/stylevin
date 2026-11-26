"use client";

import { useEffect, useRef } from "react";

const OTP_LENGTH = 6; // Firebase phone OTP is always 6 digits

interface OtpVerificationProps {
  title: string;
  subtitle?: string;
  phone: string;
  otp: string;
  onOtpChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onChangeNumber: () => void;
  onResend: () => void;
  cooldown: number;
  loading: boolean;
  error: string;
  submitLabel: string;
  loadingLabel: string;
}

/**
 * UI-only OTP screen shared by Login and Signup.
 * It does not call any API itself - all logic stays in the parent
 * (sendOtp / verifyOtp are passed in as props).
 */
export default function OtpVerification({
  title,
  subtitle,
  phone,
  otp,
  onOtpChange,
  onSubmit,
  onChangeNumber,
  onResend,
  cooldown,
  loading,
  error,
  submitLabel,
  loadingLabel,
}: OtpVerificationProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const focusBox = (i: number) => {
    const el = inputs.current[Math.max(0, Math.min(i, OTP_LENGTH - 1))];
    el?.focus();
    el?.select();
  };

  // when the parent clears the OTP (e.g. after "Resend"), start again from the first box
  useEffect(() => {
    if (otp === "") focusBox(0);
  }, [otp]);

  const handleChange = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");

    if (!digits) {
      // box was cleared
      onOtpChange(otp.slice(0, i) + otp.slice(i + 1));
      return;
    }

    // one digit typed OR several digits pasted / auto-filled from SMS
    const replaceCount = digits.length === 1 ? 1 : digits.length;
    const next = (otp.slice(0, i) + digits + otp.slice(i + replaceCount)).slice(0, OTP_LENGTH);
    onOtpChange(next);
    focusBox(Math.min(i + digits.length, OTP_LENGTH - 1));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      e.preventDefault();
      onOtpChange(otp.slice(0, i - 1) + otp.slice(i));
      focusBox(i - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    onOtpChange(pasted);
    focusBox(pasted.length >= OTP_LENGTH ? OTP_LENGTH - 1 : pasted.length);
  };

  return (
    <div className="otp-screen">
      <h2 className="login-modern-title otp-title">{title}</h2>
      {subtitle && <p className="otp-subtitle">{subtitle}</p>}

      <p className="otp-sent-text">We have sent you an OTP via SMS</p>

      <div className="otp-phone-row">
        <span className="otp-phone-number">+91 {phone}</span>
        <button type="button" className="otp-change-btn" onClick={onChangeNumber}>
          Change
        </button>
      </div>

      <form className="otp-form" onSubmit={onSubmit}>
        <div className="otp-boxes" role="group" aria-label="One-time password">
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={i === 0 ? OTP_LENGTH : 1}
              className={`otp-box${otp[i] ? " is-filled" : ""}${error ? " has-error" : ""}`}
              value={otp[i] ?? ""}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              aria-label={`Digit ${i + 1}`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <div className="otp-resend">
          {cooldown > 0 ? (
            <span>Resend OTP in {cooldown}s</span>
          ) : (
            <button type="button" className="otp-resend-btn" disabled={loading} onClick={onResend}>
              Resend OTP
            </button>
          )}
        </div>

        {error && <p className="login-modern-error" role="alert">{error}</p>}

        <button
          type="submit"
          className={`login-modern-confirm-btn${otp.length === OTP_LENGTH ? " is-ready" : ""}`}
          disabled={loading}
        >
          {loading ? loadingLabel : submitLabel}
        </button>
      </form>
    </div>
  );
}

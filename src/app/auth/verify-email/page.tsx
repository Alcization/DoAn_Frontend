"use client";

import { Suspense } from "react";
import { Mail, KeyRound } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

function VerifyEmailForm() {
  const {
    t,
    email,
    otp,
    setOtp,
    error,
    isLoading,
    countdown,
    handleVerify,
    handleResend,
    formatTime,
  } = useVerifyEmail();

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          {t("auth.verifyEmail.title", { defaultValue: "Verify Email" })}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("auth.verifyEmail.subtitle", { defaultValue: "We sent an OTP code to" })}{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <AuthInput
          label={t("auth.verifyEmail.otpLabel", { defaultValue: "OTP Code" })}
          type="text"
          value={otp}
          onChange={(val) => {
            // Chỉ cho phép nhập số và tối đa 6 ký tự
            const numericVal = val.replace(/\D/g, "").slice(0, 6);
            setOtp(numericVal);
          }}
          placeholder={t("auth.verifyEmail.otpPlaceholder", { defaultValue: "Enter 6-digit code" })}
          icon={<KeyRound size={18} />}
          error={error}
        />

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading 
            ? t("auth.verifyEmail.verifyingBtn", { defaultValue: "Verifying..." }) 
            : t("auth.verifyEmail.verifyBtn", { defaultValue: "Verify Account" })
          }
        </AuthButton>
      </form>

      <div className="mt-8 text-center border-t border-[var(--color-border)] pt-6">
        {countdown > 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("auth.verifyEmail.resendPrefix", { defaultValue: "Resend code in " })}
            <span className="font-semibold text-[var(--color-primary)] ml-1">
              {formatTime(countdown)}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-sm text-[var(--color-primary)] font-semibold hover:underline disabled:opacity-50 disabled:hover:no-underline"
          >
            {t("auth.verifyEmail.resendBtn", { defaultValue: "Resend Code" })}
          </button>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<AuthLayout><div className="text-center p-8">Loading...</div></AuthLayout>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
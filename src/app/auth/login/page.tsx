"use client";

import { Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthDivider from "../components/AuthDivider";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginPage() {
  const {
    t,
    router,
    formData,
    errors,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleLogin,
    handleGoogleSuccess,
    handleGoogleError,
    isEmailValid,
    handleForgotPassword,
    isLoading,
    apiError,
    isGoogleAuthConfigured,
  } = useLoginForm();

  return (
    <AuthLayout>
      {apiError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <AuthInput
          label={t("auth.login.emailLabel")}
          type="email"
          value={formData.email}
          onChange={(val) => handleInputChange("email", val)}
          placeholder={t("auth.login.emailPlaceholder")}
          icon={<Mail size={18} />}
          error={errors.email}
        />

        <div className="space-y-2">
          <AuthInput
            label={t("auth.login.passwordLabel")}
            type="password"
            value={formData.password}
            onChange={(val) => handleInputChange("password", val)}
            placeholder={t("auth.login.passwordPlaceholder")}
            icon={<Lock size={18} />}
            error={errors.password}
            isPassword={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={!isEmailValid}
              className={`text-sm font-semibold transition-colors focus:outline-none ${
                isEmailValid 
                  ? "text-(--color-primary) hover:underline cursor-pointer" 
                  : "text-(--color-text-muted) cursor-not-allowed opacity-70"
              }`}
            >
              {t("auth.login.forgotPassword", { defaultValue: "Forgot Password?" })}
            </button>
          </div>
        </div>

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              {t("common.loading", { defaultValue: "Đang xử lý..." })}
            </span>
          ) : (
            t("auth.login.loginBtn")
          )}
        </AuthButton>
      </form>

      <AuthDivider text={t("auth.login.orContinueWith")} />

      <GoogleAuthButton
        mode="signin"
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("auth.login.noAccount")}{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            {t("auth.login.signUpLink")}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

"use client";

import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthDivider from "../components/AuthDivider";
import SocialLoginButton from "../components/SocialLoginButton";
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
    handleGoogleSignIn,
    isEmailValid,
    handleForgotPassword,
  } = useLoginForm();

  return (
    <AuthLayout>
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

        <AuthButton type="submit">
          {t("auth.login.loginBtn")}
        </AuthButton>
      </form>

      <AuthDivider text={t("auth.login.orContinueWith")} />

      <SocialLoginButton
        onClick={handleGoogleSignIn}
        text={t("auth.login.googleSignIn")}
        icon={<Image src="/asssets/google.svg" alt="Google" width={20} height={20} />}
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

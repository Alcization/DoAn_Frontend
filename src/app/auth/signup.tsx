"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "@/services/api-config";

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateFullName = (name: string): string => {
    if (!name.trim()) {
      return t("auth.errors.fullNameRequired", "Vui lòng nhập họ và tên");
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) {
      return t("auth.errors.emailRequired");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return t("auth.errors.emailInvalid");
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return t("auth.errors.passwordRequired");
    }
    if (password.length < 8) {
      return t("auth.errors.passwordMinLength");
    }
    if (!/[A-Z]/.test(password)) {
      return t("auth.errors.passwordUppercase");
    }
    if (!/[a-z]/.test(password)) {
      return t("auth.errors.passwordLowercase");
    }
    if (!/[0-9]/.test(password)) {
      return t("auth.errors.passwordNumber");
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string): string => {
    if (!confirmPassword) {
      return t("auth.errors.confirmPasswordRequired");
    }
    if (confirmPassword !== formData.password) {
      return t("auth.errors.passwordsNoMatch");
    }
    return "";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);

    if (fullNameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        fullName: fullNameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const generatedUsername = formData.email.split('@')[0];

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: generatedUsername, // Thêm trường username vào payload
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          accountType: "individual", 
          roles: ["user"]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("auth.errors.signupFailed", "Đăng ký thất bại. Vui lòng thử lại."));
      }

      // Đăng ký thành công
      alert(t("auth.signup.success", "Đăng ký thành công!"));
      router.push("/auth/login");
      
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
    setApiError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-bg)] to-[var(--color-primary)]/5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/asssets/logo/Logo.png"
            alt="SWTIS Logo"
            width={200}
            height={100}
            className="mx-auto mb-4"
          />
        </div>

        {/* Signup Form */}
        <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-2xl p-8">
          
          {/* Hiển thị lỗi từ API nếu có */}
          {apiError && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                {t("auth.signup.fullNameLabel", "Họ và tên")}
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder={t("auth.signup.fullNamePlaceholder", "Nhập họ và tên của bạn")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.fullName ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                  } bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--color-text-muted)]`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-[var(--color-danger)] mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                {t("auth.signup.emailLabel")}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("auth.signup.emailPlaceholder")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.email ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                  } bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--color-text-muted)]`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[var(--color-danger)] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                {t("auth.signup.passwordLabel")}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                    errors.password ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                  } bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--color-text-muted)]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[var(--color-danger)] mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-[var(--color-text-muted)]">
                {t("auth.signup.passwordRequirements")}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                {t("auth.signup.confirmPasswordLabel")}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                    errors.confirmPassword ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                  } bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--color-text-muted)]`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[var(--color-danger)] mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary-strong)] to-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("common.loading", "Đang xử lý...") : t("auth.signup.signupBtn")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {t("auth.signup.orContinueWith")}
            </span>
            <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            {t("auth.signup.googleSignIn")}
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t("auth.signup.haveAccount")}{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="text-[var(--color-primary)] font-semibold hover:underline"
              >
                {t("auth.signup.loginLink")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { Mail, Lock, User, Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "../components/AuthLayout";
import SignupRoleSelector from "../components/SignupRoleSelector";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthDivider from "../components/AuthDivider";
import SocialLoginButton from "../components/SocialLoginButton";
import { useSignupForm } from "../hooks/useSignupForm";

export default function SignupPage() {
  const {
    t,
    router,
    formData,
    errors,
    isLoading,
    apiError,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleInputChange,
    handleSignup,
    handleGoogleSignIn,
  } = useSignupForm();

  return (
    <AuthLayout>
      {/* Hiển thị lỗi từ server trả về */}
      {apiError && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm text-center">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        <SignupRoleSelector
          value={formData.role}
          onChange={(val) => handleInputChange("role", val)}
        />

        {/* Thêm trường Full Name */}
        <AuthInput
          label={t("auth.signup.fullNameLabel", "Họ và tên")}
          type="text"
          value={formData.fullName}
          onChange={(val) => handleInputChange("fullName", val)}
          placeholder={t("auth.signup.fullNamePlaceholder", "Nhập họ và tên của bạn")}
          icon={<User size={18} />}
          error={errors.fullName}
        />

        <AuthInput
          label={t("auth.signup.emailLabel")}
          type="email"
          value={formData.email}
          onChange={(val) => handleInputChange("email", val)}
          placeholder={t("auth.signup.emailPlaceholder")}
          icon={<Mail size={18} />}
          error={errors.email}
        />

        <AuthInput
          label={t("auth.signup.passwordLabel")}
          type="password"
          value={formData.password}
          onChange={(val) => handleInputChange("password", val)}
          placeholder={t("auth.signup.passwordPlaceholder")}
          icon={<Lock size={18} />}
          error={errors.password}
          helperText={t("auth.signup.passwordRequirements")}
          isPassword={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <AuthInput
          label={t("auth.signup.confirmPasswordLabel")}
          type="password"
          value={formData.confirmPassword}
          onChange={(val) => handleInputChange("confirmPassword", val)}
          placeholder={t("auth.signup.confirmPasswordPlaceholder")}
          icon={<Lock size={18} />}
          error={errors.confirmPassword}
          isPassword={true}
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {/* Khóa nút và hiển thị Loading khi đang call API */}
        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              {t("common.loading", "Đang xử lý...")}
            </span>
          ) : (
            t("auth.signup.signupBtn")
          )}
        </AuthButton>
      </form>

      <AuthDivider text={t("auth.signup.orContinueWith")} />

      <SocialLoginButton
        onClick={handleGoogleSignIn}
        text={t("auth.signup.googleSignIn")}
        icon={<Image src="/asssets/google.svg" alt="Google" width={20} height={20} />}
      />

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
    </AuthLayout>
  );
}
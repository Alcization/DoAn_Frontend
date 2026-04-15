"use client";

import { Suspense } from "react";
import { Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useNewPassword } from "../hooks/useNewPassword";

function NewPasswordForm() {
  const {
    t,
    formData,
    errors,
    apiError,
    isLoading,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleSubmit,
  } = useNewPassword();

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          {t("auth.newPassword.title", { defaultValue: "Set New Password" })}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("auth.newPassword.subtitle", { defaultValue: "Please enter your new password below." })}
        </p>
      </div>

      {apiError && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label={t("auth.newPassword.passwordLabel", { defaultValue: "New Password" })}
          type="password"
          value={formData.password}
          onChange={(val) => handleInputChange("password", val)}
          placeholder={t("auth.newPassword.passwordPlaceholder", { defaultValue: "Enter new password" })}
          icon={<Lock size={18} />}
          error={errors.password}
          isPassword={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <AuthInput
          label={t("auth.newPassword.confirmPasswordLabel", { defaultValue: "Confirm New Password" })}
          type="password"
          value={formData.confirmPassword}
          onChange={(val) => handleInputChange("confirmPassword", val)}
          placeholder={t("auth.newPassword.confirmPasswordPlaceholder", { defaultValue: "Re-enter new password" })}
          icon={<Lock size={18} />}
          error={errors.confirmPassword}
          isPassword={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading 
            ? t("auth.newPassword.submittingBtn", { defaultValue: "Updating..." }) 
            : t("auth.newPassword.submitBtn", { defaultValue: "Update Password" })
          }
        </AuthButton>
      </form>
    </AuthLayout>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<AuthLayout><div className="text-center p-8">Loading...</div></AuthLayout>}>
      <NewPasswordForm />
    </Suspense>
  );
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api-config";
import type { TokenResponse } from "@react-oauth/google"; // Cập nhật Import
import {
  getRedirectPathByRoles,
  persistAuthSession,
  signInWithGoogleAccessToken, // Cập nhật Import
  isGoogleAuthConfigured,
} from "./authSession";

export function useSignupForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "personal",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError(null); 
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
          username: generatedUsername,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName, 
          accountType: formData.role, 
          roles: ["user"] 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("auth.errors.signupFailed", "Đăng ký thất bại."));
      }

      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}&flow=signup`);
      
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật hàm xử lý Google Login
  const handleGoogleSuccess = async (
    tokenResponse: Omit<TokenResponse, "error" | "error_description" | "error_uri">
  ) => {
    const accessToken = tokenResponse.access_token;

    if (!accessToken) {
      setApiError(
        t("auth.errors.googleTokenMissing", {
          defaultValue: "Không nhận được Access Token từ Google. Vui lòng thử lại.",
        }),
      );
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // Gọi đúng hàm sử dụng Access Token
      const data = await signInWithGoogleAccessToken(accessToken);
      persistAuthSession(data);
      router.push(getRedirectPathByRoles(data.roles || []));
    } catch (error) {
      console.error("Lỗi đăng ký/đăng nhập Google:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : t("auth.errors.serverError", { defaultValue: "Có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau." }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setApiError(
      t("auth.errors.googleSignInFailed", {
        defaultValue: "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
      }),
    );
  };

  return {
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
    handleGoogleSuccess,
    handleGoogleError,
    isGoogleAuthConfigured,
  };
}
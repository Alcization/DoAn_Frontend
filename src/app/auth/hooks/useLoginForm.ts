import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api-config";
import type { TokenResponse } from "@react-oauth/google"; // Đổi import sang TokenResponse
import {
  getRedirectPathByRoles,
  persistAuthSession,
  signInWithGoogleAccessToken, // Đổi tên hàm cho phù hợp với logic mới
  isGoogleAuthConfigured,
} from "./authSession";

export function useLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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
    if (password.length < 6) {
      return t("auth.errors.passwordTooShort");
    }
    return "";
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrUsername: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        setApiError(t("auth.errors.invalidCredentials", { defaultValue: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." }));
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      persistAuthSession(data);

      router.push(getRedirectPathByRoles(data.roles || []));

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setApiError(t("auth.errors.serverError", { defaultValue: "Có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau." }));
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = Boolean(formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));

  const handleForgotPassword = () => {
    if (!isEmailValid) {
      setErrors((prev) => ({ ...prev, email: t("auth.errors.emailInvalid", { defaultValue: "Invalid email" }) }));
      return;
    }
    router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}&flow=forgot-password`);
  };

  // Cập nhật tham số nhận vào là Omit<TokenResponse,...> thay vì CredentialResponse
  const handleGoogleSuccess = async (
    tokenResponse: Omit<TokenResponse, "error" | "error_description" | "error_uri">
  ) => {
    // Lấy access_token thay vì credential (id_token)
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
    setApiError("");

    try {
      // Gọi API tương ứng với access_token
      const data = await signInWithGoogleAccessToken(accessToken);
      persistAuthSession(data);
      router.push(getRedirectPathByRoles(data.roles || []));
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
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
    apiError,
    isLoading,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleLogin,
    handleGoogleSuccess,
    handleGoogleError,
    isEmailValid,
    handleForgotPassword,
    isGoogleAuthConfigured,
  };
}
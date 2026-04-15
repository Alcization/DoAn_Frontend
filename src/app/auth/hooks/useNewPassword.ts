import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/services/api-config";

export function useNewPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): string => {
    if (!password) {
      return t("auth.errors.passwordRequired", { defaultValue: "Password is required" });
    }
    if (password.length < 6) {
      return t("auth.errors.passwordTooShort", { defaultValue: "Password must be at least 6 characters" });
    }
    return "";
  };

  const handleInputChange = (field: "password" | "confirmPassword", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const passwordError = validatePassword(formData.password);
    let confirmPasswordError = "";

    if (!formData.confirmPassword) {
      confirmPasswordError = t("auth.errors.confirmPasswordRequired", { defaultValue: "Please confirm your password" });
    } else if (formData.password !== formData.confirmPassword) {
      confirmPasswordError = t("auth.errors.passwordsNoMatch", { defaultValue: "Passwords do not match" });
    }

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email, 
          newPassword: formData.password 
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(t("auth.errors.serverError", { defaultValue: "Lỗi máy chủ: Không thể kết nối đến API." }));
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("auth.errors.resetFailed", { defaultValue: "Failed to reset password" }));
      }

      console.log("Reset password thành công:", data.message);
      router.push("/auth/login");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    t,
    email,
    formData,
    errors,
    apiError,
    isLoading,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleSubmit,
  };
}
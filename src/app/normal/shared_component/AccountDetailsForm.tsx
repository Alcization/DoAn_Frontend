"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/theme/ThemeContext";
import { API_BASE_URL } from "@/services/api-config";

interface UserData {
  user_id: number;
  email: string;
  username: string;
  phone_number: string;
  language: string;
  account_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  IndividualUser: {
    individual_id: number;
    full_name: string;
    user_id: number;
  } | null;
  BusinessUser: {
    company_name: string;
  } | null;
}

export interface AccountDetailsFormRef {
  submitForm: () => void;
}

interface Props {
  onSavingStateChange?: (isSaving: boolean) => void;
  userProfile?: any; // Đặt type tùy theo mock data của bạn
}

const AccountDetailsForm = forwardRef<AccountDetailsFormRef, Props>(({ onSavingStateChange }, ref) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formFields, setFormFields] = useState({
    full_name: "",
    phone_number: "",
    language: ""
  });

  // Expose hàm submit ra cho component cha gọi
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleUpdate();
    }
  }));

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Không tìm thấy xác thực.");

        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Lỗi tải thông tin.");

        const data = await response.json();
        setUserData(data);
        
        setFormFields({
          full_name: data.IndividualUser?.full_name || data.BusinessUser?.company_name || data.username || "",
          phone_number: data.phone_number || "",
          language: data.language || i18n.language || "vi"
        });

        if (data.language && data.language !== i18n.language) {
          await i18n.changeLanguage(data.language);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [i18n]);

  const handleInputChange = (field: string, value: string) => {
    setFormFields(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    onSavingStateChange?.(true); // Báo cho cha biết đang lưu
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formFields)
      });

      if (!response.ok) throw new Error("Cập nhật thất bại.");

      if (formFields.language !== i18n.language) {
        await i18n.changeLanguage(formFields.language);
        localStorage.setItem("i18nextLng", formFields.language);
      }

      alert(t("common.updateSuccess", "Cập nhật thông tin thành công!"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      onSavingStateChange?.(false); // Báo cho cha biết đã lưu xong
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-[var(--color-text-secondary)]">{t("common.loading", "Đang tải thông tin...")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Họ và tên */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[var(--color-text-primary)] text-[var(--text-sm)]">
            {t("accountPage.labels.fullName")}
          </label>
          <input
            type="text"
            value={formFields.full_name}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            className="px-3.5 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)]"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[var(--color-text-primary)] text-[var(--text-sm)]">
            {t("accountPage.labels.email")}
          </label>
          <input
            type="email"
            value={userData?.email || ""}
            disabled
            className="px-3.5 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] opacity-70 cursor-not-allowed"
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[var(--color-text-primary)] text-[var(--text-sm)]">
            {t("accountPage.labels.phone")}
          </label>
          <input
            type="tel"
            value={formFields.phone_number}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            className="px-3.5 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)]"
          />
        </div>

        {/* Ngôn ngữ */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[var(--color-text-primary)] text-[var(--text-sm)]">
            {t("accountPage.labels.language")}
          </label>
          <select 
            value={formFields.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="px-3.5 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] appearance-none"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Theme Switcher */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[var(--color-text-primary)] text-[var(--text-sm)]">
            {t("accountPage.labels.theme")}
          </label>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-between px-3.5 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <span>{theme === "light" ? t("accountPage.theme.light") : t("accountPage.theme.dark")}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

AccountDetailsForm.displayName = "AccountDetailsForm";
export default AccountDetailsForm;
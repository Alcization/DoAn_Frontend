"use client";

import { Camera } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "@/services/api-config";

interface AccountProfileSectionProps {
  avatar: string | null;
  setAvatar: (avatar: string) => void;
}

export default function AccountProfileSection({
  avatar,
  setAvatar,
}: AccountProfileSectionProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBasicUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            username: data.IndividualUser?.full_name || data.BusinessUser?.company_name || data.username || "",
            email: data.email || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBasicUserInfo();
  }, [t]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius-3xl)] ${
            avatar
              ? "bg-cover bg-center"
              : "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-weather-from)] flex items-center justify-center"
          } text-white text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-bold flex-shrink-0`}
          style={avatar ? { backgroundImage: `url(${avatar})` } : {}}
        >
          {!avatar && (userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "U")}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-strong)] transition-colors shadow-[var(--shadow-md)] cursor-pointer border-none"
          title={t("accountPage.changeAvatar")}
        >
          <Camera size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>
      <div>
        <p className="m-0 text-[var(--text-lg)] sm:text-[var(--text-xl)] lg:text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)]">
          {isLoading ? "..." : userInfo.username}
        </p>
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] m-0">
          {isLoading ? "Đang tải..." : userInfo.email}
        </p>
      </div>
    </div>
  );
}
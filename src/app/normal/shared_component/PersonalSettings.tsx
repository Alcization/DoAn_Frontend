"use client";

import { useState, useEffect } from "react";
import { Bell, Clock, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "@/services/api-config";

// Khai báo cấu trúc dữ liệu trả về từ API
interface Notification {
  noti_event_id: number;
  user_id: number;
  name: string;
  description: string;
  type: string;
  issue_at: string;
  is_read: boolean;
}

export default function PersonalSettings() {
  const { t, i18n } = useTranslation();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Không tìm thấy xác thực.");

        const response = await fetch(`${API_BASE_URL}/users/notifications`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Không thể tải lịch sử cảnh báo.");

        const data: Notification[] = await response.json();
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const normalizeLevel = (type: string) => {
    const lowerType = type?.toLowerCase() || "info";
    if (lowerType.includes("danger") || lowerType.includes("severe")) return "danger";
    if (lowerType.includes("warning")) return "warning";
    return "info";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "danger": return "text-[var(--color-danger)] bg-[var(--color-danger-bg)]";
      case "warning": return "text-[var(--color-warning)] bg-[var(--color-warning-bg)]";
      default: return "text-[var(--color-info)] bg-[var(--color-info-bg)]";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "danger": return <AlertCircle size={14} />;
      case "warning": return <AlertTriangle size={14} />;
      default: return <Info size={14} />;
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div className="bg-(--color-surface) rounded-[24px] p-4 sm:p-6 shadow-(--shadow-sm) flex flex-col gap-4 border border-(--color-border)">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-(--color-text-primary) font-bold flex items-center gap-2">
          <Bell size={24} className="text-(--color-primary)" />
          {t("personalPage.modals.alertHistory.title")}
        </h2>
        <button className="text-(--text-xs) text-(--color-primary) hover:underline font-medium cursor-pointer bg-transparent border-none">
          {t("common.viewAll")}
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center text-(--color-text-secondary) py-4">Đang tải cảnh báo...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-(--color-text-secondary) py-4">Chưa có cảnh báo nào</div>
        ) : (
          notifications.map((item) => {
            const normalizedLevel = normalizeLevel(item.type);
            
            return (
              <div 
                key={item.noti_event_id}
                className={`p-4 rounded-2xl bg-(--color-bg) border border-(--color-border) hover:bg-(--color-bg-secondary) transition-all cursor-pointer group ${!item.is_read ? 'border-l-4 border-l-(--color-primary)' : ''}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${getLevelColor(normalizedLevel)}`}>
                        {getLevelIcon(normalizedLevel)}
                        {t(`personalPage.modals.alertHistory.levels.${normalizedLevel}`, item.type)}
                      </span>
                      <span className="text-[10px] text-(--color-text-secondary) flex items-center gap-1">
                        <Clock size={10} />
                        {formatDate(item.issue_at)}
                      </span>
                    </div>
                    <h4 className={`m-0 text-(--text-sm) sm:text-(--text-base) font-bold group-hover:text-(--color-primary) transition-colors ${!item.is_read ? 'text-(--color-text-primary)' : 'text-(--color-text-secondary)'}`}>
                      {item.name}
                    </h4>
                    <p className="m-0 mt-1 text-(--text-xs) sm:text-(--text-sm) text-(--color-text-secondary) line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  {!item.is_read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-(--color-primary) mt-2 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
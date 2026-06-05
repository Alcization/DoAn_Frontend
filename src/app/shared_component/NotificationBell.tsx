"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/notification/NotificationContext";
import type { NotiEvent } from "@/services/api/alertEvents";
import {
  localizeAlertDescription,
  localizeAlertName,
} from "@/services/i18n/alertFormat";

const severityFromType = (type: string): "info" | "warning" | "critical" => {
  const lower = (type || "").toLowerCase();
  if (lower.includes("critical") || lower.includes("danger")) return "critical";
  if (lower.includes("warning")) return "warning";
  return "info";
};

const severityIcon = (sev: "info" | "warning" | "critical") => {
  if (sev === "critical") return <AlertCircle size={14} className="text-[var(--color-danger)]" />;
  if (sev === "warning") return <AlertTriangle size={14} className="text-[var(--color-warning)]" />;
  return <Info size={14} className="text-[var(--color-info)]" />;
};

export default function NotificationBell() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { events, unreadCount, markAllRead, refresh } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await refresh();
      if (unreadCount > 0) {
        markAllRead();
      }
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(i18n.language === "vi" ? "vi-VN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });

  const handleItemClick = (e: NotiEvent) => {
    setOpen(false);
    router.push("/normal/persona");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label={t("notifications.bellAria", "Notifications")}
        onClick={handleOpen}
        className="relative bg-transparent border-none cursor-pointer p-1 rounded-[var(--radius-sm)] transition-colors duration-200 flex items-center justify-center hover:bg-[var(--color-bg-secondary)]"
      >
        <Bell size={22} className="text-[var(--color-text-primary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-12 right-0 w-80 max-h-[28rem] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] z-50 flex flex-col">
          <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <span className="font-semibold text-sm text-[var(--color-text-primary)]">
              {t("notifications.title", "Notifications")}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs text-[var(--color-primary)] hover:underline bg-transparent border-none cursor-pointer"
              >
                {t("notifications.markAllRead", "Mark all read")}
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {events.length === 0 ? (
              <p className="text-center text-xs text-[var(--color-text-secondary)] py-8">
                {t("notifications.empty", "No notifications yet")}
              </p>
            ) : (
              events.slice(0, 20).map((ev) => {
                const sev = severityFromType(ev.type);
                return (
                  <button
                    key={ev.noti_event_id}
                    onClick={() => handleItemClick(ev)}
                    className={`w-full text-left px-4 py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-secondary)] transition-colors flex gap-3 ${
                      !ev.is_read ? "bg-[var(--color-bg)]" : ""
                    }`}
                  >
                    <div className="mt-0.5">{severityIcon(sev)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="m-0 text-xs font-semibold text-[var(--color-text-primary)] truncate">
                        {localizeAlertName(t, ev.name)}
                      </p>
                      <p className="m-0 mt-0.5 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                        {localizeAlertDescription(t, ev.description)}
                      </p>
                      <p className="m-0 mt-1 text-[10px] text-[var(--color-text-muted)]">
                        {formatDate(ev.issue_at)}
                      </p>
                    </div>
                    {!ev.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

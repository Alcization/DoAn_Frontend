"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  Clock,
  AlertTriangle,
  Info,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/context/notification/NotificationContext";
import {
  currentPermission,
  disablePushOnThisDevice,
  enablePushNotifications,
  pushSupported,
} from "@/services/pushClient";
import {
  deletePushSubscription,
  listPushSubscriptions,
  type PushSubscriptionRecord,
} from "@/services/api/pushSubscriptions";
import {
  localizeAlertDescription,
  localizeAlertName,
} from "@/services/i18n/alertFormat";

type Level = "danger" | "warning" | "info";

const normalizeLevel = (type: string): Level => {
  const t = (type || "").toLowerCase();
  if (t.includes("critical") || t.includes("danger") || t.includes("severe")) return "danger";
  if (t.includes("warning")) return "warning";
  return "info";
};

const levelColor = (level: Level) => {
  switch (level) {
    case "danger":
      return "text-[var(--color-danger)] bg-[var(--color-danger-bg)]";
    case "warning":
      return "text-[var(--color-warning)] bg-[var(--color-warning-bg)]";
    default:
      return "text-[var(--color-info)] bg-[var(--color-info-bg)]";
  }
};

const levelIcon = (level: Level) => {
  switch (level) {
    case "danger":
      return <AlertCircle size={14} />;
    case "warning":
      return <AlertTriangle size={14} />;
    default:
      return <Info size={14} />;
  }
};

export default function PersonalSettings() {
  const { t, i18n } = useTranslation();
  const { events, isLoading, refresh } = useNotifications();

  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [devices, setDevices] = useState<PushSubscriptionRecord[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);

  useEffect(() => {
    setSupported(pushSupported());
    setPermission(currentPermission());
  }, []);

  const loadDevices = useCallback(async () => {
    setDevicesLoading(true);
    try {
      setDevices(await listPushSubscriptions());
    } catch (err) {
      console.error("Failed to load push subscriptions", err);
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (supported) loadDevices();
  }, [supported, loadDevices]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(i18n.language === "vi" ? "vi-VN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleEnable = async () => {
    setBusy(true);
    setPushError(null);
    try {
      await enablePushNotifications();
      setPermission(currentPermission());
      await loadDevices();
    } catch (err: any) {
      setPushError(err?.message ?? "Failed to enable push");
      setPermission(currentPermission());
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async (id: number) => {
    try {
      await deletePushSubscription(id);
      // Also unsubscribe locally if this device matches.
      await disablePushOnThisDevice().catch(() => {});
      await loadDevices();
    } catch (err) {
      console.error("Failed to remove device", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Push enablement panel */}
      <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-sm)] flex flex-col gap-4 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="m-0 text-[var(--color-text-primary)] font-bold flex items-center gap-2">
            <Bell size={24} className="text-[var(--color-primary)]" />
            {t("notifications.push.title", "Browser alerts")}
          </h2>
        </div>

        {!supported ? (
          <p className="m-0 text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-text-secondary)]">
            {t(
              "notifications.push.unsupported",
              "Your browser does not support web push notifications.",
            )}
          </p>
        ) : (
          <>
            <p className="m-0 text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              {t(
                "notifications.push.desc",
                "Receive OS-level alerts even when the tab is closed.",
              )}
            </p>

            {pushError && (
              <div className="p-2 rounded-lg bg-red-100/50 border border-red-200 text-red-700 text-[var(--text-xs)] sm:text-[var(--text-sm)]">
                {pushError}
              </div>
            )}

            {permission === "denied" ? (
              <div className="text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-warning)]">
                {t(
                  "notifications.push.denied",
                  "Notifications are blocked. Re-enable them in your browser site settings.",
                )}
              </div>
            ) : (
              <button
                onClick={handleEnable}
                disabled={busy}
                className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-[var(--text-sm)] font-medium hover:opacity-90 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Bell size={14} />
                )}
                {permission === "granted"
                  ? t("notifications.push.refresh", "Re-register this device")
                  : t("notifications.push.enable", "Enable browser alerts")}
              </button>
            )}

            {/* Device list */}
            <div>
              <h4 className="m-0 mb-2 text-[var(--text-sm)] sm:text-[var(--text-base)] font-bold text-[var(--color-text-primary)]">
                {t("notifications.push.devices", "Subscribed devices")}
              </h4>
              {devicesLoading ? (
                <div className="text-center text-[var(--color-text-secondary)] py-4">
                  <Loader2 size={16} className="animate-spin inline" />
                </div>
              ) : devices.length === 0 ? (
                <p className="m-0 text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-text-muted)]">
                  {t("notifications.push.noDevices", "No devices registered yet.")}
                </p>
              ) : (
                <ul className="space-y-3 list-none p-0 m-0">
                  {devices.map((d) => (
                    <li
                      key={d.endpoint ?? d.subscription_id}
                      className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="m-0 text-[var(--text-sm)] sm:text-[var(--text-base)] font-bold text-[var(--color-text-primary)] truncate">
                          {d.user_agent || d.endpoint}
                        </p>
                        <p className="m-0 mt-1 text-[10px] text-[var(--color-text-secondary)] flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(d.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDisable(d.subscription_id)}
                        className="p-1.5 rounded-md text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] flex-shrink-0"
                        aria-label="Remove device"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {/* History */}
      <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-sm)] flex flex-col gap-4 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="m-0 text-[var(--color-text-primary)] font-bold flex items-center gap-2">
            <Bell size={24} className="text-[var(--color-primary)]" />
            {t("personalPage.modals.alertHistory.title")}
          </h2>
          <button
            onClick={() => refresh()}
            className="text-[var(--text-xs)] text-[var(--color-primary)] hover:underline font-medium cursor-pointer bg-transparent border-none"
          >
            {t("common.refresh", "Refresh")}
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-[var(--color-text-secondary)] py-4">
              <Loader2 size={16} className="animate-spin inline" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center text-[var(--color-text-secondary)] py-4 flex flex-col items-center gap-2">
              <BellOff size={20} className="text-[var(--color-text-muted)]" />
              {t("notifications.empty", "No notifications yet")}
            </div>
          ) : (
            events.map((item) => {
              const level = normalizeLevel(item.type);
              return (
                <div
                  key={item.noti_event_id}
                  className={`p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-all group ${
                    !item.is_read ? "border-l-4 border-l-[var(--color-primary)]" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${levelColor(level)}`}
                        >
                          {levelIcon(level)}
                          {t(`personalPage.modals.alertHistory.levels.${level}`, level)}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-secondary)] flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(item.issue_at)}
                        </span>
                      </div>
                      <h4
                        className={`m-0 text-[var(--text-sm)] sm:text-[var(--text-base)] font-bold ${
                          !item.is_read
                            ? "text-[var(--color-text-primary)]"
                            : "text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {localizeAlertName(t, item.name)}
                      </h4>
                      <p className="m-0 mt-1 text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-text-secondary)] line-clamp-2">
                        {localizeAlertDescription(t, item.description)}
                      </p>
                    </div>

                    {!item.is_read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  listNotiEvents,
  markAllEventsRead,
  markEventRead,
  type NotiEvent,
} from "@/services/api/alertEvents";
import {
  buildNotificationsSocketUrl,
  type AlertFrame,
  type SocketFrame,
} from "@/services/api/alertSocket";
import AlertToastHost from "@/app/shared_component/AlertToastHost";
import { formatAlertBody, formatAlertTitle } from "@/services/i18n/alertFormat";

const RECONNECT_MS = 5000;
const PING_INTERVAL_MS = 30000;

interface NotificationContextValue {
  events: NotiEvent[];
  unreadCount: number;
  isLoading: boolean;
  liveAlerts: AlertFrame[];
  refresh: () => Promise<void>;
  markAllRead: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  dismissLiveAlert: (issuedAt: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

const isAlertFrame = (frame: SocketFrame): frame is AlertFrame =>
  frame.type === "alert";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [events, setEvents] = useState<NotiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<AlertFrame[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const closedByClient = useRef(false);
  const syntheticIdRef = useRef(-1);
  const seenFrameKeys = useRef<Set<string>>(new Set());

  const unreadCount = useMemo(
    () => events.reduce((acc, e) => acc + (e.is_read ? 0 : 1), 0),
    [events],
  );

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setEvents([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await listNotiEvents(50, 0);
      setEvents(res.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setEvents([]);
      } else {
        console.error("Failed to load notifications", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setEvents((prev) => prev.map((e) => ({ ...e, is_read: true })));
    try {
      await markAllEventsRead();
    } catch (err) {
      console.error("Failed to mark all read", err);
      await refresh();
    }
  }, [refresh]);

  const markRead = useCallback(async (id: number) => {
    setEvents((prev) =>
      prev.map((e) => (e.noti_event_id === id ? { ...e, is_read: true } : e)),
    );
    try {
      await markEventRead(id);
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  }, []);

  const dismissLiveAlert = useCallback((issuedAt: string) => {
    setLiveAlerts((prev) => prev.filter((a) => a.issued_at !== issuedAt));
  }, []);

  const handleAlertFrame = useCallback(
    (frame: AlertFrame) => {
      const key = `${frame.rule_id}:${frame.issued_at}`;
      if (seenFrameKeys.current.has(key)) return;
      seenFrameKeys.current.add(key);

      setLiveAlerts((prev) => [...prev, frame]);
      const syntheticId = syntheticIdRef.current--;
      setEvents((prev) => [
        {
          noti_event_id: syntheticId,
          user_id: 0,
          name: formatAlertTitle(t, frame),
          description: formatAlertBody(t, frame),
          type: `LocationAlert:${frame.severity}`,
          issue_at: frame.issued_at,
          is_read: false,
        },
        ...prev,
      ]);
      setTimeout(() => {
        refresh().catch(() => {});
      }, 1000);
    },
    [refresh, t],
  );

  const cleanupSocket = useCallback(() => {
    if (pingTimer.current) {
      clearInterval(pingTimer.current);
      pingTimer.current = null;
    }
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    if (wsRef.current) {
      closedByClient.current = true;
      try {
        wsRef.current.close();
      } catch {
        /* ignore */
      }
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    const token = getToken();
    if (!token) return;
    if (typeof window === "undefined") return;
    if (wsRef.current) return;

    closedByClient.current = false;
    let ws: WebSocket;
    try {
      ws = new WebSocket(buildNotificationsSocketUrl(token));
    } catch (err) {
      console.error("Failed to open notifications socket", err);
      reconnectTimer.current = setTimeout(connect, RECONNECT_MS);
      return;
    }
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      if (pingTimer.current) clearInterval(pingTimer.current);
      pingTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, PING_INTERVAL_MS);
    });

    ws.addEventListener("message", (event) => {
      let frame: SocketFrame;
      try {
        frame = JSON.parse(event.data);
      } catch {
        return;
      }
      if (isAlertFrame(frame)) handleAlertFrame(frame);
    });

    ws.addEventListener("close", (event) => {
      wsRef.current = null;
      if (pingTimer.current) {
        clearInterval(pingTimer.current);
        pingTimer.current = null;
      }
      if (closedByClient.current) return;
      // 4401 / 1008 ≈ auth failure; stop retrying loudly but try again later.
      const delay =
        event.code === 4401 || event.code === 1008 ? 15000 : RECONNECT_MS;
      reconnectTimer.current = setTimeout(connect, delay);
    });

    ws.addEventListener("error", () => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    });
  }, [handleAlertFrame]);

  useEffect(() => {
    refresh();
    connect();
    return cleanupSocket;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      events,
      unreadCount,
      isLoading,
      liveAlerts,
      refresh,
      markAllRead,
      markRead,
      dismissLiveAlert,
    }),
    [
      events,
      unreadCount,
      isLoading,
      liveAlerts,
      refresh,
      markAllRead,
      markRead,
      dismissLiveAlert,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <AlertToastHost />
    </NotificationContext.Provider>
  );
}

export const useNotifications = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return ctx;
};

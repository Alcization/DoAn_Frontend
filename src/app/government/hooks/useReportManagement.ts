import { useState, useCallback, useEffect } from "react";
import type { TFunction } from "i18next";
import { ReportConfig, ReportHistoryItem } from "../component/report-logic/ReportTypes";
import { apiClient } from "@/services/api-config";
import { getGovernmentIncidentHistory } from "../../../context/services/api/government/history-incidents";
import { downloadAlertsEventsReportPdf } from "../component/report-logic/reportPdf";

// Map from Vietnamese report names to topic IDs
const TOPIC_NAME_MAP: Record<string, string> = {
  "Thời tiết": "weather",
  "Cảnh báo": "alerts",
  "Sự cố": "incidents",
};

interface ReportSchedule {
  id: number;
  type: "weekly" | "monthly";
  day: number;
  name: string | null;
  email: string;
}

interface ReportHistoryResponseItem {
  id: number;
  user_id: number;
  name: string;
  time: string;
  link: string;
}

/**
 * [FACADE / MEDIATOR PATTERN] - useReportManagement: Manages report configuration and history state.
 * Adheres to SRP by centralizing business logic for the reports module.
 */
export function useReportManagement() {
  const [config, setConfig] = useState<ReportConfig>({
    frequency: "weekly",
    day: "2",
    topics: ["weather", "alerts"],
    email: "bao_cao@donvi.gov.vn",
  });

  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const setFrequency = useCallback((frequency: "weekly" | "monthly") => {
    setConfig((prev) => ({
      ...prev,
      frequency,
      day: frequency === "weekly" ? "2" : "1",
    }));
  }, []);

  const setDay = useCallback((day: string) => {
    setConfig((prev) => ({ ...prev, day }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setConfig((prev) => ({ ...prev, email }));
  }, []);

  const toggleTopic = useCallback((topicId: string) => {
    setConfig((prev) => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter((t) => t !== topicId)
        : [...prev.topics, topicId],
    }));
  }, []);

  const setAllTopics = useCallback((topicIds: string[]) => {
    setConfig((prev) => ({ ...prev, topics: topicIds }));
  }, []);

  const loadSavedConfig = useCallback(async () => {
    setIsLoadingConfig(true);

    try {
      const response = await apiClient.get<ReportSchedule[]>("/users/me/report-schedules");
      const schedules = Array.isArray(response.data) ? response.data : [];

      if (schedules.length === 0) {
        return;
      }

      const sortedSchedules = [...schedules].sort((a, b) => b.id - a.id);
      const latestSchedule = sortedSchedules[0];
      
      const allTopicNames = sortedSchedules
        .map((item) => item.name)
        .filter((name): name is string => Boolean(name));

      const savedTopics = Array.from(
        new Set(
          allTopicNames.flatMap((nameStr) =>
            nameStr
              .split(",")
              .map((n) => n.trim())
              .filter((n) => TOPIC_NAME_MAP[n])
              .map((n) => TOPIC_NAME_MAP[n])
          )
        )
      );

      setConfig((prev) => ({
        ...prev,
        frequency: latestSchedule.type,
        day: String(latestSchedule.day),
        email: latestSchedule.email || prev.email,
        topics: savedTopics.length > 0 ? savedTopics : prev.topics,
      }));
    } catch (error) {
      console.error("Không thể tải cấu hình báo cáo đã lưu:", error);
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    loadSavedConfig();
  }, [loadSavedConfig]);

  const loadReportHistory = useCallback(async () => {
    setIsLoadingHistory(true);

    try {
      const response = await apiClient.get<{ items?: ReportHistoryResponseItem[] }>("/users/me/report-history", {
        params: { page: 1, limit: 20 },
      });

      const items = Array.isArray(response.data?.items) ? response.data.items : [];
      setHistory(items.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        time: item.time,
        link: item.link,
      })));
    } catch (error) {
      console.error("Không thể tải danh sách báo cáo:", error);
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadReportHistory();
  }, [loadReportHistory]);

  const saveConfig = useCallback(async (t: TFunction) => {
    if (!config.email?.trim()) {
      alert("Vui lòng nhập email nhận báo cáo.");
      return;
    }

    if (config.topics.length === 0) {
      alert("Vui lòng chọn ít nhất một nội dung báo cáo.");
      return;
    }

    setIsSavingConfig(true);

    try {
      const requests = config.topics.map((topicName) =>
        apiClient.post("/users/me/report-schedules", {
          type: config.frequency,
          day: Number(config.day),
          name: topicName,
          email: config.email.trim(),
        })
      );

      await Promise.all(requests);
      alert(t("reports.config.savedMessage"));
    } catch (error: unknown) {
      const maybeError = error as { response?: { data?: { message?: string } }; message?: string };
      alert(maybeError?.response?.data?.message || maybeError?.message || "Lưu cấu hình báo cáo thất bại.");
    } finally {
      setIsSavingConfig(false);
    }
  }, [config]);

  const generateReport = useCallback(async () => {
    setIsGeneratingReport(true);

    try {
      const incidents = await getGovernmentIncidentHistory();
      await downloadAlertsEventsReportPdf(incidents);
    } catch (error) {
      console.error("Không thể tạo báo cáo PDF:", error);
      alert("Không thể tạo báo cáo PDF. Vui lòng thử lại.");
    } finally {
      setIsGeneratingReport(false);
    }
  }, []);

  return {
    config,
    history,
    setFrequency,
    setDay,
    setEmail,
    toggleTopic,
    setAllTopics,
    isLoadingConfig,
    isLoadingHistory,
    isSavingConfig,
    isGeneratingReport,
    saveConfig,
    generateReport,
  };
}

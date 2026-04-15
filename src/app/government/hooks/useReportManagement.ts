import { useState, useCallback, useEffect } from "react";
import { ReportConfig, ReportHistoryItem } from "../component/report-logic/ReportTypes";
import { REPORT_HISTORY } from "../../../context/services/mock/government/reports";
import { apiClient } from "@/services/api-config";

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

  const [history] = useState<ReportHistoryItem[]>(REPORT_HISTORY as ReportHistoryItem[]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

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

  const saveConfig = useCallback(async (t: any) => {
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
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Lưu cấu hình báo cáo thất bại.");
    } finally {
      setIsSavingConfig(false);
    }
  }, [config]);

  return {
    config,
    history,
    setFrequency,
    setDay,
    setEmail,
    toggleTopic,
    setAllTopics,
    isLoadingConfig,
    isSavingConfig,
    saveConfig,
  };
}

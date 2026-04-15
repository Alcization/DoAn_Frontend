export interface ReportHistoryItem {
  id: number;
  date: string;
  type: string;
  typeKey: string; // for i18n
  status: "sent" | "pending" | "failed"; // normalized status
}

export const REPORT_HISTORY: ReportHistoryItem[] = [
  { id: 1, date: "20/11/2025", type: "Cảnh báo", typeKey: "alert", status: "sent" },
  { id: 2, date: "13/11/2025", type: "Sự cố", typeKey: "incident", status: "sent" },
  { id: 3, date: "06/11/2025", type: "Tổng hợp", typeKey: "summary", status: "sent" },
];

export const REPORT_TOPICS = [
  { id: "weather", labelKey: "weather" },
  { id: "alerts", labelKey: "alerts" },
  { id: "incidents", labelKey: "incidents" },
];

export type Frequency = "weekly" | "monthly";

export interface ReportConfig {
  frequency: Frequency;
  day: string;
  topics: string[];
  email: string;
}

export interface ReportHistoryItem {
  id: number;
  typeKey: string;
  date: string;
  status: "sent" | "failed" | "pending";
}

export interface ReportTopic {
  id: string;
  labelKey: string;
}

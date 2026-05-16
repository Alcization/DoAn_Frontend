export type Frequency = "weekly" | "monthly";

export interface ReportConfig {
  frequency: Frequency;
  day: string;
  topics: string[];
  email: string;
}

export interface ReportHistoryItem {
  id: number;
  user_id: number;
  name: string;
  time: string;
  link: string;
}

export interface ReportTopic {
  id: string;
  labelKey: string;
}

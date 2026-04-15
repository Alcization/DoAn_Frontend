import { useTranslation } from "react-i18next";
import { Calendar, Mail, Save, Send, ChevronDown } from "lucide-react";
import { REPORT_TOPICS } from "../../../context/services/mock/government/reports";
import { FREQUENCY_STRATEGY } from "./report-logic/ReportStrategies";
import { ReportConfig } from "./report-logic/ReportTypes";

interface ReportConfigFormProps {
  config: ReportConfig;
  setFrequency: (frequency: "weekly" | "monthly") => void;
  setDay: (day: string) => void;
  setEmail: (email: string) => void;
  toggleTopic: (topicId: string) => void;
  setAllTopics: (topicIds: string[]) => void;
  isLoadingConfig: boolean;
  isSavingConfig: boolean;
  saveConfig: (t: any) => Promise<void>;
}

/**
 * [STRATEGY PATTERN] - ReportConfigForm: Uses Styling Strategies for frequency-dependent logic.
 */
export default function ReportConfigForm({
  config,
  setFrequency,
  setDay,
  setEmail,
  toggleTopic,
  setAllTopics,
  isLoadingConfig,
  isSavingConfig,
  saveConfig,
}: ReportConfigFormProps) {
  const { t } = useTranslation();
  const currentFrequencyStrategy = FREQUENCY_STRATEGY[config.frequency];
  const days = currentFrequencyStrategy.getDays(t);

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-(--color-text-primary)">
        <Calendar size={18} className="text-(--color-primary)" />
        <h2 className="m-0 text-(--text-lg) font-semibold">
          {t("reports.config.title")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[var(--text-sm)]">
        {/* Frequency */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-(--color-text-secondary)">
            {t("reports.config.frequencyLabel")}
          </label>
          <div className="flex rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden text-[var(--text-sm)]">
            <button
              className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                config.frequency === "weekly"
                  ? "bg-(--color-primary) text-(--color-surface)"
                  : "text-(--color-text-secondary) hover:bg-(--color-bg)"
              }`}
              onClick={() => setFrequency("weekly")}
            >
              {t("reports.config.weekly")}
            </button>
            <button
              className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                config.frequency === "monthly"
                  ? "bg-(--color-primary) text-(--color-surface)"
                  : "text-(--color-text-secondary) hover:bg-(--color-bg)"
              }`}
              onClick={() => setFrequency("monthly")}
            >
              {t("reports.config.monthly")}
            </button>
          </div>
        </div>

        {/* Day Selection */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-(--color-text-secondary)">
             {t("reports.config.dayLabel")}
          </label>
          <div className="relative">
            <select
              value={config.day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full h-[50px] appearance-none rounded-md border border-(--color-border) px-4 bg-(--color-surface) focus:border-(--color-primary) focus:outline-none text-(--color-text-primary) pr-10"
            >
              {days.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={18} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none" 
            />
          </div>
          {config.frequency === "monthly" && (
            <p className="m-0 text-(--color-text-muted) italic">
              * {t("reports.config.monthEndNote")}
            </p>
          )}
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-semibold text-(--color-text-secondary)">
            {t("reports.config.topicsLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => setAllTopics(REPORT_TOPICS.map(t => t.id))}
                className={`rounded-md border px-4 py-2 font-semibold transition-colors border-dashed border-(--color-border) text-(--color-text-muted) hover:bg-(--color-bg)`}
            >
                {t("reports.config.allTopics")}
            </button>
            {REPORT_TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className={`rounded-md border px-4 py-2 font-semibold transition-colors ${
                  config.topics.includes(topic.id)
                    ? "border-(--color-primary-soft) bg-(--color-primary-bg) text-(--color-primary-strong)"
                    : "border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-bg)"
                }`}
              >
                {t(`reports.topics.${topic.labelKey}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-semibold text-(--color-text-secondary)">
            {t("reports.config.emailLabel")}
          </label>
          <div className="flex items-center gap-2 rounded-md border border-(--color-border) px-4 py-3 bg-(--color-surface)">
            <Mail size={16} className="text-(--color-primary)" />
            <input
              type="email"
              value={config.email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-none bg-transparent focus:outline-none text-(--color-text-primary)"
              placeholder={t("reports.config.emailPlaceholder")}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => saveConfig(t)}
          disabled={isLoadingConfig || isSavingConfig}
          className="inline-flex items-center gap-2 rounded-md bg-(--color-primary) px-5 py-3 font-semibold text-(--color-surface) hover:opacity-90 transition-opacity"
        >
          <Save size={16} /> {isLoadingConfig ? "Đang tải..." : isSavingConfig ? "Đang lưu..." : t("reports.config.saveBtn")}
        </button>
        <button className="inline-flex items-center gap-2 rounded-md border border-(--color-border) px-5 py-3 font-semibold text-(--color-text-secondary) hover:border-(--color-primary-soft) hover:text-(--color-primary) transition-colors">
          <Send size={16} /> {t("reports.config.createBtn")}
        </button>
      </div>
    </div>
  );
}

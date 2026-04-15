"use client";

import { useTranslation } from "react-i18next";
import { Calendar, Save, Send, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { useReportSettings } from "@/app/normal/hooks/useReportSettings";
import { DAYS_OF_WEEK } from "@/context/services/mock/normal/business/reports";

export default function ReportSettings() {
  const { t } = useTranslation();
  const [showReportSettings, setShowReportSettings] = useState(false);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const {
    settings: reportSettings,
    updateSettings: setReportSettings,
    loadSavedSchedules,
    save,
    reset,
  } = useReportSettings();

  useEffect(() => {
    const loadInitialSchedule = async () => {
      try {
        setIsLoadingSchedule(true);
        await loadSavedSchedules();
      } catch (error) {
        console.error("Không thể tải lịch báo cáo đã lưu:", error);
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    loadInitialSchedule();
  }, [loadSavedSchedules]);

  return (
    <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border)">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-(--color-primary)">
          <Calendar size={20} />
          <h2 className="m-0 text-(--text-lg) sm:text-(--text-xl) text-(--color-text-primary)">
            {t("businessReports.settings.title")}
          </h2>
        </div>
        <button
          onClick={() => setShowReportSettings(!showReportSettings)}
          className="px-4 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg) transition-colors text-(--text-sm) cursor-pointer text-(--color-text-primary)"
        >
          {showReportSettings ? t("businessReports.buttons.hide") : t("businessReports.buttons.show")}
        </button>
      </div>

      {showReportSettings && (
        <div className="space-y-4 mt-4 pt-4 border-t border-(--color-border)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-(--text-sm) font-semibold text-(--color-text-secondary)">
                {t("businessReports.settings.scheduleDay")}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-(--color-bg) transition-colors">
                  <input
                    type="radio"
                    name="schedule"
                    checked={reportSettings.scheduleType === "weekly"}
                    onChange={() => setReportSettings({ scheduleType: "weekly" })}
                    className="cursor-pointer"
                  />
                  <span className="text-(--text-sm) flex-1 text-(--color-text-primary)">{t("businessReports.settings.weekly")}</span>
                  {reportSettings.scheduleType === "weekly" && (
                    <div className="relative">
                      <select
                        value={reportSettings.weeklyDay}
                        onChange={(e) => setReportSettings({ weeklyDay: e.target.value })}
                        className="pl-3 pr-8 py-1.5 rounded-lg border border-(--color-border) text-(--text-sm) bg-(--color-surface) text-(--color-text-primary) appearance-none cursor-pointer focus:outline-none focus:border-(--color-primary)"
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day.key} value={day.value}>
                            {t(`common.days.${day.key}`)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none" />
                    </div>
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-(--color-bg) transition-colors">
                  <input
                    type="radio"
                    name="schedule"
                    checked={reportSettings.scheduleType === "monthly"}
                    onChange={() => setReportSettings({ scheduleType: "monthly" })}
                    className="cursor-pointer"
                  />
                  <span className="text-(--text-sm) flex-1 text-(--color-text-primary)">{t("businessReports.settings.monthly")}</span>
                  {reportSettings.scheduleType === "monthly" && (
                    <div className="relative">
                      <select
                        value={reportSettings.monthlyDay}
                        onChange={(e) => setReportSettings({ monthlyDay: e.target.value })}
                        className="pl-3 pr-8 py-1.5 rounded-lg border border-(--color-border) text-(--text-sm) bg-(--color-surface) text-(--color-text-primary) appearance-none cursor-pointer focus:outline-none focus:border-(--color-primary)"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day.toString()}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none" />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() =>  alert(`Sent!`)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none bg-gradient-to-r from-(--color-primary-strong) to-(--color-primary) text-white font-semibold cursor-pointer shadow-lg shadow-(--color-primary)/25 hover:shadow-xl hover:shadow-(--color-primary)/30 transition-all text-(--text-sm) sm:text-(--text-base)"
            >
              <Send size={18} /> {t("businessReports.buttons.sendNow")}
            </button>
            <button
              onClick={async () => {
                try {
                  setIsSavingSchedule(true);
                  await save();
                  alert("Lưu lịch báo cáo thành công!");
                } catch (error: any) {
                  alert(error?.response?.data?.message || error?.message || "Lưu lịch báo cáo thất bại.");
                } finally {
                  setIsSavingSchedule(false);
                }
              }}
              disabled={isSavingSchedule || isLoadingSchedule}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg) transition-colors text-(--text-sm) sm:text-(--text-base) cursor-pointer text-(--color-text-primary)"
            >
              <Save size={18} /> {isLoadingSchedule ? "Đang tải lịch..." : isSavingSchedule ? "Đang lưu..." : t("businessReports.buttons.saveSchedule")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

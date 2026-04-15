import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Sun, Wind } from "lucide-react";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";

type SetAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  location: any | null;
  onSave: (id: number, alertSettings: AlertSettings) => void;
};

type AlertSettings = {
  timeRange: { from: string; to: string };
  duration: 5 | 15 | 30;
  weather: {
    enabled: boolean;
    tempThreshold: number;
  };
  traffic: {
    enabled: boolean;
    status: 'heavy' | 'moderate';
  };
};

export default function SetAlertModal({ isOpen, onClose, location, onSave }: SetAlertModalProps) {
  const { t } = useTranslation();
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    timeRange: { from: "06:00", to: "22:00" },
    duration: 15,
    weather: {
      enabled: false,
      tempThreshold: 35,
    },
    traffic: {
      enabled: false,
      status: 'heavy',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset or keep? Usually keep for set alert until confirmed
    }
  }, [isOpen]);

  if (!location) return null;

  const handleSave = () => {
    onSave(location.id, alertSettings);
    onClose();
  };

  const toggleWeather = () => {
    setAlertSettings({
      ...alertSettings,
      weather: { ...alertSettings.weather, enabled: !alertSettings.weather.enabled }
    });
  };

  const toggleTraffic = () => {
    setAlertSettings({
      ...alertSettings,
      traffic: { ...alertSettings.traffic, enabled: !alertSettings.traffic.enabled }
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader 
        title={t("personalPage.modals.alert.title")}
        subtitle={location.name}
        icon={<Bell size={20} className="text-[var(--color-warning)]" />}
        onClose={onClose}
        iconBgColor="bg-[var(--color-warning-bg)]"
      />

      <ModalBody>
        {/* Time Range */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-(--color-text-secondary)">
            {t("personalPage.settings.timeRange")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={alertSettings.timeRange.from}
              onChange={(e) => setAlertSettings({
                ...alertSettings,
                timeRange: { ...alertSettings.timeRange, from: e.target.value }
              })}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) text-sm"
            />
            <span className="text-(--color-text-secondary) text-sm font-medium">
              {t("personalPage.settings.to")}
            </span>
            <input
              type="time"
              value={alertSettings.timeRange.to}
              onChange={(e) => setAlertSettings({
                ...alertSettings,
                timeRange: { ...alertSettings.timeRange, to: e.target.value }
              })}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) text-sm"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-3 mt-6">
          <label className="text-sm font-semibold text-(--color-text-secondary)">
            {t("personalPage.settings.duration")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[5, 15, 30].map((d) => (
              <button
                key={d}
                onClick={() => setAlertSettings({ ...alertSettings, duration: d as any })}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  alertSettings.duration === d
                    ? "bg-(--color-primary) border-(--color-primary) text-white shadow-md shadow-blue-500/20"
                    : "bg-(--color-bg) border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-bg-secondary)"
                }`}
              >
                {d}{t("personalPage.settings.minutes")}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-(--color-border) my-6" />

        {/* Weather Alert */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-(--color-warning-bg)">
                <Sun size={20} className="text-(--color-warning)" />
              </div>
              <div>
                <p className="font-semibold text-(--color-text-primary)">
                  {t("personalPage.settings.weather.title")}
                </p>
                <p className="text-xs text-(--color-text-secondary)">
                  {t("personalPage.settings.weather.desc")}
                </p>
              </div>
            </div>
            <button
              onClick={toggleWeather}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                alertSettings.weather.enabled ? 'bg-(--color-primary)' : 'bg-(--color-border)'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  alertSettings.weather.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          
          {alertSettings.weather.enabled && (
            <div className="pl-11 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={alertSettings.weather.tempThreshold}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    weather: { ...alertSettings.weather, tempThreshold: parseInt(e.target.value) }
                  })}
                  className="flex-1 accent-(--color-primary)"
                />
                <span className="w-12 text-center text-sm font-bold text-(--color-primary)">
                  {alertSettings.weather.tempThreshold}°C
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Traffic Alert */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-(--color-danger-bg)">
                <Wind size={20} className="text-(--color-danger)" />
              </div>
              <div>
                <p className="font-semibold text-(--color-text-primary)">
                  {t("personalPage.settings.traffic.title")}
                </p>
                <p className="text-xs text-(--color-text-secondary)">
                  {t("personalPage.settings.traffic.desc")}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTraffic}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                alertSettings.traffic.enabled ? 'bg-(--color-primary)' : 'bg-(--color-border)'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  alertSettings.traffic.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {alertSettings.traffic.enabled && (
            <div className="pl-11 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
              {(['moderate', 'heavy'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    traffic: { ...alertSettings.traffic, status }
                  })}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                    alertSettings.traffic.status === status
                      ? "bg-(--color-danger-bg) border-(--color-danger) text-(--color-danger)"
                      : "bg-(--color-bg) border-(--color-border) text-(--color-text-secondary)"
                  }`}
                >
                  {t(`personalPage.settings.traffic.${status}`)}
                </button>
              ))}
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <button 
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium text-sm hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          {t("common.cancel")}
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 px-4 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Bell size={16} />
          {t("personalPage.modals.alert.saveBtn")}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}

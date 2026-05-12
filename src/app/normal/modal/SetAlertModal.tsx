import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Sun, Wind, Loader2 } from "lucide-react";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";
import { getAlertPolicies, createOrUpdateAlertPolicy, type AlertPolicy } from "@/services/api/alertPolicies";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  /**
   * Convert time string (HH:MM) to HH:MM:SS format for API
   */
  const formatTimeForApi = (time: string): string => {
    return `${time}:00`;
  };

  /**
   * Convert API time format (HH:MM:SS) to HH:MM for UI
   */
  const formatTimeForUi = (time: string): string => {
    return time.substring(0, 5);
  };

  /**
   * Map AlertPolicy from API to AlertSettings for UI
   */
  const mapApiToSettings = (policy: AlertPolicy): AlertSettings => {
    return {
      timeRange: {
        from: formatTimeForUi(policy.start_hour),
        to: formatTimeForUi(policy.end_hour),
      },
      duration: (policy.effect_time ?? 15) as 5 | 15 | 30,
      weather: {
        enabled: policy.temp_threshold !== null && policy.temp_threshold !== undefined,
        tempThreshold: policy.temp_threshold ?? 35,
      },
      traffic: {
        enabled: policy.traffic_threshold !== null && policy.traffic_threshold !== undefined,
        status: policy.traffic_threshold === 'Heavy' ? 'heavy' : 'moderate',
      },
    };
  };

  /**
   * Map AlertSettings from UI to AlertPolicy for API
   */
  const mapSettingsToApi = (settings: AlertSettings, locationId: number): AlertPolicy => {
    return {
      id: locationId,
      start_hour: formatTimeForApi(settings.timeRange.from),
      end_hour: formatTimeForApi(settings.timeRange.to),
      effect_time: settings.duration,
      temp_threshold: settings.weather.enabled ? settings.weather.tempThreshold : null,
      traffic_threshold: settings.traffic.enabled
        ? (settings.traffic.status === 'heavy' ? 'Heavy' : 'Moderate')
        : null,
    };
  };

  /**
   * Load existing policy for the location
   */
  useEffect(() => {
    if (isOpen && location?.id) {
      loadExistingPolicy();
    }
  }, [isOpen, location?.id]);

  const loadExistingPolicy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const policies = await getAlertPolicies();
      const existingPolicy = policies.find(p => p.id === location.id);

      if (existingPolicy) {
        const settings = mapApiToSettings(existingPolicy);
        setAlertSettings(settings);
      } else {
        // Reset to defaults if no existing policy
        setAlertSettings({
          timeRange: { from: "06:00", to: "22:00" },
          duration: 15,
          weather: { enabled: false, tempThreshold: 35 },
          traffic: { enabled: false, status: 'heavy' },
        });
      }
    } catch (err) {
      console.error('Error loading alert policy:', err);
      setError('Failed to load alert policy');
    } finally {
      setIsLoading(false);
    }
  };

  if (!location) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const policyData = mapSettingsToApi(alertSettings, location.id);
      await createOrUpdateAlertPolicy(policyData);

      // Call the parent's onSave callback as well (for any additional handling)
      onSave(location.id, alertSettings);
      onClose();
    } catch (err) {
      console.error('Error saving alert policy:', err);
      setError('Failed to save alert policy');
    } finally {
      setIsSaving(false);
    }
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100/50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="text-(--color-primary) animate-spin" />
            <span className="ml-2 text-(--color-text-secondary)">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <>
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
                  disabled={isSaving}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) text-sm disabled:opacity-50"
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
                  disabled={isSaving}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) text-sm disabled:opacity-50"
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
                    disabled={isSaving}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 ${
                      alertSettings.duration === d
                        ? "bg-(--color-primary) border-(--color-primary) text-white shadow-md shadow-blue-500/20"
                        : "bg-(--color-bg) border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-bg-secondary)"
                    }`}
                  >
                    {d} {t("personalPage.settings.minutes")}
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
                  disabled={isSaving}
                  className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
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
                      disabled={isSaving}
                      className="flex-1 accent-(--color-primary) disabled:opacity-50"
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
                  disabled={isSaving}
                  className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
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
                      disabled={isSaving}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium capitalize transition-all disabled:opacity-50 ${
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
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <button 
          onClick={onClose}
          disabled={isSaving || isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium text-sm hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50"
        >
          {t("common.cancel")}
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("personalPage.modals.alert.savingBtn")}
            </>
          ) : (
            <>
              <Bell size={16} />
              {t("personalPage.modals.alert.saveBtn")}
            </>
          )}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}

import React, { useState, useEffect } from "react";
import { Bell, Thermometer, CloudRain } from "lucide-react";
import { ModalItemFactory } from "./logic/ModalItemFactory";
import { useTranslation } from "react-i18next";
import { ManagedArea } from "../component/area-logic/AreaTableTypes";

type AlertSettingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  area: ManagedArea | null;
  onSave?: (areaId: number, settings: {
    tempAlertEnabled: boolean;
    tempThreshold: number;
    rainAlertEnabled: boolean;
    rainThreshold: number;
  }) => void;
};

export default function AlertSettingModal({ isOpen, onClose, area, onSave }: AlertSettingModalProps) {
  const { t } = useTranslation();

  const [tempEnabled, setTempEnabled] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(35);

  const [rainEnabled, setRainEnabled] = useState(false);
  const [rainThreshold, setRainThreshold] = useState(50);

  useEffect(() => {
    if (area && isOpen) {
      setTempEnabled(area.tempAlertEnabled ?? false);
      setTempThreshold(area.tempThreshold ?? 35);
      setRainEnabled(area.rainAlertEnabled ?? false);
      setRainThreshold(area.rainThreshold ?? 50);
    }
  }, [area, isOpen]);

  if (!isOpen || !area) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(area.areaId, {
        tempAlertEnabled: tempEnabled,
        tempThreshold,
        rainAlertEnabled: rainEnabled,
        rainThreshold,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {ModalItemFactory.createHeader({
          title: t("areaManagement.alertSettingModal.title"),
          subtitle: t("areaManagement.alertSettingModal.desc", { name: area.name }),
          Icon: Bell,
          iconColorClass: "text-[#EAB308]",
          iconBgClass: "bg-[#EAB308]/10",
          onClose
        })}

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Weather Temperature Alert Card */}
          <div className="p-5 rounded-2xl border border-(--color-border) bg-(--color-bg)/30 space-y-4 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${tempEnabled ? 'bg-(--color-primary-bg) text-(--color-primary)' : 'bg-gray-100 text-gray-400'}`}>
                  <Thermometer size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-(--color-text-primary) text-sm m-0">
                    {t("areaManagement.alertSettingModal.tempLabel")}
                  </h4>
                  <p className="text-xs text-(--color-text-secondary) m-0 mt-0.5">
                    {t("areaManagement.alertSettingModal.tempDesc")}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={tempEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setTempEnabled(checked);
                    if (checked) {
                      setRainEnabled(false);
                    }
                  }}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
              </label>
            </div>

            {tempEnabled && (
              <div className="space-y-2 pt-2 border-t border-(--color-border)/50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
                  <span>{t("areaManagement.alertSettingModal.tempThreshold")}</span>
                  <span className="text-(--color-primary) font-bold text-sm">{tempThreshold}°C</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="50" 
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-(--color-primary)"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>15°C</span>
                  <span>50°C</span>
                </div>
              </div>
            )}
          </div>

          {/* Rainfall Alert Card */}
          <div className="p-5 rounded-2xl border border-(--color-border) bg-(--color-bg)/30 space-y-4 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${rainEnabled ? 'bg-(--color-primary-bg) text-(--color-primary)' : 'bg-gray-100 text-gray-400'}`}>
                  <CloudRain size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-(--color-text-primary) text-sm m-0">
                    {t("areaManagement.alertSettingModal.rainLabel")}
                  </h4>
                  <p className="text-xs text-(--color-text-secondary) m-0 mt-0.5">
                    {t("areaManagement.alertSettingModal.rainDesc")}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rainEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRainEnabled(checked);
                    if (checked) {
                      setTempEnabled(false);
                    }
                  }}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
              </label>
            </div>

            {rainEnabled && (
              <div className="space-y-2 pt-2 border-t border-(--color-border)/50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
                  <span>{t("areaManagement.alertSettingModal.rainThreshold")}</span>
                  <span className="text-(--color-primary) font-bold text-sm">{rainThreshold} mm</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="5"
                  value={rainThreshold}
                  onChange={(e) => setRainThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-(--color-primary)"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>10 mm</span>
                  <span>200 mm</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {ModalItemFactory.createFooter({
          onClose,
          onConfirm: handleSave,
          confirmText: t("areaManagement.alertSettingModal.saveBtn"),
          actionType: "confirm",
          t
        })}
      </div>
    </div>
  );
}

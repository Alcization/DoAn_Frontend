import React from "react";
import { Map as MapIcon, Info } from "lucide-react";
import AreaEditorMap from "../component/AreaEditorMap";
import { ModalItemFactory } from "./logic/ModalItemFactory";
import { useAreaManagement } from "../hooks/useAreaManagement";
import { useTranslation } from "react-i18next";
import { AreaMutationPayload } from "../component/area-logic/AreaTableTypes";

type QuickAddAreaModalProps = {
  isOpen: boolean;
  onClose: () => void;
    onCreate?: (payload: AreaMutationPayload) => Promise<void> | void;
};

/**
 * [REFACTORED] - QuickAddAreaModal: Uses ModalItemFactory and useAreaManagement hook.
 */
export default function QuickAddAreaModal({ isOpen, onClose, onCreate }: QuickAddAreaModalProps) {
  const { t } = useTranslation();
  const { 
    center, 
    radius, 
    formData, 
    setCenter, 
    setRadius, 
        handleUpdateField,
        handleSave,
        isFormValid,
    } = useAreaManagement();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {ModalItemFactory.createHeader({
            title: t("areaManagement.form.title"),
            subtitle: t("areaManagement.form.desc"),
            Icon: MapIcon,
            onClose
        })}

        {/* Body - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] h-[600px]">
            {/* Left: Form */}
            <div className="p-6 space-y-6 overflow-y-auto border-r border-(--color-border)">
                {ModalItemFactory.createFormGroup({
                    label: t("areaManagement.form.nameLabel"),
                    children: (
                        <input 
                            type="text" 
                            placeholder={t("areaManagement.form.namePlaceholder")}
                            value={formData.name}
                            onChange={(e) => handleUpdateField("name", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all placeholder:text-(--color-text-muted)"
                        />
                    )
                })}

                {ModalItemFactory.createFormGroup({
                    label: t("areaManagement.editor.radiusLabel"),
                    children: (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-(--color-primary) font-bold">{radius} km</span>
                            </div>
                            <input 
                                type="range" 
                                min="0.1"
                                max="10"
                                step="0.1"
                                value={radius}
                                onChange={(e) => setRadius(parseFloat(e.target.value))}
                                className="w-full h-2 bg-(--color-bg-secondary) rounded-lg appearance-none cursor-pointer accent-(--color-primary)"
                            />
                            <div className="flex justify-between text-[10px] text-(--color-text-muted) px-1 font-medium">
                                <span>0.1 km</span>
                                <span>5 km</span>
                                <span>10 km</span>
                            </div>
                        </div>
                    )
                })}

                {ModalItemFactory.createFormGroup({
                    label: t("areaManagement.form.unitLabel"),
                    children: (
                        <input 
                            type="text" 
                            placeholder={t("areaManagement.form.unitPlaceholder")}
                            value={formData.adminUnit}
                            onChange={(e) => handleUpdateField("adminUnit", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all placeholder:text-(--color-text-muted)"
                        />
                    )
                })}

                {ModalItemFactory.createFormGroup({
                    label: t("areaManagement.form.typeLabel"),
                    children: (
                        <select 
                            value={formData.type}
                            onChange={(e) => handleUpdateField("type", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="Ward">{t("areaManagement.type.Ward")}</option>
                            <option value="District">{t("areaManagement.type.District")}</option>
                        </select>
                    )
                })}

                {/* Info Card */}
                <div className="p-4 rounded-2xl bg-(--color-bg-secondary)/50 border border-(--color-border) space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-(--color-text-primary)">
                        <Info size={16} className="text-(--color-primary)" />
                        {t("areaManagement.editor.boundaryData")}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                            <p className="text-(--color-text-muted) uppercase tracking-wider text-[10px] m-0">{t("areaManagement.editor.centerPoint")}</p>
                            <p className="text-sm font-bold text-(--color-text-primary) truncate m-0">
                                {center ? `${center[0].toFixed(4)}, ${center[1].toFixed(4)}` : t("areaManagement.editor.notSet")}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-(--color-text-muted) uppercase tracking-wider text-[10px] m-0">{t("areaManagement.editor.status")}</p>
                            <p className={`text-sm font-bold m-0 ${center ? "text-(--color-success)" : "text-(--color-warning)"}`}>
                                {center ? t("areaManagement.editor.ready") : t("areaManagement.editor.pickOnMap")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Map Editor */}
            <div className="relative bg-(--color-bg-secondary)/30">
                <AreaEditorMap
                    center={center}
                    radius={radius}
                    onChange={(newCenter) => setCenter(newCenter)}
                />
            </div>
        </div>

        {ModalItemFactory.createFooter({
            onClose,
            onConfirm: () => handleSave(async (payload) => {
              if (!onCreate) return;
              await onCreate(payload);
            }),
            confirmText: t("areaManagement.form.saveBtn"),
            disabled: !isFormValid,
            t
        })}
      </div>
    </div>
  );
}

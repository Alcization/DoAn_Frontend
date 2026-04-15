import React from "react";
import { AlertTriangle } from "lucide-react";
import { ModalItemFactory } from "./logic/ModalItemFactory";
import { useAreaManagement } from "../hooks/useAreaManagement";
import { useTranslation } from "react-i18next";
import { ManagedArea } from "../component/area-logic/AreaTableTypes";

type DeleteAreaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  area: ManagedArea | null;
  onConfirm?: (areaId: number) => void;
};

/**
 * [REFACTORED] - DeleteAreaModal: Uses ModalItemFactory and useAreaManagement hook.
 */
export default function DeleteAreaModal({ isOpen, onClose, area, onConfirm }: DeleteAreaModalProps) {
  const { t } = useTranslation();
  const { handleConfirmDelete } = useAreaManagement(area);

  if (!isOpen || !area) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {ModalItemFactory.createHeader({
            title: t("areaManagement.deleteModal.title"),
            subtitle: t("areaManagement.deleteModal.desc"),
            Icon: AlertTriangle,
            iconColorClass: "text-(--color-danger)",
            iconBgClass: "bg-(--color-danger-bg)",
            onClose
        })}

        <div className="p-6 space-y-4">
          {/* Area Info Card */}
          <div className="p-4 rounded-xl bg-(--color-bg) border border-(--color-border)">
            <p className="text-xs text-(--color-text-secondary) mb-1">
              {t("areaManagement.deleteModal.areaLabel")}
            </p>
            <p className="font-bold text-(--color-text-primary) m-0">{area.name}</p>
            <p className="text-sm text-(--color-text-secondary) mt-0.5 m-0">
              {area.adminUnit} • {t(`areaManagement.type.${area.type}`)}
            </p>
          </div>

          {/* Warning Card */}
          <div className="p-4 rounded-xl bg-(--color-danger-bg) border border-(--color-danger)/20">
            <p className="text-sm text-(--color-danger) flex items-start gap-2 m-0">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{t("areaManagement.deleteModal.warning")}</span>
            </p>
          </div>
        </div>

        {ModalItemFactory.createFooter({
            onClose,
            onConfirm: () => handleConfirmDelete(onConfirm),
            confirmText: t("areaManagement.deleteModal.confirmBtn"),
            actionType: "danger",
            t
        })}
      </div>
    </div>
  );
}

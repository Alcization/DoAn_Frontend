import { useTranslation } from "react-i18next";
import { Trash2, AlertTriangle } from "lucide-react";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";
import { useModalActions } from "../hooks/useModalActions";

type DeleteLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  location: any | null;
  onConfirm: (id: number) => void;
};

export default function DeleteLocationModal({ isOpen, onClose, location, onConfirm }: DeleteLocationModalProps) {
  const { t } = useTranslation();
  const { handleDelete: executeDelete } = useModalActions();

  if (!location) return null;

  const handleConfirm = () => {
    if (location) {
      executeDelete(onConfirm, location.id, onClose);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader 
        title={t("personalPage.modals.delete.title")}
        subtitle={t("personalPage.modals.delete.subtitle")}
        icon={<Trash2 size={20} className="text-[var(--color-danger)]" />}
        onClose={onClose}
        iconBgColor="bg-[var(--color-danger-bg)]"
      />

      <ModalBody className="space-y-4">
        {/* Warning Box */}
        <div className="flex gap-3 p-4 rounded-xl bg-[var(--color-danger-bg)]/50 border border-[var(--color-danger)]/20">
          <AlertTriangle size={20} className="text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">
              {t("personalPage.modals.delete.warning")}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {t("personalPage.modals.delete.warningDesc")}
            </p>
          </div>
        </div>

        {/* Location Info */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
            {t("personalPage.modals.delete.locationLabel")}
          </p>
          <p className="font-semibold text-[var(--color-text-primary)]">
            {location?.name}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {location?.address}
          </p>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] text-center">
          {t("personalPage.modals.delete.confirmation")}
        </p>
      </ModalBody>

      <ModalFooter>
        <button 
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium text-sm hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          {t("common.cancel")}
        </button>
        <button 
          onClick={handleConfirm}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-danger)] text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          {t("personalPage.modals.delete.deleteBtn")}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}

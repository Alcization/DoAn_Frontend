import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import LocationSelector from "../shared_component/LocationSelector";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";
import { useLocationForm } from "../hooks/useLocationForm";
import { useModalActions } from "../hooks/useModalActions";

type AddFavoritePlaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "business" | "personal";
  onAdd?: (place: { 
    name: string; 
    address: string; 
    lat?: number; 
    lng?: number;
    destination?: { lat: number; lng: number; address: string };
    distance?: number; // Nhận thêm trường distance từ Form
  }) => void;
};

export default function AddFavoritePlaceModal({ isOpen, onClose, mode, onAdd }: AddFavoritePlaceModalProps) {
  const { t } = useTranslation();
  
  const { 
    name, 
    setName, 
    setSelectorData, 
    isValid, 
    getFormData 
  } = useLocationForm({ mode, isOpen });

  const { handleAdd: executeAdd } = useModalActions();

  const handleConfirm = () => {
    executeAdd(onAdd, getFormData(), onClose);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <ModalHeader 
        title={mode === "business" ? t("home.favorite.addModal.titleBusiness") : t("home.favorite.addModal.titlePersonal")}
        subtitle={t("home.favorite.addModal.desc")}
        icon={<Plus size={24} className="text-(--color-primary)" />}
        onClose={onClose}
      />

      <ModalBody>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-(--color-text-muted) ml-1">
              {mode === "business" ? t("home.favorite.addModal.routeNameLabel") : t("home.favorite.addModal.placeNameLabel")}
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === "business" ? t("home.favorite.addModal.routeNamePlaceholder") : t("home.favorite.addModal.placeNamePlaceholder")}
              className="w-full px-5 py-3.5 rounded-2xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:ring-4 focus:ring-(--color-primary)/10 outline-none transition-all font-bold placeholder:text-(--color-text-muted) placeholder:font-normal"
            />
          </div>

          <LocationSelector 
            mode={mode}
            onSelectionChange={setSelectorData}
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <button 
          onClick={onClose}
          className="flex-1 px-6 py-3.5 rounded-[20px] border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) font-black text-sm hover:bg-(--color-bg-secondary) transition-all active:scale-[0.98]"
        >
          {t("common.cancel")}
        </button>
        <button 
          onClick={handleConfirm}
          disabled={!isValid}
          className="flex-[1.5] px-6 py-3.5 rounded-[20px] bg-(--color-primary) text-white font-black text-sm hover:brightness-110 disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          {t("home.favorite.addModal.addBtn")}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}
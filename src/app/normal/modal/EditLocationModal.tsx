import { useTranslation } from "react-i18next";
import { Edit2 } from "lucide-react";
import LocationSelector, { LocationSelectorData } from "../shared_component/LocationSelector";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";
import { useLocationForm } from "../hooks/useLocationForm";
import { useModalActions } from "../hooks/useModalActions";
import { useMemo } from "react";

type EditLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "personal" | "business";
  location: any | null;
  onSave: (id: number, name: string, originAddr: string, originLat?: number, originLng?: number, destAddr?: string, destLat?: number, destLng?: number) => void;
};

export default function EditLocationModal({ isOpen, onClose, mode = "personal", location, onSave }: EditLocationModalProps) {
  const { t } = useTranslation();

  // // Xử lý giá trị mặc định (Fallback) an toàn, chống crash khi API thiếu field
  // const getInitialData = (): { initialName: string; initialData: LocationSelectorData } => {
  //   if (!location) return { initialName: "", initialData: {} };
    
  //   if (mode === "personal") {
  //     return {
  //       initialName: location.name || "", // Fallback name
  //       initialData: {
  //         personal: {
  //           lat: location.lat || 0,        // Fallback lat
  //           lng: location.lng || 0,        // Fallback lng
  //           address: location.address || "" // Fallback address
  //         }
  //       }
  //     };
  //   } else {
  //     return {
  //       initialName: location.name || "",
  //       initialData: {
  //         origin: location.origin || { lat: 0, lng: 0, address: "" },
  //         destination: location.destination || { lat: 0, lng: 0, address: "" },
  //         routeData: location.routeData || null
  //       }
  //     };
  //   }
  // };

  // const { initialName, initialData } = getInitialData();

  const { initialName, initialData } = useMemo(() => {
    if (!location) return { initialName: "", initialData: {} };
    
    if (mode === "personal") {
      return {
        initialName: location.name || "", // Fallback name
        initialData: {
          personal: {
            lat: location.lat || 0,        // Fallback lat
            lng: location.lng || 0,        // Fallback lng
            address: location.address || "" // Fallback address
          }
        }
      };
    } else {
      return {
        initialName: location.name || "", // Fallback name
        initialData: {
          origin: location.origin || { lat: 0, lng: 0, address: "" },
          destination: location.destination || { lat: 0, lng: 0, address: "" },
          routeData: location.routeData || null
        }
      };
    }
  }, [location, mode]);

  const { 
    name, 
    setName, 
    setSelectorData, 
    isValid, 
    getFormData 
  } = useLocationForm({ mode, initialName, initialData, isOpen });

  const { handleSave: executeSave } = useModalActions();

  const handleConfirm = () => {
    if (location) {
      executeSave(onSave, location.id, getFormData(), onClose);
    }
  };

  if (!location) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <ModalHeader 
        title={mode === "business" ? t("personalPage.modals.edit.titleBusiness") : t("personalPage.modals.edit.title")}
        subtitle={mode === "business" ? t("personalPage.modals.edit.descBusiness") : t("personalPage.modals.edit.desc")}
        icon={<Edit2 size={20} className="text-(--color-primary)" />}
        onClose={onClose}
      />

      <ModalBody>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-(--color-text-primary)">
              {mode === "business" ? t("home.favorite.addModal.routeNameLabel") : t("personalPage.modals.edit.nameLabel")}
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === "business" ? t("home.favorite.addModal.routeNamePlaceholder") : t("personalPage.modals.edit.namePlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all placeholder:text-(--color-text-muted)"
            />
          </div>

          <LocationSelector 
            mode={mode}
            initialData={initialData}
            onSelectionChange={setSelectorData}
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <button 
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) font-medium text-sm hover:bg-(--color-bg-secondary) transition-colors"
        >
          {t("common.cancel")}
        </button>
        <button 
          onClick={handleConfirm}
          disabled={!isValid}
          className="flex-1 px-4 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit2 size={16} />
          {t("personalPage.modals.edit.saveBtn")}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}
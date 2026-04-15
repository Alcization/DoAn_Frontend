import { useTranslation } from "react-i18next";
import { MapPin, List } from "lucide-react";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";

type FavoriteLocation = {
  id: number;
  name: string;
  address: string;
  temp?: number;
  weather?: string;
};

type ViewAllFavoritesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "business" | "personal";
  data: FavoriteLocation[];
};

export default function ViewAllFavoritesModal({ isOpen, onClose, mode, data }: ViewAllFavoritesModalProps) {
  const { t } = useTranslation();

  const titleKey = mode === "business" 
    ? "home.favorite.viewAllModal.titleBusiness" 
    : "home.favorite.viewAllModal.titlePersonal";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <ModalHeader 
        title={t(titleKey)}
        subtitle={`${data.length} ${mode === "business" ? t("home.favorite.viewAllModal.routes") : t("home.favorite.viewAllModal.places")}`}
        icon={<List size={20} className="text-(--color-primary)" />}
        onClose={onClose}
        iconBgColor="bg-(--color-primary-bg)"
      />

      <ModalBody className="max-h-[60vh] overflow-y-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin size={48} className="text-(--color-text-muted) mb-4" />
            <p className="text-(--color-text-secondary) text-lg">
              {t("home.favorite.viewAllModal.empty")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((loc) => (
              <div
                key={loc.id}
                className="p-4 rounded-xl bg-(--color-bg) border border-(--color-border) hover:border-(--color-primary)/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin size={20} className="text-(--color-primary) mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-(--color-text-primary) mb-1 truncate">
                        {loc.name}
                      </p>
                      <p className="text-sm text-(--color-text-muted) truncate">
                        {loc.address}
                      </p>
                    </div>
                  </div>
                  {typeof loc.temp === "number" && (
                    <div className="text-right ml-3">
                      <div className="text-2xl mb-1">
                        {loc.weather === "sunny"
                          ? "☀️"
                          : loc.weather === "cloudy"
                          ? "⛅"
                          : "🌧️"}
                      </div>
                      <div className="font-semibold text-(--color-text-primary)">
                        {loc.temp}°C
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <button 
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
        >
          {t("home.favorite.viewAllModal.closeBtn")}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}

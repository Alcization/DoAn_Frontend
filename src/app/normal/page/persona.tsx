"use client";

import PersonalFavoriteLocations from "../shared_component/PersonalFavoriteLocations";
import PersonalFavoriteRoutes from "../shared_component/PersonalFavRoutes";
import PersonalSettings from "../shared_component/PersonalSettings";
import { useTranslation } from "react-i18next";

const MAX_LOCATIONS = 10;

export default function NormalPersona({ mode = "personal" }: { mode?: "personal" | "business" }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[var(--color-bg)] min-h-[calc(100vh-80px)]">
      
      {mode === "business" ? (
        // <PersonalFavoriteRoutes maxRoutes={MAX_LOCATIONS} />

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] px-2">
              {t("home.favorite.businessTitle")}
            </h3>
            <PersonalFavoriteRoutes
              maxRoutes={MAX_LOCATIONS}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] px-2">
              {t("home.favorite.personalTitle")}
            </h3>
            <PersonalFavoriteLocations
              maxLocations={MAX_LOCATIONS}
            />
          </div>
        </div>

      ) : (
        <PersonalFavoriteLocations maxLocations={MAX_LOCATIONS} />
      )}

      <PersonalSettings />
    </div>
  );
}

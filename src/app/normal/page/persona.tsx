"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FAVORITE_LOCATIONS_MOCK } from "../../../context/services/mock/normal/shared/personal";
import PersonalFavoriteLocations from "../shared_component/PersonalFavoriteLocations";
import PersonalFavoriteRoutes from "../shared_component/PersonalFavRoutes";
import PersonalSettings from "../shared_component/PersonalSettings";
import { FAVORITE_ROUTES_MOCK } from "../../../context/services/mock/normal/shared/business";

const MAX_LOCATIONS = 10;

export default function NormalPersona({ mode = "personal" }: { mode?: "personal" | "business" }) {
  const { t } = useTranslation();
  const [favoriteLocations, setFavoriteLocations] = useState(FAVORITE_LOCATIONS_MOCK);
  const [favoriteRoutes, setFavoriteRoutes] = useState(FAVORITE_ROUTES_MOCK);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[var(--color-bg)] min-h-[calc(100vh-80px)]">
      
      {mode === "business" ? (
        <PersonalFavoriteRoutes
          routes={favoriteRoutes}
          onReorder={setFavoriteRoutes}
          onDelete={(id: number) => setFavoriteRoutes(favoriteRoutes.filter((r) => r.id !== id))}
          maxRoutes={MAX_LOCATIONS}
        />
      ) : (
        <PersonalFavoriteLocations
          locations={favoriteLocations}
          onReorder={setFavoriteLocations}
          onDelete={(id: number) => setFavoriteLocations(favoriteLocations.filter((loc) => loc.id !== id))}
          maxLocations={MAX_LOCATIONS}
        />
      )}

      <PersonalSettings />
    </div>
  );
}

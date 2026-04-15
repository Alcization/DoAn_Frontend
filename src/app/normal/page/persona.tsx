"use client";

import PersonalFavoriteLocations from "../shared_component/PersonalFavoriteLocations";
import PersonalFavoriteRoutes from "../shared_component/PersonalFavRoutes";
import PersonalSettings from "../shared_component/PersonalSettings";

const MAX_LOCATIONS = 10;

export default function NormalPersona({ mode = "personal" }: { mode?: "personal" | "business" }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[var(--color-bg)] min-h-[calc(100vh-80px)]">
      
      {mode === "business" ? (
        <PersonalFavoriteRoutes maxRoutes={MAX_LOCATIONS} />
      ) : (
        <PersonalFavoriteLocations maxLocations={MAX_LOCATIONS} />
      )}

      <PersonalSettings />
    </div>
  );
}

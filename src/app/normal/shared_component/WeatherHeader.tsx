"use client";

import { Bell, MapPin, Navigation, Share2, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface WeatherHeaderProps {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  favoriteLocations: any[];
}

export default function WeatherHeader({
  selectedLocation,
  setSelectedLocation,
  favoriteLocations,
}: WeatherHeaderProps) {
  const { t } = useTranslation();
  const [showFavoriteDropdown, setShowFavoriteDropdown] = useState(false);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);

  const getCurrentLocation = () => {
    setIsLoadingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation(
            `${t("weather.search.currentLocation")} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`
          );
          setIsLoadingGPS(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(t("weather.search.gpsError"));
          setIsLoadingGPS(false);
        }
      );
    } else {
      alert(t("weather.search.browserError"));
      setIsLoadingGPS(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
        <h1 className="text-[24px] sm:text-[32px] lg:text-[36px] font-bold text-[var(--color-text-primary)] m-0">
          {t("weather.title")}
        </h1>
        <div className="flex gap-2 sm:gap-2.5">
          {[
            { icon: Bell, title: "weather.tooltips.subscribe" },
            { icon: Star, title: "weather.tooltips.save" },
            { icon: Share2, title: "weather.tooltips.share" },
          ].map(({ icon: Icon, title }) => (
            <button
              key={title}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors text-[var(--color-text-primary)]"
              title={t(title)}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-sm)] flex flex-wrap gap-3 items-center border border-[var(--color-border)]">
        <MapPin className="text-[var(--color-primary)] flex-shrink-0" size={22} />
        <div className="relative flex-1 min-w-[180px] sm:min-w-[220px]">
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            onFocus={() => setShowFavoriteDropdown(true)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2.5 text-[var(--text-sm)] sm:text-[var(--text-base)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            placeholder={t("weather.search.placeholder")}
          />
          {showFavoriteDropdown && favoriteLocations.length > 0 && (
            <>
                <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFavoriteDropdown(false)}
                />
                <div className="absolute z-20 w-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-lg max-h-60 overflow-y-auto">
                {favoriteLocations.map((loc) => (
                    <button
                    key={loc.id}
                    onClick={() => {
                        setSelectedLocation(loc.address);
                        setShowFavoriteDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[var(--color-bg)] transition-colors border-b border-[var(--color-border)] last:border-b-0"
                    >
                    <p className="font-semibold text-[var(--text-sm)] text-[var(--color-text-primary)] m-0">{loc.name}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)] m-0">{loc.address}</p>
                    </button>
                ))}
                </div>
            </>
          )}
        </div>
        <button
          onClick={getCurrentLocation}
          disabled={isLoadingGPS}
          className="px-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer hover:bg-[var(--color-bg)] transition-colors flex items-center gap-2 text-[var(--text-sm)] disabled:opacity-50 text-[var(--color-text-primary)]"
          title={t("weather.search.gpsBtn")}
        >
          <Navigation size={18} />
          {isLoadingGPS ? t("weather.search.gpsLoading") : t("weather.search.gpsBtn")}
        </button>
        <button className="px-4 sm:px-6 py-2.5 rounded-[var(--radius-md)] border-none bg-[var(--color-primary)] text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity text-[var(--text-sm)] sm:text-[var(--text-base)]">
          {t("weather.search.searchBtn")}
        </button>
      </div>
    </div>
  );
}

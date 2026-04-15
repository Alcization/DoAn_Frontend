"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../context/services/api";

// Component Imports
import WeatherAlert from "../shared_component/WeatherAlert";
import CurrentWeatherCard from "../shared_component/CurrentWeatherCard";
import FavoritePlaces from "../shared_component/FavoritePlaces";

interface NormalHomeProps {
  mode?: "business" | "personal";
}

export default function NormalHome({ mode = "personal" }: NormalHomeProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = mode === "business" 
        ? await api.business.getBusinessHomeData() 
        : await api.personal.getPersonalHomeData();
      setData(result);
    };
    fetchData();
  }, [mode]);

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-80px)] bg-[var(--color-bg)]">
      {/* <WeatherAlert /> */}

      <CurrentWeatherCard />

      <FavoritePlaces mode={mode} />
      
      {mode === "business" && (
        <FavoritePlaces mode="personal" navMode="business" />
      )}
    </div>
  );
}

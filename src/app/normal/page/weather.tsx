import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Mock Data
import { 
  FAVORITE_LOCATIONS, 
  WEATHER_TIMELINE, 
  HOURLY_24_FORECAST, 
  WEEK_FORECAST 
} from "../../../context/services/mock/normal/shared/weather";

// Components
import CurrentWeatherDetail from "../shared_component/CurrentWeatherDetail";
import HourlyForecast from "../shared_component/HourlyForecast";
import WeekForecastList from "../shared_component/WeekForecastList";

export default function NormalWeather() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("loc");
  const [selectedLocation, setSelectedLocation] = useState(locationParam || "Quận 1, TP.HCM");

  useEffect(() => {
    if (locationParam) {
      setSelectedLocation(locationParam);
    }
  }, [locationParam]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-(--color-bg) min-h-[calc(100vh-80px)]">

      <CurrentWeatherDetail selectedLocation={selectedLocation} />

      <HourlyForecast forecast={HOURLY_24_FORECAST} />

      <WeekForecastList forecast={WEEK_FORECAST} />
    </div>
  );
}

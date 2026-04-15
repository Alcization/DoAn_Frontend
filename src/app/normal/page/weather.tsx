import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Components
import CurrentWeatherDetail from "../shared_component/CurrentWeatherDetail";
import HourlyForecast from "../shared_component/HourlyForecast";
import WeekForecastList from "../shared_component/WeekForecastList";

export default function NormalWeather() {
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

      <HourlyForecast />

      <WeekForecastList />
    </div>
  );
}

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useVietmapFacade } from "../hooks/useVietmapFacade";

// Components
import CurrentWeatherDetail from "../shared_component/CurrentWeatherDetail";
import HourlyForecast from "../shared_component/HourlyForecast";
import WeekForecastList from "../shared_component/WeekForecastList";

export default function NormalWeather() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");
  const [selectedLocation, setSelectedLocation] = useState(locationParam || "");
  const { reverseGeocode } = useVietmapFacade();

  useEffect(() => {
    let mounted = true;

    const setFromParam = () => {
      if (locationParam) setSelectedLocation(locationParam);
    };

    if (locationParam) {
      setFromParam();
      return;
    }

    // Try to get user's current position and reverse geocode it
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (!mounted) return;
          try {
            const addr = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
            if (mounted) setSelectedLocation(addr);
          } catch (err) {
            // fallback to a friendly label if reverse fails
            if (mounted) setSelectedLocation("Vị trí hiện tại");
          }
        },
        (err) => {
          // permission denied or other error — keep empty or fallback
          if (mounted) setSelectedLocation("");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      // Not supported, keep empty
      setSelectedLocation("");
    }

    return () => { mounted = false; };
  }, [locationParam, reverseGeocode]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-(--color-bg) min-h-[calc(100vh-80px)]">

      <CurrentWeatherDetail selectedLocation={selectedLocation} />

      <HourlyForecast />

      <WeekForecastList selectedLocation={selectedLocation} />
    </div>
  );
}

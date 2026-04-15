import { 
  FAVORITE_LOCATIONS, 
  WEATHER_TIMELINE, 
  HOURLY_24_FORECAST, 
  WEEK_FORECAST 
} from '../../mock/normal/shared/weather';

const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org';
const DEFAULT_LOCATION = 'Ho Chi Minh City,VN';

const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_OPENWEATHER_API_KEY');
  }
  return apiKey;
};

const fallbackWeatherData = {
  FAVORITE_LOCATIONS,
  WEATHER_TIMELINE,
  HOURLY_24_FORECAST,
  WEEK_FORECAST,
};

type Coordinate = {
  lat: number;
  lng: number;
};

type WeatherTimeframe = '24h' | '7days' | '30days';

type AggregatedWeather = {
  temp: number;
  rainfall: number;
  wind: number;
};

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const aggregateFromForecastItems = (items: any[]): AggregatedWeather => {
  const tempValues = items.map((item) => Number(item?.main?.temp) || 0);
  const windValues = items.map((item) => Number(item?.wind?.speed) || 0);
  const rainValues = items.map((item) => Number(item?.rain?.['3h'] ?? item?.rain?.['1h'] ?? 0));

  return {
    temp: Number(average(tempValues).toFixed(2)),
    rainfall: Number((rainValues.reduce((sum, value) => sum + value, 0)).toFixed(2)),
    wind: Number(average(windValues).toFixed(2)),
  };
};

const fetchForecastByCoordinate = async (lat: number, lon: number, apiKey: string) => {
  const forecastRes = await fetch(
    `${OPEN_WEATHER_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`
  );

  if (!forecastRes.ok) {
    throw new Error(`Forecast fetch failed: ${forecastRes.status}`);
  }

  return forecastRes.json();
};

const fetchCurrentWeatherByCoordinate = async (lat: number, lon: number, apiKey: string) => {
  const weatherRes = await fetch(
    `${OPEN_WEATHER_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`
  );

  if (!weatherRes.ok) {
    throw new Error(`Weather fetch failed: ${weatherRes.status}`);
  }

  return weatherRes.json();
};

const fetchHistoryByCoordinate = async (
  lat: number,
  lon: number,
  apiKey: string,
  startUnix: number,
  endUnix: number
) => {
  const historyRes = await fetch(
    `https://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&start=${startUnix}&end=${endUnix}&units=metric&appid=${apiKey}`
  );

  if (!historyRes.ok) {
    throw new Error(`History fetch failed: ${historyRes.status}`);
  }

  return historyRes.json();
};

const aggregateByTimeframe = async (
  lat: number,
  lon: number,
  apiKey: string,
  timeframe: WeatherTimeframe
): Promise<AggregatedWeather> => {
  if (timeframe === '24h') {
    const forecast = await fetchForecastByCoordinate(lat, lon, apiKey);
    const items = Array.isArray(forecast?.list) ? forecast.list.slice(0, 8) : [];
    return aggregateFromForecastItems(items);
  }

  if (timeframe === '7days' || timeframe === '30days') {
    try {
      const nowUnix = Math.floor(Date.now() / 1000);
      const dayCount = timeframe === '7days' ? 7 : 30;
      const startUnix = nowUnix - dayCount * 24 * 60 * 60;

      const historyPayload = await fetchHistoryByCoordinate(lat, lon, apiKey, startUnix, nowUnix);
      const historyItems = Array.isArray(historyPayload?.list) ? historyPayload.list : [];

      if (historyItems.length > 0) {
        return aggregateFromForecastItems(historyItems);
      }
    } catch {
      // Some OpenWeather plans do not allow history endpoint; fallback to forecast below.
    }

    const forecast = await fetchForecastByCoordinate(lat, lon, apiKey);
    const items = Array.isArray(forecast?.list) ? forecast.list : [];
    return aggregateFromForecastItems(items);
  }

  const current = await fetchCurrentWeatherByCoordinate(lat, lon, apiKey);
  return {
    temp: Number(current?.main?.temp ?? 0),
    rainfall: Number(current?.rain?.['1h'] ?? 0),
    wind: Number(current?.wind?.speed ?? 0),
  };
};

export const getWeatherData = async (
  location: string,
  fallbackCoordinate?: Coordinate,
  timeframe: WeatherTimeframe = '24h'
) => {
  try {
    const apiKey = getApiKey();
    const q = encodeURIComponent(location?.trim() || DEFAULT_LOCATION);

    const geocodeRes = await fetch(
      `${OPEN_WEATHER_BASE_URL}/geo/1.0/direct?q=${q}&limit=1&appid=${apiKey}`
    );

    if (!geocodeRes.ok) {
      throw new Error(`Geocoding failed: ${geocodeRes.status}`);
    }

    const geocodeData = await geocodeRes.json();
    const target = Array.isArray(geocodeData) && geocodeData.length > 0 ? geocodeData[0] : null;

    if (!target?.lat || !target?.lon) {
      if (fallbackCoordinate) {
        return aggregateByTimeframe(fallbackCoordinate.lat, fallbackCoordinate.lng, apiKey, timeframe);
      }

      throw new Error('Location not found in OpenWeather geocoding');
    }

    return aggregateByTimeframe(target.lat, target.lon, apiKey, timeframe);
  } catch (error) {
    console.error('Failed to fetch OpenWeather data, fallback to mock:', error);
    return fallbackWeatherData;
  }
};


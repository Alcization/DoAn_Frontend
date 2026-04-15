"use client";

// Định nghĩa interface cho dữ liệu thời tiết truyền vào từ API
export interface WeatherDataPoint {
  weather: string;
  temperatureC: number | null;
}

/**
 * Visualization Strategy Interface (Strategy Pattern)
 */
export interface VisualizationStrategy {
  id: 'traffic' | 'weather';
  getSegmentStatus(idx: number): string;
  getSegmentColor(idx: number): string;
  getSegmentLabel(idx: number): string;
  getSegmentWeather(idx: number): string;
  getSegmentTemperature(idx: number): number | null;
}

/**
 * Concrete Strategy for Traffic Visualization
 */
export class TrafficStrategy implements VisualizationStrategy {
  id = 'traffic' as const;
  private statuses = ['low', 'normal', 'heavy', 'low'];
  private colors = ['green', 'yellow', 'red', 'green'];
  private labels = ['safe', 'warning', 'danger', 'safe'];
  private weathers = ['sunny', 'cloudy', 'rainy', 'clear'];

  getSegmentStatus(idx: number) { return this.statuses[idx % 4]; }
  getSegmentColor(idx: number) { return this.colors[idx % 4]; }
  getSegmentLabel(idx: number) { return `map.visualization.${this.labels[idx % 4]}`; }
  getSegmentWeather(idx: number) { return this.weathers[idx % 4]; }
  getSegmentTemperature(idx: number) { return null; } // Traffic mặc định không hiển thị nhiệt độ
}

/**
 * Concrete Strategy for Weather Visualization
 */
export class WeatherStrategy implements VisualizationStrategy {
  id = 'weather' as const;
  private fallbackWeathers = ['sunny', 'cloudy', 'rainy', 'clear'];
  private weatherData: WeatherDataPoint[];

  constructor(weatherData: WeatherDataPoint[] = []) {
    this.weatherData = weatherData;
  }

  private getWeatherData(idx: number): WeatherDataPoint {
    // Ưu tiên lấy dữ liệu thật từ API, nếu không có thì dùng fallback mock
    return this.weatherData[idx] || { 
      weather: this.fallbackWeathers[idx % 4], 
      temperatureC: null 
    };
  }

  getSegmentStatus(idx: number) { 
    return this.getWeatherData(idx).weather; 
  }
  
  getSegmentColor(idx: number) { 
    const w = this.getWeatherData(idx).weather;
    switch(w) {
      case 'rainy': return 'blue';
      case 'cloudy': return 'gray';
      case 'sunny':
      case 'clear':
      default: return 'green';
    }
  }

  getSegmentLabel(idx: number) { 
    return `map.weather.${this.getWeatherData(idx).weather}`; 
  }
  
  getSegmentWeather(idx: number) { 
    return this.getWeatherData(idx).weather; 
  }

  getSegmentTemperature(idx: number) { 
    return this.getWeatherData(idx).temperatureC; 
  }
}

/**
 * Visualization Context (Template Method for processing)
 */
export class VisualizationProcessor {
  static processRoute(coords: any[], strategy: VisualizationStrategy) {
    if (coords.length < 10) return null;

    const partLen = Math.floor(coords.length / 4);
    const features: any[] = [];
    const segments: any[] = [];

    for (let i = 0; i < 4; i++) {
      const start = i * partLen;
      const end = i === 3 ? coords.length : (i + 1) * partLen + 1;
      const segmentCoords = coords.slice(start, end);

      if (segmentCoords.length > 1) {
        const weather = strategy.getSegmentWeather(i);
        const temperatureC = strategy.getSegmentTemperature(i);
        
        // 1. LineString feature for the path
        features.push({
          type: "Feature",
          properties: {
            status: strategy.getSegmentStatus(i),
            label: strategy.getSegmentLabel(i),
            weather: weather,
            temperatureC: temperatureC,
            mode: strategy.id
          },
          geometry: { type: "LineString", coordinates: segmentCoords }
        });

        // 2. Point feature for markers (required by VietMap for icons)
        const midIdx = Math.floor(segmentCoords.length / 2);
        features.push({
          type: "Feature",
          properties: { 
            weather: weather,
            temperatureC: temperatureC
          },
          geometry: { type: "Point", coordinates: segmentCoords[midIdx] }
        });

        segments.push({
          status: strategy.getSegmentStatus(i),
          color: strategy.getSegmentColor(i),
          label: strategy.getSegmentLabel(i),
          weather: weather
        });
      }
    }

    return {
      geoJson: { type: "FeatureCollection", features },
      segments
    };
  }
}
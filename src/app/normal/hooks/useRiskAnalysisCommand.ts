import { useState, useCallback } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RiskData {
  from: string;
  to: string;
  time: string;
  fromCoords?: Coordinates;
  toCoords?: Coordinates;
  riskLevel: "low" | "medium" | "high" | null;
  details: {
    temp: number;
    weatherCondition: string;
    weatherIcon: string;
    recommendations: string[];
    suggestedDepartureTime?: string;
  } | null;
}

export const useRiskAnalysisCommand = () => {
  const [riskData, setRiskData] = useState<RiskData>({
    from: "",
    to: "",
    time: "",
    riskLevel: null,
    details: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    if (!riskData.fromCoords || !riskData.time) {
      console.warn("Bị chặn vì thiếu dữ liệu:", { fromCoords: riskData.fromCoords, time: riskData.time });
      alert("Hệ thống chưa nhận được tọa độ điểm xuất phát. Vui lòng chọn lại từ danh sách gợi ý.");
      return;
    }

    setIsLoading(true);
    
    try {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!API_KEY) throw new Error("Missing OpenWeather API Key");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${riskData.fromCoords.lat}&lon=${riskData.fromCoords.lng}&units=metric&lang=vi&appid=${API_KEY}`
      );
      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.message || "Lỗi khi gọi OpenWeather API");
      }

      const now = new Date();
      const [hours, minutes] = riskData.time.split(':').map(Number);
      let targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      if (hours < now.getHours()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      const targetTimestamp = targetDate.getTime() / 1000;

      const forecastList = data.list;
      let closestIndex = 0;
      let minDiff = Math.abs(forecastList[0].dt - targetTimestamp);

      forecastList.forEach((forecast: any, index: number) => {
        const diff = Math.abs(forecast.dt - targetTimestamp);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      const targetForecast = forecastList[closestIndex];
      const weatherId = targetForecast.weather[0].id;
      
      const isRaining = weatherId >= 200 && weatherId < 600;
      let riskLevel: "low" | "medium" | "high" = "low";
      const recommendations: string[] = [];
      let suggestedDepartureTime: string | undefined;

      if (isRaining) {
        riskLevel = "high";
        recommendations.push(`Cảnh báo: Có ${targetForecast.weather[0].description} vào lúc ${riskData.time}.`);
        recommendations.push("Đường đi trơn trượt và tầm nhìn bị hạn chế. KHÔNG NÊN xuất phát lúc này.");
        const nextClearForecast = forecastList.slice(closestIndex + 1).find(
          (f: any) => f.weather[0].id >= 800
        );

        if (nextClearForecast) {
          const clearDate = new Date(nextClearForecast.dt * 1000);
          const isTomorrow = clearDate.getDate() !== now.getDate();
          suggestedDepartureTime = `${clearDate.getHours().toString().padStart(2, '0')}:${clearDate.getMinutes().toString().padStart(2, '0')} ${isTomorrow ? '(Ngày mai)' : ''}`;
          recommendations.push(`💡 Lời khuyên: Bạn nên chờ đến khoảng ${suggestedDepartureTime} thời tiết sẽ tốt hơn (${nextClearForecast.weather[0].description}).`);
        } else {
          recommendations.push("💡 Lời khuyên: Thời tiết xấu kéo dài trong nhiều giờ tới. Cân nhắc dời lịch trình.");
        }
      } else {
        riskLevel = "low";
        recommendations.push(`Thời tiết lúc ${riskData.time} khá thuận lợi (${targetForecast.weather[0].description}).`);
        recommendations.push("Bạn có thể yên tâm xuất phát theo đúng kế hoạch.");
      }

      setRiskData((prev) => ({
        ...prev,
        riskLevel,
        details: {
          temp: Math.round(targetForecast.main.temp),
          weatherCondition: targetForecast.weather[0].description,
          weatherIcon: targetForecast.weather[0].icon,
          recommendations,
          suggestedDepartureTime,
        },
      }));
    } catch (error: any) {
      console.error("Lỗi phân tích rủi ro:", error);
      alert(`Đã xảy ra lỗi: ${error.message}`);
      
      setRiskData((prev) => ({ 
        ...prev, 
        riskLevel: "high", 
        details: {
          temp: 0,
          weatherCondition: "Lỗi dữ liệu",
          weatherIcon: "50d",
          recommendations: ["Không thể kết nối đến máy chủ thời tiết.", "Vui lòng kiểm tra lại kết nối mạng hoặc API Key."],
        } 
      }));
    } finally {
      setIsLoading(false);
    }
  }, [riskData.fromCoords, riskData.time]);

  const updateField = useCallback((field: keyof RiskData, value: any) => {
    setRiskData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetResults = useCallback(() => {
    setRiskData((prev) => ({ ...prev, riskLevel: null, details: null }));
  }, []);

  return { riskData, isLoading, execute, updateField, resetResults };
};
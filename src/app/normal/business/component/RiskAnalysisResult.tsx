"use client";

import { useTranslation } from "react-i18next";
import { Thermometer, CloudRain, CheckCircle2 } from "lucide-react";
import { RiskData } from "@/app/normal/hooks/useRiskAnalysisCommand";

interface RiskAnalysisResultProps {
  riskData: RiskData;
}

export const RiskAnalysisResult = ({ riskData }: RiskAnalysisResultProps) => {
  const { t } = useTranslation();

  if (!riskData?.riskLevel || !riskData?.details) return null;

  const isHighRisk = riskData.riskLevel === "high";

  return (
    <div className={`mt-6 p-4 sm:p-6 rounded-2xl border-2 bg-(--color-bg) ${
      isHighRisk ? "border-red-400" : "border-green-400"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="m-0 text-(--text-lg) font-semibold text-(--color-text-primary)">
          Kết quả đánh giá rủi ro thời tiết
        </h3>
        <span
          className={`px-4 py-2 rounded-xl font-semibold text-(--text-sm) flex items-center gap-2 ${
            isHighRisk ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {isHighRisk ? <CloudRain size={16} /> : <CheckCircle2 size={16} />}
          {isHighRisk ? "Thời tiết xấu" : "Thời tiết tốt"}
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col items-center justify-center p-4 sm:w-40 bg-(--color-surface) rounded-xl shadow-sm border border-(--color-border) h-fit shrink-0">
          <img 
            src={`https://openweathermap.org/img/wn/${riskData.details.weatherIcon}@2x.png`} 
            alt="Weather Icon" 
            className="w-16 h-16 drop-shadow-md"
          />
          <div className="flex items-center gap-1 text-(--text-base) font-bold text-(--color-text-primary) mt-1">
            <Thermometer size={18} className="text-blue-600" />
            <span>{riskData.details.temp}°C</span>
          </div>
          <p className="text-(--text-xs) text-(--color-text-secondary) capitalize mt-1 text-center">
            {riskData.details.weatherCondition}
          </p>
        </div>
        
        {riskData.details.recommendations.length > 0 && (
          <div className={`flex-1 p-4 bg-(--color-surface) rounded-xl border ${
            isHighRisk ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
          }`}>
            <h4 className={`text-(--text-sm) font-semibold mb-3 ${
              isHighRisk ? "text-red-800" : "text-green-800"
            }`}>
              Phân tích & Lời khuyên lộ trình:
            </h4>
            <ul className="space-y-3 pl-0 list-none m-0">
              {riskData.details.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-2 text-(--text-sm) ${
                    rec.includes("💡") || rec.includes("KHÔNG NÊN") 
                      ? "font-semibold text-gray-900" 
                      : "text-gray-700"
                  }`}
                >
                  <span className={`mt-0.5 ${isHighRisk ? "text-red-500" : "text-green-500"}`}>
                    {rec.includes("💡") ? "👉" : "•"}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
"use client";

import { useTranslation } from "react-i18next";
import { Activity, MapPin, Navigation } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useVietmapFacade, LocationModel } from "@/app/normal/hooks/useVietmapFacade";

import { useRiskAnalysisCommand } from "@/app/normal/hooks/useRiskAnalysisCommand";

// Sub-components
import { RiskAssessmentHeader } from "./RiskAssessmentHeader";
import { RiskLocationInput } from "./RiskLocationInput";
import { RiskTimeSelect } from "./RiskTimeSelect";
import { RiskAnalysisResult } from "./RiskAnalysisResult";

export default function RiskAssessment() {
  const { t } = useTranslation();
  const { searchLocations, isSearching } = useVietmapFacade();
  
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const {
    riskData,
    isLoading,
    execute: handleRiskAssessment,
    updateField,
  } = useRiskAnalysisCommand();

  const [originResults, setOriginResults] = useState<LocationModel[]>([]);
  const [destinationResults, setDestinationResults] = useState<LocationModel[]>([]);
  const [showOriginResults, setShowOriginResults] = useState(false);
  const [showDestinationResults, setShowDestinationResults] = useState(false);
  
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginResults(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestinationResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (text: string, type: 'from' | 'to') => {
    updateField(type, text);
    if (text.length < 2) {
      if (type === 'from') setOriginResults([]);
      else setDestinationResults([]);
      return;
    }

    const results = await searchLocations(text);
    if (type === 'from') {
      setOriginResults(results);
      setShowOriginResults(true);
    } else {
      setDestinationResults(results);
      setShowDestinationResults(true);
    }
  };

  const handleSelect = async (location: LocationModel, type: 'from' | 'to') => {
    updateField(type, location.display || location.name || location.address || "");
    
    if (type === 'from') setShowOriginResults(false);
    else setShowDestinationResults(false);

    if (location.lat && location.lng) {
      updateField(`${type}Coords` as any, { lat: location.lat, lng: location.lng });
    } else if (location.ref_id) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_VIETMAP_API_KEY; 
        const response = await fetch(`https://maps.vietmap.vn/api/place/v3?apikey=${apiKey}&refid=${location.ref_id}`);
        const data = await response.json();

        if (data && data.lat && data.lng) {
          updateField(`${type}Coords` as any, { lat: data.lat, lng: data.lng });
        } else {
          alert(`Không thể lấy tọa độ chi tiết cho ${location.name}`);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API chi tiết Vietmap:", error);
      }
    } else {
      console.warn("Địa điểm này không có ref_id để lấy tọa độ.");
    }
  };

  return (
    <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border)">
      <RiskAssessmentHeader 
        showRiskAssessment={showRiskAssessment} 
        setShowRiskAssessment={setShowRiskAssessment} 
      />

      {showRiskAssessment && (
        <div className="space-y-4 mt-4 pt-4 border-t border-(--color-border)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RiskLocationInput
              id="origin"
              label={t("businessReports.risk.from")}
              icon={MapPin}
              value={riskData?.from || ""}
              placeholder={t("businessReports.risk.from")}
              isSearching={isSearching}
              showResults={showOriginResults}
              results={originResults}
              onSearch={(val) => handleSearch(val, 'from')}
              onFocus={() => riskData?.from && setShowOriginResults(true)}
              onSelect={(loc) => handleSelect(loc, 'from')}
              containerRef={originRef}
            />

            <RiskLocationInput
              id="destination"
              label={t("businessReports.risk.to")}
              icon={Navigation}
              value={riskData?.to || ""}
              placeholder={t("businessReports.risk.to")}
              isSearching={isSearching}
              showResults={showDestinationResults}
              results={destinationResults}
              onSearch={(val) => handleSearch(val, 'to')}
              onFocus={() => riskData?.to && setShowDestinationResults(true)}
              onSelect={(loc) => handleSelect(loc, 'to')}
              containerRef={destRef}
            />
            
            <RiskTimeSelect 
              time={riskData?.time || ""} 
              updateField={updateField} 
            />
          </div>

          <button
            onClick={handleRiskAssessment}
            disabled={isLoading || !riskData?.from || !riskData?.to || !riskData?.time}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none bg-linear-to-r from-(--color-primary-strong) to-(--color-primary) text-white font-semibold cursor-pointer shadow-lg shadow-(--color-primary)/25 hover:shadow-xl hover:shadow-(--color-primary)/30 transition-all text-(--text-sm) sm:text-(--text-base) disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("businessReports.buttons.analyzing")}
              </>
            ) : (
              <>
                <Activity size={18} /> {t("businessReports.buttons.analyze")}
              </>
            )}
          </button>

          {riskData?.riskLevel && riskData?.details && (
            <RiskAnalysisResult riskData={riskData} />
          )}
        </div>
      )}
    </div>
  );
}

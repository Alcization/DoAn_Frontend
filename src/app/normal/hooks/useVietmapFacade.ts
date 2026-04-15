"use client";

import { useState, useCallback } from "react";

/**
 * Location Model (Adapter Pattern)
 * Standardizes location data from different Vietmap APIs
 */
export interface LocationModel {
  lat: number;
  lng: number;
  address: string;
  name?: string;
  display?: string;
  ref_id?: string;
}

/**
 * useVietmapFacade (Facade Pattern)
 * Simplifies complex interactions with the Vietmap API suite.
 */
export function useVietmapFacade() {
  const [isSearching, setIsSearching] = useState(false);
  const [isReversing, setIsReversing] = useState(false);

  /**
   * Search for locations (Autocomplete)
   */
  const searchLocations = useCallback(async (text: string): Promise<LocationModel[]> => {
    if (!text || text.length < 2) return [];
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/vietmap-autocomplete?text=${encodeURIComponent(text)}&display_type=5`);
      if (res.ok) {
        const data = await res.json();
        // Adapt results to LocationModel
        return (data || []).map((item: any) => ({
          lat: item.lat,
          lng: item.lng,
          address: item.address,
          name: item.name,
          display: item.display,
          ref_id: item.ref_id
        }));
      }
    } catch (err) {
      console.error("Vietmap Facade Search Error:", err);
    } finally {
      setIsSearching(false);
    }
    return [];
  }, []);

  /**
   * Get full details for a location (Place API)
   */
  const getPlaceDetail = useCallback(async (refId: string): Promise<LocationModel | null> => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/vietmap-place?refid=${refId}`);
      if (res.ok) {
        const detail = await res.json();
        return {
          lat: detail.lat,
          lng: detail.lng,
          address: detail.display || detail.address || "",
          name: detail.name,
          display: detail.display,
          ref_id: refId
        };
      }
    } catch (err) {
      console.error("Vietmap Facade Detail Error:", err);
    } finally {
      setIsSearching(false);
    }
    return null;
  }, []);

  /**
   * Reverse geocode coordinates to address
   */
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    setIsReversing(true);
    try {
      const res = await fetch(`/api/vietmap-reverse?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        return data.address || data.display || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }
    } catch (err) {
      console.error("Vietmap Facade Reverse Error:", err);
    } finally {
      setIsReversing(false);
    }
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }, []);

  return {
    searchLocations,
    getPlaceDetail,
    reverseGeocode,
    isSearching,
    isReversing
  };
}

"use client";

import { useCallback } from "react";
import { useVietmapFacade, LocationModel } from "./useVietmapFacade";

/**
 * Location Command Interface (Command Pattern)
 * Defines a shared interface for any action that affects location state.
 */
export interface LocationCommand {
  execute(): Promise<void>;
}

/**
 * useLocationCommands (Command Pattern)
 * Provides a suite of commands for interacting with location state.
 */
export function useLocationCommands(
  setLocation: (type: 'personal' | 'origin' | 'destination', loc: LocationModel | null) => void,
  reverseGeocode: (lat: number, lng: number) => Promise<string>
) {
  
  /**
   * Command to get current user location and set it to a target field
   */
  const setCurrentLocation = useCallback(async (type: 'personal' | 'origin' | 'destination') => {
    if (!navigator.geolocation) return;
    
    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          
          setLocation(type, {
            lat: latitude,
            lng: longitude,
            address: address || "Current Location"
          });
          resolve();
        },
        (err) => reject(err)
      );
    });
  }, [setLocation, reverseGeocode]);

  /**
   * Command to clear a location field
   */
  const clearLocation = useCallback((type: 'personal' | 'origin' | 'destination') => {
    setLocation(type, null);
  }, [setLocation]);

  return {
    setCurrentLocation,
    clearLocation
  };
}

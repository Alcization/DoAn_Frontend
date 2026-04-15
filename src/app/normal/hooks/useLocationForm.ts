import { useState, useEffect, useCallback } from "react";
import { LocationSelectorData } from "../shared_component/LocationSelector";

type LocationFormProps = {
  mode: "personal" | "business";
  initialName?: string;
  initialData?: LocationSelectorData;
  isOpen: boolean;
};

export const useLocationForm = ({ mode, initialName = "", initialData = {}, isOpen }: LocationFormProps) => {
  const [name, setName] = useState(initialName);
  const [selectorData, setSelectorData] = useState<LocationSelectorData>(initialData);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setSelectorData(initialData);
    } else {
      setName("");
      setSelectorData({
        personal: null,
        origin: null,
        destination: null,
        routeData: null
      });
    }
  }, [isOpen, initialName, initialData]);

  const isValid = useCallback(() => {
    if (!name.trim()) return false;
    if (mode === "personal") {
      return !!selectorData.personal;
    }
    return !!(selectorData.origin && selectorData.destination);
  }, [name, mode, selectorData]);

  const getFormData = useCallback(() => {
    if (mode === "personal" && selectorData.personal) {
      return {
        name,
        address: selectorData.personal.address,
        lat: selectorData.personal.lat,
        lng: selectorData.personal.lng
      };
    } else if (mode === "business" && selectorData.origin && selectorData.destination) {
      return {
        name,
        address: selectorData.origin.address,
        lat: selectorData.origin.lat,
        lng: selectorData.origin.lng,
        destination: selectorData.destination,
        distance: selectorData.routeData?.distance || 0 // Thêm khoảng cách
      };
    }
    return null;
  }, [name, mode, selectorData]);

  return {
    name,
    setName,
    selectorData,
    setSelectorData,
    isValid: isValid(),
    getFormData
  };
};
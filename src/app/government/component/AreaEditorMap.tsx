"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const VietMapAreaEditor = dynamic(() => import("./VietMapAreaEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-(--color-bg-secondary)/30 animate-pulse">
        <p className="text-sm font-medium text-(--color-text-secondary) italic">
            Connecting to VietMap...
        </p>
    </div>
  ),
});

interface AreaEditorMapProps {
  center: [number, number] | null;
  radius: number;
  onChange: (center: [number, number] | null, radius: number) => void;
  mapCenter?: [number, number];
  zoom?: number;
}

export default function AreaEditorMap(props: AreaEditorMapProps) {
  return (
    <div className="h-full w-full min-h-[400px]">
      <VietMapAreaEditor {...props} />
    </div>
  );
}

"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Focus, Cloud, Activity } from 'lucide-react';

interface MapFullControlsProps {
  onGoToCurrent?: () => void;
  onZoomToBounds?: () => void;
  vizMode?: 'traffic' | 'weather';
  setVizMode?: (mode: 'traffic' | 'weather') => void;
}

export default function MapFullControls({ 
  onGoToCurrent, 
  onZoomToBounds,
  vizMode,
  setVizMode 
}: MapFullControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
      {/* Search/Location Controls */}
      {(onGoToCurrent || onZoomToBounds) && (
        <div className="flex flex-col gap-2">
          {onGoToCurrent && (
            <button 
              onClick={onGoToCurrent}
              className="p-3 bg-(--color-surface) rounded-2xl shadow-(--shadow-md) border border-(--color-border) text-(--color-text-secondary) hover:text-(--color-primary) transition-colors active:scale-95"
              title={t('mapFull.actions.currentLocation')}
            >
              <Target size={22} />
            </button>
          )}
          {onZoomToBounds && (
            <button 
              onClick={onZoomToBounds}
              className="p-3 bg-(--color-surface) rounded-2xl shadow-(--shadow-md) border border-(--color-border) text-(--color-text-secondary) hover:text-(--color-primary) transition-colors active:scale-95"
              title={t('mapFull.actions.focusRoute')}
            >
              <Focus size={22} />
            </button>
          )}
        </div>
      )}

      {((onGoToCurrent || onZoomToBounds) && setVizMode) && <div className="w-full h-px bg-(--color-border) my-1" />}

      {/* Logic Toggles */}
      {setVizMode && (
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setVizMode?.('traffic')}
            className={`p-3 rounded-2xl shadow-(--shadow-md) border transition-all active:scale-95 ${
              vizMode === 'traffic' 
                ? 'bg-(--color-primary) text-white border-transparent' 
                : 'bg-(--color-surface) text-(--color-text-secondary) border-(--color-border) hover:text-(--color-primary)'
            }`}
            title="Traffic Status"
          >
            <Activity size={22} />
          </button>
          <button 
            onClick={() => setVizMode?.('weather')}
            className={`p-3 rounded-2xl shadow-(--shadow-md) border transition-all active:scale-95 ${
              vizMode === 'weather' 
                ? 'bg-(--color-primary) text-white border-transparent' 
                : 'bg-(--color-surface) text-(--color-text-secondary) border-(--color-border) hover:text-(--color-primary)'
            }`}
            title="Weather Status"
          >
            <Cloud size={22} />
          </button>
        </div>
      )}
    </div>
  );
}

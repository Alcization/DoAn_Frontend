"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';

interface MapFullBottomPanelProps {
  time: string;
  distance: string;
}

export default function MapFullBottomPanel({ time, distance }: MapFullBottomPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-10 left-10 right-10 lg:left-1/2 lg:-translate-x-1/2 lg:w-[600px] z-10 transition-all">
       <div className="bg-(--color-surface)/80 backdrop-blur-xl rounded-[32px] p-6 shadow-(--shadow-md) border border-white/20 dark:border-white/5 flex items-center justify-between">
          <div className="flex gap-6">
             <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-(--color-text-muted) block mb-1">
                  {t('mapFull.summary.time')}
                </span>
                <span className="text-2xl font-black text-(--color-primary) block">
                  {time}
                </span>
             </div>
             <div className="w-px h-10 bg-(--color-border) self-center" />
             <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-(--color-text-muted) block mb-1">
                  {t('mapFull.summary.distance')}
                </span>
                <span className="text-2xl font-black text-(--color-text-primary) block">
                  {distance}
                </span>
             </div>
          </div>
          <button className="px-8 py-4 bg-(--color-primary) text-white rounded-2xl font-bold shadow-(--shadow-md) hover:brightness-110 transition-all hover:scale-105 active:scale-95">
             {t('mapFull.actions.details')}
          </button>
       </div>
    </div>
  );
}

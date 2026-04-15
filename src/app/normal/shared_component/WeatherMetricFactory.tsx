"use client";

import React from "react";
import { WeatherMetric } from "../hooks/useWeatherAdapter";

/**
 * WeatherMetricFactory (Factory Method Pattern)
 * Creates consistent UI cards for different weather metrics.
 */
export const WeatherMetricFactory = {
  /**
   * Factory method to create a metric card
   */
  createMetricCard: (metric: WeatherMetric, key: string) => {
    return (
      <div 
        key={key} 
        className="bg-(--color-surface) rounded-2xl p-3 text-center border border-(--color-border) hover:shadow-md transition-all cursor-default group/metric"
      >
        <div className="flex justify-center mb-1.5 group-hover/metric:scale-110 transition-transform">
          <metric.icon size={20} className="text-(--color-primary)" />
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-(--color-text-muted) mb-1">
          {metric.label}
        </div>
        <div className="font-black text-sm text-(--color-text-primary)">
          {metric.value}
        </div>
      </div>
    );
  },

  /**
   * Factory method specific to CurrentWeatherDetail's layout
   */
  createDetailMetric: (metric: WeatherMetric, key: string) => {
    return (
      <div key={key}>
        <p className="text-(--text-xs) sm:text-(--text-sm) text-(--color-text-muted) mb-1 font-bold uppercase tracking-wider">
          {metric.label}
        </p>
        <p className="text-(--text-lg) sm:text-(--text-xl) font-black text-(--color-text-primary)">
          {metric.value}
        </p>
      </div>
    );
  }
};

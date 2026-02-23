'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/lib/types';
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow } from 'lucide-react';

interface WeatherWidgetProps {
  weather?: WeatherData;
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(weather || null);
  const [loading, setLoading] = useState(!weather);

  useEffect(() => {
    if (!weather) {
      fetch('/api/weather')
        .then(res => res.json())
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [weather]);

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('rain') || conditionLower.includes('pioggia')) return <CloudRain className="w-10 h-10 text-[#3b82f6]" />;
    if (conditionLower.includes('snow') || conditionLower.includes('neve')) return <CloudSnow className="w-10 h-10 text-[#60a5fa]" />;
    if (conditionLower.includes('cloud') || conditionLower.includes('nuvol')) return <Cloud className="w-10 h-10 text-[#9ca3af]" />;
    return <Sun className="w-10 h-10 text-[#f59e0b]" />;
  };

  const getWeatherGradient = (temp: number) => {
    if (temp >= 25) return 'weather-warm';
    if (temp <= 10) return 'weather-cool';
    return 'weather-mild';
  };

  if (loading) {
    return (
      <div className="glass-card p-5 shimmer">
        <div className="h-32 flex items-center justify-center">
          <span className="text-[#9ca3af]">Caricamento meteo...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`glass-card p-5 ${getWeatherGradient(data.temp)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#f59e0b]" />
          <span className="text-sm font-medium text-[#9ca3af]">Meteo Verona</span>
        </div>
        <span className="text-xs text-[#6b7280]">Oggi</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-[#1a1a1a]">
          {getWeatherIcon(data.condition)}
        </div>
        <div>
          <div className="text-4xl font-bold text-[#ebebeb]">
            {data.temp}<span className="text-2xl text-[#9ca3af]">°C</span>
          </div>
          <div className="text-sm text-[#9ca3af] capitalize">{data.condition}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex gap-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#3b82f6]" />
          <span className="text-sm text-[#9ca3af]">{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-[#6b7280]" />
          <span className="text-sm text-[#9ca3af]">{data.wind} km/h</span>
        </div>
      </div>
    </div>
  );
}

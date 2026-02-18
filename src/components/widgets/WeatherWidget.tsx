'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/lib/types';

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

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="animate-pulse">Caricamento meteo...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          🌤️ Meteo Verona
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{data.icon}</div>
          <div>
            <div className="text-4xl font-bold">{data.temp}°C</div>
            <div className="text-muted-foreground">{data.condition}</div>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span>💧 {data.humidity}%</span>
          <span>💨 {data.wind} km/h</span>
        </div>
      </CardContent>
    </Card>
  );
}

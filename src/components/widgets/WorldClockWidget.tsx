'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Clock {
  city: string;
  timezone: string;
  emoji: string;
}

const clocks: Clock[] = [
  { city: 'Verona', timezone: 'Europe/Rome', emoji: '🇮🇹' },
  { city: 'Londra', timezone: 'Europe/London', emoji: '🇬🇧' },
  { city: 'New York', timezone: 'America/New_York', emoji: '🇺🇸' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', emoji: '🇯🇵' },
];

export function WorldClockWidget() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      clocks.forEach((clock) => {
        newTimes[clock.city] = new Date().toLocaleTimeString('it-IT', {
          timeZone: clock.timezone,
          hour: '2-digit',
          minute: '2-digit',
        });
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          🌍 World Clock
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {clocks.map((clock) => (
            <div
              key={clock.city}
              className="text-center p-3 rounded-lg bg-secondary/50"
            >
              <div className="text-2xl mb-1">{clock.emoji}</div>
              <div className="text-lg font-bold">{times[clock.city] || '--:--'}</div>
              <div className="text-xs text-muted-foreground">{clock.city}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

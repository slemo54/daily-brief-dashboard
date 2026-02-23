'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

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
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#3b82f6]/10">
            <Globe className="w-4 h-4 text-[#3b82f6]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">World Clock</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {clocks.map((clock) => (
          <div
            key={clock.city}
            className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] transition-all duration-300 group border border-[#2a2a2a] hover:border-[#3a3a3a]"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{clock.emoji}</div>
            <div className="text-lg font-bold text-[#ebebeb]">{times[clock.city] || '--:--'}</div>
            <div className="text-xs text-[#6b7280]">{clock.city}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { Timer, Calendar } from 'lucide-react';

interface Event {
  name: string;
  date: string;
  emoji: string;
  accent: string;
}

const events: Event[] = [
  { 
    name: 'Vinitaly', 
    date: '2026-04-12', 
    emoji: '🍷', 
    accent: '#8b5cf6'
  },
  { 
    name: 'Estate', 
    date: '2026-06-21', 
    emoji: '☀️', 
    accent: '#f59e0b'
  },
];

export function CountdownWidget() {
  const [daysLeft, setDaysLeft] = useState<Record<string, number>>({});

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const newDaysLeft: Record<string, number> = {};
      
      events.forEach((event) => {
        const eventDate = parseISO(event.date);
        const days = differenceInDays(eventDate, now);
        newDaysLeft[event.name] = days > 0 ? days : 0;
      });
      
      setDaysLeft(newDaysLeft);
    };

    calculateDays();
  }, []);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#ff6b4a]/10">
            <Timer className="w-4 h-4 text-[#ff6b4a]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Countdown</span>
        </div>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.name}
            className="p-4 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all"
            style={{ borderLeftColor: event.accent, borderLeftWidth: '3px' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{event.emoji}</span>
                <div>
                  <div className="font-semibold text-[#ebebeb]">{event.name}</div>
                  <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.date).toLocaleDateString('it-IT')}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: event.accent }}>
                  {daysLeft[event.name] || 0}
                </div>
                <div className="text-xs text-[#6b7280]">giorni</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInDays, parseISO } from 'date-fns';

interface Event {
  name: string;
  date: string;
  emoji: string;
  color: string;
}

const events: Event[] = [
  { name: 'Vinitaly', date: '2026-04-12', emoji: '🍷', color: 'from-purple-500/20 to-pink-500/20' },
  { name: 'Estate', date: '2026-06-21', emoji: '☀️', color: 'from-yellow-500/20 to-orange-500/20' },
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          ⏰ Countdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.name}
              className={`p-4 rounded-lg bg-gradient-to-r ${event.color} border border-white/10`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{event.emoji}</span>
                  <div>
                    <div className="font-semibold">{event.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{daysLeft[event.name] || 0}</div>
                  <div className="text-xs text-muted-foreground">giorni</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const POMODORO_MINUTES = 25;
const SHORT_BREAK = 5;
const LONG_BREAK = 15;

export function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setCycles((c) => c + 1);
        const newMode = (cycles + 1) % 4 === 0 ? 'long' : 'short';
        setMode(newMode);
        setTimeLeft(newMode === 'long' ? LONG_BREAK * 60 : SHORT_BREAK * 60);
      } else {
        setMode('work');
        setTimeLeft(POMODORO_MINUTES * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, cycles]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(POMODORO_MINUTES * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((mode === 'work' ? POMODORO_MINUTES * 60 : mode === 'short' ? SHORT_BREAK * 60 : LONG_BREAK * 60) - timeLeft) / 
    (mode === 'work' ? POMODORO_MINUTES * 60 : mode === 'short' ? SHORT_BREAK * 60 : LONG_BREAK * 60) * 100;

  const modeColors = {
    work: 'from-red-500/20 to-orange-500/20 border-red-500/30',
    short: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    long: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  };

  return (
    <Card className={`bg-gradient-to-br ${modeColors[mode]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
          <span>🍅 Pomodoro</span>
          <span className="text-xs">Cicli: {cycles}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{formatTime(timeLeft)}</div>
          <div className="text-sm text-muted-foreground mb-4 capitalize">
            {mode === 'work' ? 'Focus' : mode === 'short' ? 'Pausa breve' : 'Pausa lunga'}
          </div>
          
          <div className="w-full bg-secondary h-2 rounded-full mb-4">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-center gap-2">
            <Button size="sm" onClick={toggleTimer}>
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={resetTimer}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

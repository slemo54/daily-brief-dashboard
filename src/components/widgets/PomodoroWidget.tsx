'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const getTotalTime = () => {
    if (mode === 'work') return POMODORO_MINUTES * 60;
    if (mode === 'short') return SHORT_BREAK * 60;
    return LONG_BREAK * 60;
  };

  const progress = ((getTotalTime() - timeLeft) / getTotalTime()) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const modeConfig = {
    work: { label: 'Focus', color: '#ff6b4a', bgColor: 'rgba(255, 107, 74, 0.1)' },
    short: { label: 'Pausa Breve', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    long: { label: 'Pausa Lunga', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  };

  const currentMode = modeConfig[mode];

  return (
    <div className="glass-card p-5" style={{ backgroundColor: currentMode.bgColor }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍅</span>
          <span className="text-sm font-medium text-[#9ca3af]">Pomodoro</span>
        </div>
        <span className="text-xs text-[#6b7280]">Cicli: {cycles}</span>
      </div>

      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={currentMode.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-[#ebebeb]">{formatTime(timeLeft)}</div>
            <div className="text-xs text-[#6b7280]" style={{ color: currentMode.color }}>
              {currentMode.label}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center"
          >
            {isActive ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="btn-glass w-12 h-12 rounded-xl flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 text-[#9ca3af]" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Volume2,
  VolumeX,
  Clock,
  TrendingUp,
  Target,
  CloudRain,
  Wind,
  Waves,
  Music
} from 'lucide-react';
import Link from 'next/link';

const POMODORO_MINUTES = 25;
const SHORT_BREAK = 5;
const LONG_BREAK = 15;

type SoundType = 'none' | 'rain' | 'whitenoise' | 'waves';

interface FocusStats {
  totalHours: number;
  totalSessions: number;
  todaySessions: number;
  streak: number;
}

const soundConfig: Record<SoundType, { icon: typeof CloudRain, label: string, color: string }> = {
  none: { icon: VolumeX, label: 'Silenzio', color: '#6b7280' },
  rain: { icon: CloudRain, label: 'Pioggia', color: '#60a5fa' },
  whitenoise: { icon: Wind, label: 'White Noise', color: '#a78bfa' },
  waves: { icon: Waves, label: 'Oceano', color: '#22d3ee' },
};

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [cycles, setCycles] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sound, setSound] = useState<SoundType>('none');
  const [stats, setStats] = useState<FocusStats>({
    totalHours: 47.5,
    totalSessions: 114,
    todaySessions: 3,
    streak: 7,
  });

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
        setStats(prev => ({
          ...prev,
          totalSessions: prev.totalSessions + 1,
          todaySessions: prev.todaySessions + 1,
          totalHours: prev.totalHours + (POMODORO_MINUTES / 60),
        }));
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
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
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const modeConfig = {
    work: { 
      label: 'Focus Time', 
      subtitle: 'Concentrati sul tuo task',
      gradient: 'from-fuchsia-500 via-purple-500 to-cyan-500',
      bgGradient: 'from-fuchsia-500/20 via-purple-500/10 to-cyan-500/20'
    },
    short: { 
      label: 'Short Break', 
      subtitle: 'Prendi una pausa breve',
      gradient: 'from-cyan-500 via-blue-500 to-teal-500',
      bgGradient: 'from-cyan-500/20 via-blue-500/10 to-teal-500/20'
    },
    long: { 
      label: 'Long Break', 
      subtitle: 'Rilassati più a lungo',
      gradient: 'from-violet-500 via-purple-500 to-pink-500',
      bgGradient: 'from-violet-500/20 via-purple-500/10 to-pink-500/20'
    },
  };

  const currentMode = modeConfig[mode];

  return (
    <div className={`min-h-screen relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentMode.bgGradient} transition-all duration-1000`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Clock className="w-6 h-6 text-fuchsia-400" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Focus Mode
              </h1>
              <p className="text-sm text-white/50 mt-1">
                Sessioni oggi: {stats.todaySessions}
              </p>
            </div>
          </div>
          <button
            onClick={toggleFullscreen}
            className="btn-glass w-10 h-10 rounded-xl flex items-center justify-center"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-white/70" /> : <Maximize2 className="w-5 h-5 text-white/70" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Timer Section */}
          <div className="text-center mb-12">
            {/* Mode Label */}
            <div className="mb-8">
              <h2 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${currentMode.gradient} bg-clip-text text-transparent transition-all duration-500`}>
                {currentMode.label}
              </h2>
              <p className="text-white/50 mt-2">{currentMode.subtitle}</p>
            </div>

            {/* Circular Timer */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto mb-8">
              {/* Outer Glow */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentMode.gradient} opacity-20 blur-3xl animate-pulse`} />
              
              <svg className="w-full h-full transform -rotate-90 relative" viewBox="0 0 300 300">
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e91e63" />
                    <stop offset="50%" stopColor="#9c27b0" />
                    <stop offset="100%" stopColor="#00bcd4" />
                  </linearGradient>
                </defs>
                
                {/* Background Circle */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="8"
                />
                
                {/* Progress Circle */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl sm:text-7xl font-bold text-white tracking-tight">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white/40 mt-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Ciclo {cycles + 1}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={resetTimer}
                className="btn-glass w-14 h-14 rounded-2xl flex items-center justify-center"
              >
                <RotateCcw className="w-6 h-6 text-white/70" />
              </button>
              
              <button
                onClick={toggleTimer}
                className="btn-primary-glow w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl shadow-fuchsia-500/30"
              >
                {isActive ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
              
              {/* Sound Selector */}
              <div className="relative group">
                <button className="btn-glass w-14 h-14 rounded-2xl flex items-center justify-center">
                  {sound === 'none' ? <VolumeX className="w-6 h-6 text-white/70" /> : <Volume2 className="w-6 h-6 text-cyan-400" />}
                </button>
                
                {/* Sound Menu */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                  <div className="glass-card p-2 rounded-xl space-y-1">
                    {(Object.keys(soundConfig) as SoundType[]).map((s) => {
                      const Icon = soundConfig[s].icon;
                      return (
                        <button
                          key={s}
                          onClick={() => setSound(s)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                            sound === s ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4" style={{ color: soundConfig[s].color }} />
                          {soundConfig[s].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalHours.toFixed(1)}</div>
              <div className="text-xs text-white/50">Ore Totali</div>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-3">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
              <div className="text-xs text-white/50">Sessioni</div>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.todaySessions}</div>
              <div className="text-xs text-white/50">Oggi</div>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mx-auto mb-3">
                <Music className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.streak}</div>
              <div className="text-xs text-white/50">Giorni streak</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

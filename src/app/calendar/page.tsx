'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Target,
  Utensils,
  CheckSquare,
  Plus,
  Briefcase,
  Car,
  Coffee,
  Sun,
  Moon,
  Dumbbell,
  BookOpen,
  Zap,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Clock3,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'work' | 'commute' | 'meal' | 'lifequest' | 'task' | 'personal' | 'break';
  category?: string;
  description?: string;
  taskId?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'high' | 'medium' | 'low';
}

interface Task {
  id: string;
  text: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  category: 'Work' | 'Personal' | 'Health' | 'Learning';
  dueDate?: string;
}

type ViewType = 'month' | 'week' | 'day';

// ============================================
// CONSTANTS
// ============================================
const CALENDAR_TASKS_KEY = 'anselmo-calendar-tasks';
const TASKS_STORAGE_KEY = 'anselmo-tasks-v1';

const STATUS_CONFIG = {
  todo: { color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.15)', label: 'Da fare' },
  'in-progress': { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', label: 'In corso' },
  done: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', label: 'Completata' },
};

const PRIORITY_CONFIG = {
  high: { color: '#ef4444', label: 'Alta' },
  medium: { color: '#f59e0b', label: 'Media' },
  low: { color: '#10b981', label: 'Bassa' },
};

const eventTypeConfig = {
  work: { 
    label: 'Lavoro', 
    icon: Briefcase, 
    color: '#3b82f6', 
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  commute: { 
    label: 'Commute', 
    icon: Car, 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  meal: { 
    label: 'Pasto', 
    icon: Utensils, 
    color: '#10b981', 
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  lifequest: { 
    label: 'Life Quest', 
    icon: Target, 
    color: '#e91e63', 
    bgColor: 'rgba(233, 30, 99, 0.15)',
    borderColor: 'rgba(233, 30, 99, 0.3)'
  },
  task: { 
    label: 'Task', 
    icon: CheckSquare, 
    color: '#8b5cf6', 
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)'
  },
  personal: { 
    label: 'Personale', 
    icon: Sun, 
    color: '#06b6d4', 
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.3)'
  },
  break: { 
    label: 'Pausa', 
    icon: Coffee, 
    color: '#f97316', 
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)'
  },
};

const weekDayLabels = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

// ============================================
// ROUTINE GENERATOR
// ============================================
const generateWeeklyRoutine = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  
  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(currentWeekStart);
      currentDate.setDate(currentWeekStart.getDate() + (weekOffset * 7) + day);
      const dateStr = currentDate.toISOString().split('T')[0];
      const isWeekend = day === 0 || day === 6;
      
      if (!isWeekend) {
        events.push(
          {
            id: `${dateStr}-commute-morning`,
            title: '🚗 Commute Casa → Lavoro',
            date: dateStr,
            startTime: '08:30',
            endTime: '09:00',
            type: 'commute',
            category: 'Trasporto',
            description: 'Preparazione mentale per la giornata'
          },
          {
            id: `${dateStr}-work-morning`,
            title: '💼 Lavoro - Focus Session',
            date: dateStr,
            startTime: '09:00',
            endTime: '13:00',
            type: 'work',
            category: 'Lavoro',
            description: 'Deep work, coding, meeting'
          },
          {
            id: `${dateStr}-lunch-break`,
            title: '🍽️ Pausa Pranzo',
            date: dateStr,
            startTime: '13:00',
            endTime: '14:30',
            type: 'break',
            category: 'Riposo',
            description: 'Pranzo bilanciato + riposo'
          },
          {
            id: `${dateStr}-work-afternoon`,
            title: '💼 Lavoro - Afternoon Session',
            date: dateStr,
            startTime: '14:30',
            endTime: '18:30',
            type: 'work',
            category: 'Lavoro',
            description: 'Code review, planning, wrap-up'
          },
          {
            id: `${dateStr}-commute-evening`,
            title: '🚗 Commute Lavoro → Casa',
            date: dateStr,
            startTime: '18:30',
            endTime: '19:00',
            type: 'commute',
            category: 'Trasporto',
            description: 'Decompressione post-lavoro'
          }
        );
        
        if (day === 1 || day === 3 || day === 5) {
          events.push({
            id: `${dateStr}-training`,
            title: '🏋️ Training Session',
            date: dateStr,
            startTime: '19:30',
            endTime: '20:30',
            type: 'lifequest',
            category: 'Health',
            description: day === 1 ? 'Upper Body' : day === 3 ? 'Lower Body' : 'Full Body'
          });
        }
        
        events.push(
          {
            id: `${dateStr}-breakfast`,
            title: '🍳 Colazione Proteica',
            date: dateStr,
            startTime: '07:30',
            endTime: '08:00',
            type: 'meal',
            category: 'Breakfast',
            description: 'Uova, avocado, pane integrale'
          },
          {
            id: `${dateStr}-dinner`,
            title: '🥗 Cena Leggera',
            date: dateStr,
            startTime: '20:00',
            endTime: '20:30',
            type: 'meal',
            category: 'Dinner',
            description: 'Proteine + verdure'
          }
        );
      } else {
        events.push(
          {
            id: `${dateStr}-weekend-breakfast`,
            title: '☕ Colazione Rilassata',
            date: dateStr,
            startTime: '09:00',
            endTime: '10:00',
            type: 'meal',
            category: 'Breakfast',
            description: 'Weekend mode: pancakes o brunch'
          },
          {
            id: `${dateStr}-personal-project`,
            title: '🚀 Personal Project / Side Hustle',
            date: dateStr,
            startTime: '10:00',
            endTime: '13:00',
            type: 'personal',
            category: 'Crescita',
            description: 'Lavoro sui propri progetti'
          },
          {
            id: `${dateStr}-weekend-lunch`,
            title: '🍝 Pranzo Sociale',
            date: dateStr,
            startTime: '13:00',
            endTime: '15:00',
            type: 'meal',
            category: 'Lunch',
            description: 'Pranzo con famiglia/amici'
          },
          {
            id: `${dateStr}-learning`,
            title: '📚 Learning / Reading',
            date: dateStr,
            startTime: '16:00',
            endTime: '18:00',
            type: 'lifequest',
            category: 'Learning',
            description: 'Libri, corsi, documentazione'
          }
        );
        
        events.push({
          id: `${dateStr}-weekend-activity`,
          title: day === 0 ? '🏃 Cardio / Outdoor' : '⚽ Sport / Movimento',
          date: dateStr,
          startTime: '18:00',
          endTime: '20:00',
          type: 'lifequest',
          category: 'Health',
          description: 'Attività fisica ricreativa'
        });
      }
    }
  }
  
  return events;
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showRoutine, setShowRoutine] = useState(true);
  const [taskEvents, setTaskEvents] = useState<CalendarEvent[]>([]);
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const loadTasks = () => {
      try {
        const stored = localStorage.getItem(CALENDAR_TASKS_KEY);
        if (stored) {
          setTaskEvents(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading calendar tasks:', error);
      }
      setIsLoaded(true);
    };

    loadTasks();

    // Listen for task updates
    const handleTasksUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setTaskEvents(customEvent.detail);
      }
    };

    window.addEventListener('tasksUpdated', handleTasksUpdate);
    return () => window.removeEventListener('tasksUpdated', handleTasksUpdate);
  }, []);

  // Combine routine and task events
  const allEvents = [...generateWeeklyRoutine(), ...taskEvents];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const getEventsForDate = (dateStr: string) => {
    let events = allEvents.filter(e => e.date === dateStr);
    if (!showRoutine) {
      events = events.filter(e => e.type !== 'work' && e.type !== 'commute' && e.type !== 'break');
    }
    return events.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Task status update
  const updateTaskStatus = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    // Update in tasks storage
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const tasks: Task[] = JSON.parse(stored);
        const updatedTasks = tasks.map(t => 
          t.id === taskId 
            ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
            : t
        );
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        
        // Update calendar tasks
        const updatedCalendarTasks = taskEvents.map(te => 
          te.taskId === taskId ? { ...te, status: newStatus } : te
        );
        setTaskEvents(updatedCalendarTasks);
        localStorage.setItem(CALENDAR_TASKS_KEY, JSON.stringify(updatedCalendarTasks));
        
        // Notify tasks page
        window.dispatchEvent(new CustomEvent('calendarUpdate', { 
          detail: { type: 'taskStatusChanged', taskId, newStatus } 
        }));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Change task date
  const changeTaskDate = (taskId: string, newDate: string) => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const tasks: Task[] = JSON.parse(stored);
        const updatedTasks = tasks.map(t => 
          t.id === taskId 
            ? { ...t, dueDate: newDate, updatedAt: new Date().toISOString() }
            : t
        );
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        
        // Update calendar tasks
        const updatedCalendarTasks = taskEvents.map(te => 
          te.taskId === taskId ? { ...te, date: newDate } : te
        );
        setTaskEvents(updatedCalendarTasks);
        localStorage.setItem(CALENDAR_TASKS_KEY, JSON.stringify(updatedCalendarTasks));
        
        // Notify tasks page
        window.dispatchEvent(new CustomEvent('calendarUpdate', { 
          detail: { type: 'taskDateChanged', taskId, newDate } 
        }));
        
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error changing task date:', error);
    }
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa task?')) return;
    
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const tasks: Task[] = JSON.parse(stored);
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        
        // Update calendar tasks
        const updatedCalendarTasks = taskEvents.filter(te => te.taskId !== taskId);
        setTaskEvents(updatedCalendarTasks);
        localStorage.setItem(CALENDAR_TASKS_KEY, JSON.stringify(updatedCalendarTasks));
        
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // ============================================
  // VIEWS
  // ============================================
  const renderMonthView = () => {
    const days = [];
    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-28" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateStr);
      const isToday = dateStr === today;
      const isSelected = selectedDate === dateStr;
      const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;
      
      // Count tasks
      const taskCount = dayEvents.filter(e => e.type === 'task').length;

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(isSelected ? null : dateStr)}
          className={`
            min-h-28 p-2 rounded-xl border transition-all duration-300 cursor-pointer
            ${isToday ? 'bg-fuchsia-500/10 border-fuchsia-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}
            ${isSelected ? 'ring-2 ring-fuchsia-500/50' : ''}
            ${isWeekend ? 'bg-white/[0.02]' : ''}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isToday ? 'text-fuchsia-400' : 'text-white/70'}`}>
              {day}
            </span>
            {isToday && (
              <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
            )}
            {taskCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/30 text-violet-300">
                {taskCount}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (event.type === 'task' && event.taskId) {
                    setSelectedTask(event);
                  }
                }}
                className={`text-xs px-2 py-1 rounded-lg truncate cursor-pointer hover:opacity-80 ${
                  event.type === 'task' ? 'hover:ring-1 hover:ring-violet-400/50' : ''
                }`}
                style={{ 
                  backgroundColor: eventTypeConfig[event.type].bgColor,
                  color: eventTypeConfig[event.type].color,
                  borderLeft: `2px solid ${eventTypeConfig[event.type].color}`
                }}
              >
                {event.type === 'task' ? '📋' : event.title.split(' ')[0]} {event.startTime}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-white/40 px-2">+{dayEvents.length - 3} altri</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const dayEvents = getEventsForDate(dateStr);
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const isWeekend = index === 0 || index === 6;

          return (
            <div key={index} className="min-h-[500px]">
              <div className={`text-center p-3 rounded-xl mb-2 ${isToday ? 'bg-fuchsia-500/20 border border-fuchsia-500/30' : isWeekend ? 'bg-white/[0.02]' : 'bg-white/5'}`}>
                <div className="text-xs text-white/50 uppercase">{weekDayLabels[index]}</div>
                <div className={`text-lg font-bold ${isToday ? 'text-fuchsia-400' : 'text-white'}`}>
                  {day.getDate()}
                </div>
                {isWeekend && <div className="text-[10px] text-yellow-400/70">Weekend</div>}
              </div>
              <div className="space-y-2">
                {dayEvents.map((event) => {
                  const Icon = eventTypeConfig[event.type].icon;
                  return (
                    <div
                      key={event.id}
                      onClick={() => event.type === 'task' && event.taskId && setSelectedTask(event)}
                      className={`p-3 rounded-xl text-xs group hover:scale-[1.02] transition-transform cursor-pointer ${
                        event.type === 'task' ? 'hover:ring-2 hover:ring-violet-400/50' : ''
                      }`}
                      style={{ 
                        backgroundColor: eventTypeConfig[event.type].bgColor,
                        borderLeft: `3px solid ${eventTypeConfig[event.type].color}`
                      }}
                    >
                      <div className="flex items-center gap-1 mb-1" style={{ color: eventTypeConfig[event.type].color }}>
                        <Icon className="w-3 h-3" />
                        <span className="font-medium">{event.startTime}-{event.endTime}</span>
                      </div>
                      <div className="text-white font-medium leading-tight">{event.title}</div>
                      {event.description && (
                        <div className="text-white/50 mt-1 text-[10px]">{event.description}</div>
                      )}
                      {event.type === 'task' && event.status && (
                        <div 
                          className="mt-1.5 text-[10px] px-1.5 py-0.5 rounded inline-block"
                          style={{ 
                            backgroundColor: STATUS_CONFIG[event.status].bgColor,
                            color: STATUS_CONFIG[event.status].color
                          }}
                        >
                          {STATUS_CONFIG[event.status].label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayEvents = getEventsForDate(dateStr);
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    return (
      <div className="space-y-3">
        <div className={`p-4 rounded-xl mb-4 ${isWeekend ? 'bg-yellow-500/5 border border-yellow-500/20' : 'bg-blue-500/5 border border-blue-500/20'}`}>
          <div className="flex items-center gap-3">
            {isWeekend ? <Sun className="w-6 h-6 text-yellow-400" /> : <Briefcase className="w-6 h-6 text-blue-400" />}
            <div>
              <h3 className="font-semibold text-white">{isWeekend ? 'Weekend Mode' : 'Giorno Lavorativo'}</h3>
              <p className="text-sm text-white/50">
                {isWeekend 
                  ? 'Tempo libero per progetti personali, sport e riposo' 
                  : 'Routine: Commute → Lavoro → Training → Riposo'}
              </p>
            </div>
          </div>
        </div>

        {dayEvents.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <CalendarIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">Nessun evento per questa giornata</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEvents.map((event) => {
              const Icon = eventTypeConfig[event.type].icon;
              return (
                <div
                  key={event.id}
                  onClick={() => event.type === 'task' && event.taskId && setSelectedTask(event)}
                  className={`glass-card p-4 flex items-center gap-4 group hover:border-white/20 transition-all cursor-pointer ${
                    event.type === 'task' ? 'hover:ring-2 hover:ring-violet-400/30' : ''
                  }`}
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: eventTypeConfig[event.type].bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: eventTypeConfig[event.type].color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-white/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-lg"
                        style={{ 
                          backgroundColor: eventTypeConfig[event.type].bgColor,
                          color: eventTypeConfig[event.type].color
                        }}
                      >
                        {eventTypeConfig[event.type].label}
                      </span>
                      {event.type === 'task' && event.status && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ 
                            backgroundColor: STATUS_CONFIG[event.status].bgColor,
                            color: STATUS_CONFIG[event.status].color
                          }}
                        >
                          {STATUS_CONFIG[event.status].label}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-white/40 mt-2">{event.description}</p>
                    )}
                  </div>
                  {event.type === 'task' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-violet-400">Click per dettagli →</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Caricamento calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass-card px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <CalendarIcon className="w-6 h-6 text-fuchsia-400" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Calendar
              </h1>
              <p className="text-sm text-white/50 mt-1">
                {monthNames[month]} {year} • {taskEvents.length} task programmate
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/tasks"
              className="btn-glass px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Tasks
            </Link>
            
            <button
              onClick={() => setShowRoutine(!showRoutine)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                showRoutine 
                  ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' 
                  : 'btn-glass text-white/60'
              }`}
            >
              {showRoutine ? '👁️ Mostra tutto' : '🙈 Solo task'}
            </button>
            
            <button
              onClick={goToToday}
              className="btn-glass px-3 py-2 rounded-xl text-sm text-white/70"
            >
              Oggi
            </button>
            
            <div className="flex bg-white/5 rounded-xl p-1">
              {(['month', 'week', 'day'] as ViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    view === v
                      ? 'bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 text-fuchsia-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {v === 'month' ? 'Mese' : v === 'week' ? 'Settimana' : 'Giorno'}
                </button>
              ))}
            </div>            
            <div className="flex gap-1">
              <button onClick={prevMonth} className="btn-glass w-10 h-10 rounded-xl flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-white/70" />
              </button>
              <button onClick={nextMonth} className="btn-glass w-10 h-10 rounded-xl flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(eventTypeConfig).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-xs text-white/70">{config.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        <div className="glass-card p-5">
          {view === 'month' && (
            <>
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDayLabels.map((day) => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-white/50">
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderMonthView()}
              </div>
            </>
          )}
          
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        {/* Selected Date Events */}
        {selectedDate && view === 'month' && (
          <div className="mt-6 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Eventi del {new Date(selectedDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
              </h3>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-xs text-white/50 hover:text-white/70"
              >
                Chiudi
              </button>
            </div>
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map((event) => {
                const Icon = eventTypeConfig[event.type].icon;
                return (
                  <div
                    key={event.id}
                    onClick={() => event.type === 'task' && event.taskId && setSelectedTask(event)}
                    className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
                      event.type === 'task' ? 'hover:ring-1 hover:ring-violet-400/50' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: eventTypeConfig[event.type].color }} />
                    <div className="flex-1">
                      <span className="text-sm text-white">{event.title}</span>
                      <span className="text-xs text-white/40 ml-2">{event.startTime}-{event.endTime}</span>
                    </div>
                    {event.type === 'task' && event.status && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: STATUS_CONFIG[event.status].bgColor,
                          color: STATUS_CONFIG[event.status].color
                        }}
                      >
                        {STATUS_CONFIG[event.status].label}
                      </span>
                    )}
                  </div>
                );
              })}
              {getEventsForDate(selectedDate).length === 0 && (
                <p className="text-sm text-white/40 text-center py-4">Nessun evento</p>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-fuchsia-400">{taskEvents.length}</div>
            <div className="text-xs text-white/50">Task programmate</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {taskEvents.filter(t => t.status === 'done').length}
            </div>
            <div className="text-xs text-white/50">Task completate</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">
              {taskEvents.filter(t => t.status === 'in-progress').length}
            </div>
            <div className="text-xs text-white/50">In corso</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {taskEvents.filter(t => {
                if (!t.date) return false;
                return new Date(t.date) < new Date(new Date().toISOString().split('T')[0]) && t.status !== 'done';
              }).length}
            </div>
            <div className="text-xs text-white/50">In ritardo</div>
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: eventTypeConfig.task.bgColor }}
                >
                  <CheckSquare className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedTask.title}</h3>
                  <p className="text-sm text-white/50">Task</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CalendarIcon className="w-4 h-4" />
                <span>Scadenza: {selectedTask.date ? new Date(selectedTask.date).toLocaleDateString('it-IT') : 'Non impostata'}</span>
              </div>

              {selectedTask.description && (
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-white/70">{selectedTask.description}</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs text-white/50 uppercase mb-1.5 block">Stato</label>
                  <div className="flex gap-2">
                    {(['todo', 'in-progress', 'done'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => selectedTask.taskId && updateTaskStatus(selectedTask.taskId, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedTask.status === status
                            ? 'ring-1 ring-white/50'
                            : 'opacity-50 hover:opacity-75'
                        }`}
                        style={{ 
                          backgroundColor: STATUS_CONFIG[status].bgColor,
                          color: STATUS_CONFIG[status].color
                        }}
                      >
                        {STATUS_CONFIG[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase mb-1.5 block">Cambia data</label>
                <input
                  type="date"
                  value={selectedTask.date || ''}
                  onChange={(e) => selectedTask.taskId && changeTaskDate(selectedTask.taskId, e.target.value)}
                  className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Link
                  href="/tasks"
                  className="flex-1 btn-glass px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white text-center"
                >
                  Vai alle Tasks
                </Link>
                <button
                  onClick={() => selectedTask.taskId && deleteTask(selectedTask.taskId)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

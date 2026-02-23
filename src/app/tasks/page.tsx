'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Flag,
  Search,
  Calendar,
  Filter,
  MoreHorizontal,
  GripVertical,
  X,
  Edit3,
  Clock,
  Tag,
  ArrowUpDown,
  Save,
  AlertCircle,
  CheckSquare2
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'Work' | 'Personal' | 'Health' | 'Learning';

export interface Task {
  id: string;
  text: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'task';
  category?: string;
  description?: string;
  taskId?: string;
}

// ============================================
// CONSTANTS
// ============================================
const STORAGE_KEY = 'anselmo-tasks-v1';
const CALENDAR_TASKS_KEY = 'anselmo-calendar-tasks';

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Health', 'Learning'];

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: typeof Circle }> = {
  todo: { 
    label: 'Da fare', 
    color: '#94a3b8', 
    bgColor: 'rgba(148, 163, 184, 0.15)', 
    borderColor: 'rgba(148, 163, 184, 0.3)',
    icon: Circle 
  },
  'in-progress': { 
    label: 'In corso', 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.15)', 
    borderColor: 'rgba(245, 158, 11, 0.3)',
    icon: Clock 
  },
  done: { 
    label: 'Completata', 
    color: '#10b981', 
    bgColor: 'rgba(16, 185, 129, 0.15)', 
    borderColor: 'rgba(16, 185, 129, 0.3)',
    icon: CheckCircle2 
  },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string; borderColor: string }> = {
  high: { 
    color: '#ef4444', 
    bgColor: 'rgba(239, 68, 68, 0.15)', 
    label: 'Alta', 
    borderColor: 'rgba(239, 68, 68, 0.3)' 
  },
  medium: { 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.15)', 
    label: 'Media', 
    borderColor: 'rgba(245, 158, 11, 0.3)' 
  },
  low: { 
    color: '#10b981', 
    bgColor: 'rgba(16, 185, 129, 0.15)', 
    label: 'Bassa', 
    borderColor: 'rgba(16, 185, 129, 0.3)' 
  },
};

const CATEGORY_CONFIG: Record<TaskCategory, { gradient: string; textColor: string; icon: string }> = {
  Work: { 
    gradient: 'from-fuchsia-500/20 to-purple-600/20', 
    textColor: 'text-fuchsia-400',
    icon: '💼'
  },
  Personal: { 
    gradient: 'from-pink-500/20 to-rose-600/20', 
    textColor: 'text-pink-400',
    icon: '🏠'
  },
  Health: { 
    gradient: 'from-emerald-500/20 to-teal-600/20', 
    textColor: 'text-emerald-400',
    icon: '💪'
  },
  Learning: { 
    gradient: 'from-amber-500/20 to-orange-600/20', 
    textColor: 'text-amber-400',
    icon: '📚'
  },
};

type FilterType = 'all' | 'todo' | 'in-progress' | 'done';
type SortType = 'order' | 'dueDate' | 'priority' | 'created';

// ============================================
// INITIAL DATA
// ============================================
const getInitialTasks = (): Task[] => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  
  return [
    { 
      id: '1', 
      text: 'Review PRs del progetto dashboard', 
      description: 'Controllare le pull request in sospeso e approvare quelle pronte',
      priority: 'high', 
      status: 'todo',
      dueDate: today, 
      category: 'Work',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0
    },
    { 
      id: '2', 
      text: 'Aggiornare documentazione API', 
      description: 'Aggiornare la documentazione con i nuovi endpoints',
      priority: 'medium', 
      status: 'in-progress',
      dueDate: tomorrow, 
      category: 'Work',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 1
    },
    { 
      id: '3', 
      text: 'Allenamento in palestra', 
      description: 'Upper body day - petto e tricipiti',
      priority: 'medium', 
      status: 'todo',
      dueDate: today, 
      category: 'Health',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 2
    },
    { 
      id: '4', 
      text: 'Leggere capitolo del libro', 
      description: 'Capitolo 5 - Deep Work',
      priority: 'low', 
      status: 'todo',
      dueDate: nextWeek, 
      category: 'Learning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 3
    },
    { 
      id: '5', 
      text: 'Comprare ingredienti per cena', 
      description: 'Pasta, pomodori, basilico, parmigiano',
      priority: 'low', 
      status: 'done',
      dueDate: today, 
      category: 'Personal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 4
    },
  ];
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function TasksPage() {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Work');
  const [newDueDate, setNewDueDate] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus>('todo');
  
  // Filter state
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('order');
  
  // Drag & drop state
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverTask, setDragOverTask] = useState<string | null>(null);

  // ============================================
  // LOCALSTORAGE PERSISTENCE
  // ============================================
  useEffect(() => {
    const loadTasks = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setTasks(parsed);
        } else {
          const initial = getInitialTasks();
          setTasks(initial);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks(getInitialTasks());
      }
      setIsLoaded(true);
    };
    
    loadTasks();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      syncTasksToCalendar(tasks);
    }
  }, [tasks, isLoaded]);

  // Sync tasks to calendar
  const syncTasksToCalendar = useCallback((currentTasks: Task[]) => {
    const calendarEvents: CalendarEvent[] = currentTasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: `task-${task.id}`,
        title: task.text,
        date: task.dueDate!,
        startTime: '09:00',
        endTime: '10:00',
        type: 'task',
        category: task.category,
        description: task.description || `Task ${STATUS_CONFIG[task.status].label}`,
        taskId: task.id
      }));
    
    localStorage.setItem(CALENDAR_TASKS_KEY, JSON.stringify(calendarEvents));
    
    // Dispatch custom event to notify calendar
    window.dispatchEvent(new CustomEvent('tasksUpdated', { detail: calendarEvents }));
  }, []);

  // Listen for calendar updates
  useEffect(() => {
    const handleCalendarUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type === 'taskDateChanged') {
        const { taskId, newDate } = customEvent.detail;
        setTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { ...t, dueDate: newDate, updatedAt: new Date().toISOString() }
            : t
        ));
      }
    };
    
    window.addEventListener('calendarUpdate', handleCalendarUpdate);
    return () => window.removeEventListener('calendarUpdate', handleCalendarUpdate);
  }, []);

  // ============================================
  // CRUD OPERATIONS
  // ============================================
  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      description: newDescription,
      priority: newPriority,
      status: newStatus,
      category: newCategory,
      dueDate: newDueDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: tasks.length,
    };
    
    setTasks([task, ...tasks]);
    resetForm();
  };

  const updateTask = () => {
    if (!editingTask || !newTask.trim()) return;
    
    setTasks(tasks.map(t => 
      t.id === editingTask.id 
        ? { 
            ...t, 
            text: newTask,
            description: newDescription,
            priority: newPriority,
            status: newStatus,
            category: newCategory,
            dueDate: newDueDate || undefined,
            updatedAt: new Date().toISOString()
          }
        : t
    ));
    
    resetForm();
  };

  const deleteTask = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, status, updatedAt: new Date().toISOString() }
        : t
    ));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id !== id) return t;
      
      const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'done'];
      const currentIndex = statusOrder.indexOf(t.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      
      return { ...t, status: nextStatus, updatedAt: new Date().toISOString() };
    }));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setNewDescription(task.description || '');
    setNewPriority(task.priority);
    setNewCategory(task.category);
    setNewDueDate(task.dueDate || '');
    setNewStatus(task.status);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewTask('');
    setNewDescription('');
    setNewPriority('medium');
    setNewCategory('Work');
    setNewDueDate('');
    setNewStatus('todo');
    setEditingTask(null);
    setShowAddForm(false);
  };

  // ============================================
  // DRAG & DROP
  // ============================================
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    setDragOverTask(taskId);
  };

  const handleDragLeave = () => {
    setDragOverTask(null);
  };

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    setDragOverTask(null);
    
    if (!draggedTask || draggedTask.id === targetTask.id) return;
    
    const newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);
    
    // Remove dragged task
    newTasks.splice(draggedIndex, 1);
    // Insert at new position
    newTasks.splice(targetIndex, 0, draggedTask);
    
    // Update order
    const reorderedTasks = newTasks.map((t, index) => ({ ...t, order: index }));
    
    setTasks(reorderedTasks);
    setDraggedTask(null);
  };

  // ============================================
  // FILTERING & SORTING
  // ============================================
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filter !== 'all' && task.status !== filter) return false;
    
    // Category filter
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      task.text.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower) ||
      task.category.toLowerCase().includes(searchLower);
    
    return matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'order':
      default:
        return a.order - b.order;
    }
  });

  // ============================================
  // STATS
  // ============================================
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    withDueDate: tasks.filter(t => t.dueDate).length,
  };

  const progress = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

  // ============================================
  // RENDER
  // ============================================
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Caricamento tasks...</p>
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
              <CheckSquare className="w-6 h-6 text-fuchsia-400" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Task Management
              </h1>
              <p className="text-sm text-white/50 mt-1">
                {stats.done} di {stats.total} completate • {stats.withDueDate} con scadenza
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/calendar"
              className="btn-glass px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendario</span>
            </Link>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary-glow px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {showAddForm ? 'Chiudi' : 'Nuova Task'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Circle className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-white/50 uppercase">Da fare</span>
            </div>
            <div className="text-2xl font-bold text-slate-300">{stats.todo}</div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-white/50 uppercase">In corso</span>
            </div>
            <div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-white/50 uppercase">Completate</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{stats.done}</div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-fuchsia-400" />
              <span className="text-xs text-white/50 uppercase">Con scadenza</span>
            </div>
            <div className="text-2xl font-bold text-fuchsia-400">{stats.withDueDate}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/70">Progresso Complessivo</span>
            <span className="text-sm font-medium text-emerald-400">{Math.round(progress)}%</span>
          </div>
          <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex gap-4">
              {CATEGORIES.map(cat => {
                const count = tasks.filter(t => t.category === cat).length;
                const done = tasks.filter(t => t.category === cat && t.status === 'done').length;
                return (
                  <div key={cat} className="flex items-center gap-1.5">
                    <span className="text-xs">{CATEGORY_CONFIG[cat].icon}</span>
                    <span className="text-xs text-white/50">{done}/{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add/Edit Task Form */}
        {showAddForm && (
          <div className="glass-card p-5 mb-6 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                {editingTask ? 'Modifica Task' : 'Nuova Task'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 uppercase mb-1.5 block">Titolo</label>
                <input
                  type="text"
                  placeholder="Cosa devi fare?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (editingTask ? updateTask() : addTask())}
                  className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-xs text-white/50 uppercase mb-1.5 block">Descrizione (opzionale)</label>
                <textarea
                  placeholder="Aggiungi dettagli..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-white/50 uppercase mb-1.5 block">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white/70 cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-900">
                        {CATEGORY_CONFIG[cat].icon} {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-white/50 uppercase mb-1.5 block">Priorità</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white/70 cursor-pointer"
                  >
                    <option value="high" className="bg-gray-900">🔴 Alta</option>
                    <option value="medium" className="bg-gray-900">🟡 Media</option>
                    <option value="low" className="bg-gray-900">🟢 Bassa</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-white/50 uppercase mb-1.5 block">Stato</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white/70 cursor-pointer"
                  >
                    <option value="todo" className="bg-gray-900">⚪ Da fare</option>
                    <option value="in-progress" className="bg-gray-900">🟠 In corso</option>
                    <option value="done" className="bg-gray-900">🟢 Completata</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-white/50 uppercase mb-1.5 block">Scadenza</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white/70 cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={editingTask ? updateTask : addTask}
                  className="btn-primary-glow flex-1 px-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingTask ? 'Salva Modifiche' : 'Aggiungi Task'}
                </button>
                <button
                  onClick={resetForm}
                  className="btn-glass px-6 py-3 rounded-xl text-sm font-medium text-white/70"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'todo', 'in-progress', 'done'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === f
                    ? 'bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 text-fuchsia-400 border border-fuchsia-500/30'
                    : 'glass-card text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {f === 'all' ? 'Tutte' : f === 'todo' ? 'Da fare' : f === 'in-progress' ? 'In corso' : 'Completate'}
              </button>
            ))}
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                categoryFilter === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'glass-card text-white/60 hover:text-white'
              }`}
            >
              Tutte
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  categoryFilter === cat
                    ? `bg-gradient-to-r ${CATEGORY_CONFIG[cat].gradient} ${CATEGORY_CONFIG[cat].textColor} border border-white/20`
                    : 'glass-card text-white/60 hover:text-white'
                }`}
              >
                <span>{CATEGORY_CONFIG[cat].icon}</span>
                <span className="hidden sm:inline">{cat}</span>
              </button>
            ))}
          </div>
          
          {/* Search & Sort */}
          <div className="flex gap-3 flex-1 lg:justify-end">
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Cerca task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="input-glass px-4 py-2.5 rounded-xl text-sm text-white/70 cursor-pointer"
            >
              <option value="order" className="bg-gray-900">📋 Ordine</option>
              <option value="dueDate" className="bg-gray-900">📅 Scadenza</option>
              <option value="priority" className="bg-gray-900">🚩 Priorità</option>
              <option value="created" className="bg-gray-900">🆕 Data creazione</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="glass-card p-5">
          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 mb-2">Nessuna task trovata</p>
                <p className="text-sm text-white/30">
                  {searchQuery ? 'Prova a modificare i filtri di ricerca' : 'Aggiungi la tua prima task!'}
                </p>
              </div>
            ) : (
              sortedTasks.map((task, index) => {
                const StatusIcon = STATUS_CONFIG[task.status].icon;
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().toISOString().split('T')[0]) && task.status !== 'done';
                
                return (
                  <div
                    key={task.id}
                    draggable={sortBy === 'order'}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragOver={(e) => handleDragOver(e, task.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, task)}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group
                      ${task.status === 'done' ? 'opacity-60 bg-white/[0.02]' : 'hover:bg-white/5'}
                      ${dragOverTask === task.id ? 'ring-2 ring-fuchsia-500/50 bg-fuchsia-500/10' : ''}
                      ${draggedTask?.id === task.id ? 'opacity-50' : ''}
                      ${sortBy === 'order' ? 'cursor-move' : ''}
                    `}
                  >
                    {/* Drag Handle */}
                    {sortBy === 'order' && (
                      <div className="flex-shrink-0 text-white/20 group-hover:text-white/40 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    )}
                    
                    {/* Status Checkbox */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="flex-shrink-0 relative"
                    >
                      <div 
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${task.status === 'done' 
                            ? 'bg-emerald-500/20 border-emerald-500' 
                            : task.status === 'in-progress'
                            ? 'bg-amber-500/20 border-amber-500'
                            : 'bg-white/5 border-white/30 hover:border-white/50'
                          }
                        `}
                      >
                        {task.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {task.status === 'in-progress' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>
                    
                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        task.status === 'done' ? 'line-through text-white/30' : 'text-white'
                      }`}>
                        {task.text}
                      </p>
                      
                      {task.description && (
                        <p className={`text-xs mt-0.5 ${
                          task.status === 'done' ? 'text-white/20' : 'text-white/50'
                        }`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Category Badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-lg bg-gradient-to-r ${CATEGORY_CONFIG[task.category].gradient} ${CATEGORY_CONFIG[task.category].textColor}`}>
                          {CATEGORY_CONFIG[task.category].icon} {task.category}
                        </span>
                        
                        {/* Due Date */}
                        {task.dueDate && (
                          <span className={`text-xs flex items-center gap-1 ${
                            isOverdue ? 'text-red-400' : 'text-white/40'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString('it-IT')}
                            {isOverdue && <AlertCircle className="w-3 h-3 ml-1" />}
                          </span>
                        )}
                        
                        {/* Status Badge */}
                        <span 
                          className="text-xs px-2 py-0.5 rounded-lg border"
                          style={{ 
                            backgroundColor: STATUS_CONFIG[task.status].bgColor,
                            color: STATUS_CONFIG[task.status].color,
                            borderColor: STATUS_CONFIG[task.status].borderColor
                          }}
                        >
                          {STATUS_CONFIG[task.status].label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Priority Badge */}
                    <div 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                      style={{ 
                        backgroundColor: PRIORITY_CONFIG[task.priority].bgColor,
                        color: PRIORITY_CONFIG[task.priority].color,
                        borderColor: PRIORITY_CONFIG[task.priority].borderColor
                      }}
                    >
                      <Flag className="w-3 h-3" />
                      <span className="hidden sm:inline">{PRIORITY_CONFIG[task.priority].label}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 rounded-lg hover:bg-fuchsia-500/20 text-white/30 hover:text-fuchsia-400 transition-colors"
                        title="Modifica"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Status Change Hints */}
        <div className="mt-6 glass-card p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <Circle className="w-3 h-3" />
              Click sul cerchio per cambiare stato
            </span>
            <span className="flex items-center gap-1.5">
              <GripVertical className="w-3 h-3" />
              Trascina per riordinare (modalità "Ordine")
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Le task con scadenza appaiono nel calendario
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

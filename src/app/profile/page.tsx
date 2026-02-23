'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Mail, 
  LogOut, 
  CheckSquare, 
  Clock, 
  Utensils,
  Moon,
  Bell,
  Globe,
  Palette,
  ChevronRight,
  Edit3,
  Camera,
  Target,
  TrendingUp,
  Award,
  Github,
  Star,
  GitFork,
  Flame,
  Zap,
  Calendar,
  Activity,
  PieChart,
  BarChart3,
  Save,
  X,
  Link as LinkIcon,
  Shield
} from 'lucide-react';
import Link from 'next/link';

// Types
interface UserStats {
  tasks: {
    completed: number;
    total: number;
    streakDays: number;
    byCategory: Record<string, number>;
  };
  github: {
    commitsThisWeek: number;
    totalRepos: number;
    totalStars: number;
    username: string;
  };
  meal: {
    recipesTried: number;
    consecutiveDays: number;
    totalMealsPlanned: number;
  };
  focus: {
    totalHours: number;
    totalSessions: number;
    todaySessions: number;
  };
  lifeQuests: {
    totalProgress: number;
    completedHabits: number;
    totalHabits: number;
  };
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  githubUsername: string;
  website?: string;
  location?: string;
}

interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  language: 'it' | 'en';
  githubIntegration: boolean;
}

interface Achievement {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

interface ActivityData {
  date: string;
  tasks: number;
  focus: number;
  meal: boolean;
}

// LocalStorage Keys (matching other widgets)
const STORAGE_KEYS = {
  TASKS: 'dashboard_tasks',
  POMODORO: 'pomodoro_sessions',
  POMODORO_STATS: 'pomodoro_stats',
  MEAL_PLAN: 'meal_plan_history',
  MEAL_STREAK: 'meal_streak',
  LIFE_QUESTS: 'life_quests',
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  ACTIVITY_LOG: 'activity_log',
  ACHIEVEMENTS: 'achievements',
};

// Default user profile
const defaultProfile: UserProfile = {
  name: 'Anselmo Acquah',
  email: 'anselmo@example.com',
  avatar: 'A',
  bio: 'Full Stack Developer & AI enthusiast. Building the future, one commit at a time.',
  role: 'Full Stack Developer',
  githubUsername: 'anselmomeshack',
  website: 'https://anselmo.dev',
  location: 'Italy',
};

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  notifications: true,
  language: 'it',
  githubIntegration: true,
};

export default function ProfilePage() {
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(defaultProfile);
  const [stats, setStats] = useState<UserStats>({
    tasks: { completed: 0, total: 0, streakDays: 0, byCategory: {} },
    github: { commitsThisWeek: 0, totalRepos: 0, totalStars: 0, username: '' },
    meal: { recipesTried: 0, consecutiveDays: 0, totalMealsPlanned: 0 },
    focus: { totalHours: 0, totalSessions: 0, todaySessions: 0 },
    lifeQuests: { totalProgress: 0, completedHabits: 0, totalHabits: 0 },
  });
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    
    // Load profile
    const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const profile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
    setUserProfile(profile);
    setEditedProfile(profile);

    // Load preferences
    const savedPrefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    const prefs = savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
    setPreferences(prefs);

    // Aggregate stats
    await aggregateStats(profile);
    
    setIsLoading(false);
  };

  const aggregateStats = async (profile: UserProfile) => {
    // 1. Tasks Stats
    const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
    let tasksCompleted = 0;
    let tasksTotal = 0;
    let taskStreak = 0;
    const tasksByCategory: Record<string, number> = {};

    if (tasksData) {
      try {
        const tasks = JSON.parse(tasksData);
        tasksTotal = tasks.length;
        tasksCompleted = tasks.filter((t: any) => t.completed).length;
        
        // Count by category/priority
        tasks.forEach((t: any) => {
          const cat = t.priority || 'medium';
          tasksByCategory[cat] = (tasksByCategory[cat] || 0) + 1;
        });

        // Calculate streak from completed tasks dates
        const completedDates = tasks
          .filter((t: any) => t.completed && t.completedAt)
          .map((t: any) => new Date(t.completedAt).toDateString())
          .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
          .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
        
        taskStreak = calculateStreak(completedDates);
      } catch (e) {
        console.error('Error parsing tasks:', e);
      }
    }

    // 2. Pomodoro/Focus Stats
    const pomodoroStats = localStorage.getItem(STORAGE_KEYS.POMODORO_STATS);
    let focusHours = 0;
    let focusSessions = 0;
    let todaySessions = 0;

    if (pomodoroStats) {
      try {
        const stats = JSON.parse(pomodoroStats);
        focusSessions = stats.totalSessions || 0;
        focusHours = Math.round((stats.totalMinutes || 0) / 60 * 10) / 10;
        todaySessions = stats.todaySessions || 0;
      } catch (e) {
        // Fallback: calculate from sessions
        const sessions = localStorage.getItem(STORAGE_KEYS.POMODORO);
        if (sessions) {
          const parsed = JSON.parse(sessions);
          focusSessions = parsed.length || 0;
          focusHours = Math.round((focusSessions * 25) / 60 * 10) / 10;
        }
      }
    }

    // 3. Meal Stats
    const mealHistory = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
    const mealStreakData = localStorage.getItem(STORAGE_KEYS.MEAL_STREAK);
    let recipesTried = 0;
    let mealConsecutiveDays = 0;
    let totalMealsPlanned = 0;

    if (mealHistory) {
      try {
        const history = JSON.parse(mealHistory);
        const uniqueRecipes = new Set();
        history.forEach((day: any) => {
          if (day.dinner?.name) uniqueRecipes.add(day.dinner.name);
          if (day.lunch?.name) uniqueRecipes.add(day.lunch.name);
        });
        recipesTried = uniqueRecipes.size;
        totalMealsPlanned = history.length;
      } catch (e) {
        console.error('Error parsing meal history:', e);
      }
    }

    if (mealStreakData) {
      try {
        const streak = JSON.parse(mealStreakData);
        mealConsecutiveDays = streak.current || 0;
      } catch (e) {
        mealConsecutiveDays = 0;
      }
    }

    // 4. Life Quests Stats
    const lifeQuestsData = localStorage.getItem(STORAGE_KEYS.LIFE_QUESTS);
    let totalProgress = 0;
    let completedHabits = 0;
    let totalHabits = 0;

    if (lifeQuestsData) {
      try {
        const quests = JSON.parse(lifeQuestsData);
        totalHabits = quests.length;
        completedHabits = quests.filter((q: any) => q.progress >= q.target).length;
        const totalPercentage = quests.reduce((acc: number, q: any) => 
          acc + (q.progress / q.target) * 100, 0
        );
        totalProgress = totalHabits > 0 ? Math.round(totalPercentage / totalHabits) : 0;
      } catch (e) {
        // Use default quests
        const defaultQuests = [
          { id: '1', title: 'Fitness', category: 'Health', progress: 75, target: 100, unit: 'workouts' },
          { id: '2', title: 'Reading', category: 'Learning', progress: 12, target: 50, unit: 'books' },
          { id: '3', title: 'Coding', category: 'Career', progress: 180, target: 365, unit: 'days' },
          { id: '4', title: 'Meditation', category: 'Wellness', progress: 45, target: 100, unit: 'sessions' },
        ];
        totalHabits = defaultQuests.length;
        completedHabits = defaultQuests.filter((q: any) => q.progress >= q.target).length;
        const totalPercentage = defaultQuests.reduce((acc: number, q: any) => 
          acc + (q.progress / q.target) * 100, 0
        );
        totalProgress = Math.round(totalPercentage / totalHabits);
      }
    }

    // 5. GitHub Stats (fetch from API if integration enabled)
    let githubStats = { commitsThisWeek: 0, totalRepos: 0, totalStars: 0, username: profile.githubUsername };
    let repos: any[] = [];
    
    if (preferences.githubIntegration && profile.githubUsername) {
      try {
        const response = await fetch(`https://api.github.com/users/${profile.githubUsername}/repos?sort=updated&per_page=100`);
        if (response.ok) {
          repos = await response.json();
          githubStats.totalRepos = repos.length;
          githubStats.totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);
          
          // Try to get commits this week (approximate from repo activity)
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          // Fetch events for commit count
          const eventsResponse = await fetch(`https://api.github.com/users/${profile.githubUsername}/events/public?per_page=100`);
          if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            const pushEvents = events.filter((e: any) => 
              e.type === 'PushEvent' && 
              new Date(e.created_at) > oneWeekAgo
            );
            githubStats.commitsThisWeek = pushEvents.reduce((acc: number, e: any) => 
              acc + (e.payload?.commits?.length || 0), 0
            );
          }
        }
      } catch (e) {
        console.error('Error fetching GitHub stats:', e);
      }
    }

    setGithubRepos(repos.slice(0, 6));

    // Update stats
    setStats({
      tasks: { completed: tasksCompleted, total: tasksTotal, streakDays: taskStreak, byCategory: tasksByCategory },
      github: githubStats,
      meal: { recipesTried, consecutiveDays: mealConsecutiveDays, totalMealsPlanned },
      focus: { totalHours: focusHours, totalSessions: focusSessions, todaySessions },
      lifeQuests: { totalProgress, completedHabits, totalHabits },
    });

    // Generate achievements based on stats
    generateAchievements({
      tasksCompleted,
      focusSessions,
      recipesTried,
      mealStreak: mealConsecutiveDays,
      githubStars: githubStats.totalStars,
      githubCommits: githubStats.commitsThisWeek,
      lifeQuestProgress: totalProgress,
    });

    // Generate activity data for charts
    generateActivityData();
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const diffDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const generateAchievements = (data: {
    tasksCompleted: number;
    focusSessions: number;
    recipesTried: number;
    mealStreak: number;
    githubStars: number;
    githubCommits: number;
    lifeQuestProgress: number;
  }) => {
    const newAchievements: Achievement[] = [
      {
        id: 'task-10',
        icon: CheckSquare,
        label: 'Task Starter',
        description: 'Completa 10 task',
        color: 'emerald',
        unlocked: data.tasksCompleted >= 10,
        progress: Math.min(data.tasksCompleted, 10),
        target: 10,
      },
      {
        id: 'task-50',
        icon: CheckSquare,
        label: 'Task Master',
        description: 'Completa 50 task',
        color: 'emerald',
        unlocked: data.tasksCompleted >= 50,
        progress: Math.min(data.tasksCompleted, 50),
        target: 50,
      },
      {
        id: 'task-100',
        icon: CheckSquare,
        label: 'Task Legend',
        description: 'Completa 100 task',
        color: 'emerald',
        unlocked: data.tasksCompleted >= 100,
        progress: Math.min(data.tasksCompleted, 100),
        target: 100,
      },
      {
        id: 'focus-10',
        icon: Clock,
        label: 'Focus Beginner',
        description: '10 sessioni pomodoro',
        color: 'fuchsia',
        unlocked: data.focusSessions >= 10,
        progress: Math.min(data.focusSessions, 10),
        target: 10,
      },
      {
        id: 'focus-50',
        icon: Clock,
        label: 'Focus Pro',
        description: '50 sessioni pomodoro',
        color: 'fuchsia',
        unlocked: data.focusSessions >= 50,
        progress: Math.min(data.focusSessions, 50),
        target: 50,
      },
      {
        id: 'focus-100',
        icon: Clock,
        label: 'Focus Master',
        description: '100 sessioni pomodoro',
        color: 'fuchsia',
        unlocked: data.focusSessions >= 100,
        progress: Math.min(data.focusSessions, 100),
        target: 100,
      },
      {
        id: 'meal-7',
        icon: Utensils,
        label: 'Meal Planner',
        description: '7 giorni di meal plan',
        color: 'cyan',
        unlocked: data.mealStreak >= 7,
        progress: Math.min(data.mealStreak, 7),
        target: 7,
      },
      {
        id: 'meal-30',
        icon: Utensils,
        label: 'Chef Streak',
        description: '30 giorni di meal plan',
        color: 'cyan',
        unlocked: data.mealStreak >= 30,
        progress: Math.min(data.mealStreak, 30),
        target: 30,
      },
      {
        id: 'github-10',
        icon: Github,
        label: 'Code Contributor',
        description: '10 commits questa settimana',
        color: 'purple',
        unlocked: data.githubCommits >= 10,
        progress: Math.min(data.githubCommits, 10),
        target: 10,
      },
      {
        id: 'github-50',
        icon: Star,
        label: 'Rising Star',
        description: '50 stelle su GitHub',
        color: 'amber',
        unlocked: data.githubStars >= 50,
        progress: Math.min(data.githubStars, 50),
        target: 50,
      },
      {
        id: 'life-50',
        icon: Target,
        label: 'Life Balancer',
        description: '50% progresso life quests',
        color: 'violet',
        unlocked: data.lifeQuestProgress >= 50,
        progress: Math.min(data.lifeQuestProgress, 50),
        target: 50,
      },
      {
        id: 'life-100',
        icon: Award,
        label: 'Life Master',
        description: '100% progresso life quests',
        color: 'violet',
        unlocked: data.lifeQuestProgress >= 100,
        progress: Math.min(data.lifeQuestProgress, 100),
        target: 100,
      },
    ];

    setAchievements(newAchievements);
  };

  const generateActivityData = () => {
    // Generate last 30 days of activity
    const data: ActivityData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get real data from localStorage if available
      const dayData: ActivityData = {
        date: dateStr,
        tasks: 0,
        focus: 0,
        meal: false,
      };
      
      // Check activity log
      const activityLog = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
      if (activityLog) {
        try {
          const log = JSON.parse(activityLog);
          const dayLog = log[dateStr];
          if (dayLog) {
            dayData.tasks = dayLog.tasks || 0;
            dayData.focus = dayLog.focus || 0;
            dayData.meal = dayLog.meal || false;
          }
        } catch (e) {
          // Use generated fallback data
          dayData.tasks = Math.floor(Math.random() * 5);
          dayData.focus = Math.floor(Math.random() * 4);
          dayData.meal = Math.random() > 0.3;
        }
      } else {
        // Generate realistic fallback data
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        dayData.tasks = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 6) + 1;
        dayData.focus = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5) + 1;
        dayData.meal = Math.random() > 0.2;
      }
      
      data.push(dayData);
    }
    
    setActivityData(data);
  };

  // Handlers
  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(editedProfile));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(newPrefs));
  };

  const toggleNotification = () => {
    updatePreference('notifications', !preferences.notifications);
  };

  const toggleGithubIntegration = () => {
    updatePreference('githubIntegration', !preferences.githubIntegration);
  };

  const handleLogout = () => {
    if (confirm('Sei sicuro di voler effettuare il logout?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  // Calculate level based on total XP
  const calculateLevel = () => {
    const xp = stats.tasks.completed * 10 + 
               stats.focus.totalSessions * 5 + 
               stats.meal.recipesTried * 15 +
               stats.github.totalStars * 20;
    return Math.floor(xp / 100) + 1;
  };

  const level = calculateLevel();
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  // Color maps
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'from-emerald-500/20 to-teal-600/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    fuchsia: { bg: 'from-fuchsia-500/20 to-purple-600/20', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
    cyan: { bg: 'from-cyan-500/20 to-blue-600/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    amber: { bg: 'from-amber-500/20 to-orange-600/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    purple: { bg: 'from-purple-500/20 to-violet-600/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    violet: { bg: 'from-violet-500/20 to-indigo-600/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  };

  // Chart data preparation
  const last7Days = activityData.slice(-7);
  const maxTasks = Math.max(...last7Days.map(d => d.tasks), 1);
  const maxFocus = Math.max(...last7Days.map(d => d.focus), 1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-white/70">Caricamento profilo...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <User className="w-6 h-6 text-fuchsia-400" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Profilo
              </h1>
              <p className="text-sm text-white/50 mt-1">
                Gestisci il tuo account e visualizza le statistiche
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-glass px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Profile Card */}
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-cyan-500 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-2xl shadow-fuchsia-500/30">
                  {userProfile.avatar}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Camera className="w-5 h-5 text-white/70" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Nome</label>
                        <input
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="input-glass w-full px-4 py-2 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                          className="input-glass w-full px-4 py-2 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Ruolo</label>
                        <input
                          type="text"
                          value={editedProfile.role}
                          onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                          className="input-glass w-full px-4 py-2 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">GitHub Username</label>
                        <input
                          type="text"
                          value={editedProfile.githubUsername}
                          onChange={(e) => setEditedProfile({ ...editedProfile, githubUsername: e.target.value })}
                          className="input-glass w-full px-4 py-2 rounded-xl text-sm text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Bio</label>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        rows={2}
                        className="input-glass w-full px-4 py-2 rounded-xl text-sm text-white resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="btn-primary-glow px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium text-white"
                      >
                        <Save className="w-4 h-4" />
                        Salva
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium text-white/70"
                      >
                        <X className="w-4 h-4" />
                        Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 text-white/50">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{userProfile.email}</span>
                      </div>
                      {userProfile.githubUsername && (
                        <div className="flex items-center gap-2 text-white/50">
                          <Github className="w-4 h-4" />
                          <span className="text-sm">@{userProfile.githubUsername}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-fuchsia px-3 py-1 rounded-full text-xs font-medium">
                        {userProfile.role}
                      </span>
                      {userProfile.location && (
                        <span className="badge-glass px-3 py-1 rounded-full text-xs text-white/70">
                          {userProfile.location}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-white/60 max-w-xl">
                      {userProfile.bio}
                    </p>
                  </>
                )}
              </div>
              
              {/* Level Badge */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex flex-col items-center justify-center relative">
                  <Award className="w-8 h-8 text-amber-400 mb-1" />
                  <span className="text-3xl font-bold text-amber-400">{level}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {unlockedAchievements}
                  </div>
                </div>
                <span className="text-xs text-white/40 mt-2">Level {level}</span>
                <span className="text-xs text-white/30">{unlockedAchievements}/{totalAchievements} achievements</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Tasks Stats */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs text-white/50">Tasks</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.tasks.completed}</div>
              <div className="text-xs text-white/40">di {stats.tasks.total} completate</div>
              <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                <Flame className="w-3 h-3" />
                <span>Streak: {stats.tasks.streakDays} giorni</span>
              </div>
            </div>
            
            {/* GitHub Stats */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-600/20 flex items-center justify-center">
                  <Github className="w-5 h-5 text-white/70" />
                </div>
                <span className="text-xs text-white/50">GitHub</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.github.commitsThisWeek}</div>
              <div className="text-xs text-white/40">commits questa settimana</div>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3 h-3" />
                  {stats.github.totalStars}
                </span>
                <span className="text-white/40">
                  {stats.github.totalRepos} repos
                </span>
              </div>
            </div>
            
            {/* Meal Stats */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-xs text-white/50">Meal</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.meal.recipesTried}</div>
              <div className="text-xs text-white/40">ricette provate</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-400">
                <Calendar className="w-3 h-3" />
                <span>{stats.meal.consecutiveDays} giorni consecutivi</span>
              </div>
            </div>
            
            {/* Focus Stats */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-fuchsia-400" />
                </div>
                <span className="text-xs text-white/50">Focus</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.focus.totalHours}</div>
              <div className="text-xs text-white/40">ore totali</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-fuchsia-400">
                <Zap className="w-3 h-3" />
                <span>{stats.focus.totalSessions} sessioni</span>
              </div>
            </div>
            
            {/* Life Quests Stats */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-xs text-white/50">Life Quests</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.lifeQuests.totalProgress}%</div>
              <div className="text-xs text-white/40">progresso medio</div>
              <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full"
                  style={{ width: `${stats.lifeQuests.totalProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <div className="glass-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-fuchsia-400" />
                  <h3 className="font-semibold text-white">Attività Ultimi 7 Giorni</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    Task
                  </span>
                  <span className="flex items-center gap-1 text-fuchsia-400">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
                    Focus
                  </span>
                </div>
              </div>
              
              <div className="h-48 flex items-end gap-2">
                {last7Days.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('it-IT', { weekday: 'short' });
                  const taskHeight = maxTasks > 0 ? (day.tasks / maxTasks) * 100 : 0;
                  const focusHeight = maxFocus > 0 ? (day.focus / maxFocus) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end gap-1 h-36">
                        {/* Task bar */}
                        <div 
                          className="flex-1 bg-gradient-to-t from-emerald-500/60 to-emerald-400/30 rounded-t-lg transition-all duration-500"
                          style={{ height: `${taskHeight}%` }}
                          title={`${day.tasks} task`}
                        />
                        {/* Focus bar */}
                        <div 
                          className="flex-1 bg-gradient-to-t from-fuchsia-500/60 to-fuchsia-400/30 rounded-t-lg transition-all duration-500"
                          style={{ height: `${focusHeight}%` }}
                          title={`${day.focus} sessioni`}
                        />
                      </div>
                      <span className="text-xs text-white/40 capitalize">{dayName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Distribution */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <PieChart className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Distribuzione Task</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(stats.tasks.byCategory).map(([category, count]) => {
                  const total = stats.tasks.total || 1;
                  const percentage = Math.round((count / total) * 100);
                  const colors: Record<string, string> = {
                    high: 'from-red-500 to-red-400',
                    medium: 'from-amber-500 to-amber-400',
                    low: 'from-emerald-500 to-emerald-400',
                  };
                  const color = colors[category] || 'from-fuchsia-500 to-fuchsia-400';
                  const labels: Record<string, string> = {
                    high: 'Alta priorità',
                    medium: 'Media priorità',
                    low: 'Bassa priorità',
                  };
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/70">{labels[category] || category}</span>
                        <span className="text-sm text-white/50">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${color} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                
                {Object.keys(stats.tasks.byCategory).length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nessun dato disponibile</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Achievement</h3>
              </div>
              <span className="text-sm text-white/50">
                {unlockedAchievements}/{totalAchievements} sbloccati
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const colors = colorMap[achievement.color];
                
                return (
                  <div 
                    key={achievement.id}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-2`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="text-sm font-medium text-white truncate">{achievement.label}</div>
                    <div className="text-xs text-white/40 truncate">{achievement.description}</div>
                    
                    {/* Progress bar for locked achievements */}
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.target && (
                      <div className="mt-2">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${colors.bg.replace('/20', '').replace('to-', 'to-')}`}
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-white/30 mt-1">
                          {achievement.progress}/{achievement.target}
                        </div>
                      </div>
                    )}
                    
                    {achievement.unlocked && (
                      <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                        <CheckSquare className="w-3 h-3" />
                        Sbloccato
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* GitHub Repos */}
          {preferences.githubIntegration && githubRepos.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-white/70" />
                  <h3 className="font-semibold text-white">Repository GitHub</h3>
                </div>
                <a 
                  href={`https://github.com/${userProfile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
                >
                  Vedi profilo
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {githubRepos.slice(0, 6).map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-white group-hover:text-fuchsia-400 transition-colors truncate">
                        {repo.name}
                      </span>
                      {repo.language && (
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 line-clamp-2 mb-3">
                      {repo.description || 'Nessuna descrizione'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              Preferenze
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Theme */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Tema</div>
                    <div className="text-xs text-white/40">
                      {preferences.theme === 'dark' ? 'Dark mode' : preferences.theme === 'light' ? 'Light mode' : 'Automatico'}
                    </div>
                  </div>
                </div>
                <select
                  value={preferences.theme}
                  onChange={(e) => updatePreference('theme', e.target.value as 'dark' | 'light' | 'auto')}
                  className="input-glass px-3 py-2 rounded-lg text-sm text-white/70 cursor-pointer"
                >
                  <option value="dark" className="bg-gray-900">Dark</option>
                  <option value="light" className="bg-gray-900">Light</option>
                  <option value="auto" className="bg-gray-900">Auto</option>
                </select>
              </div>
              
              {/* Notifications */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Notifiche</div>
                    <div className="text-xs text-white/40">Task e reminder</div>
                  </div>
                </div>
                <button
                  onClick={toggleNotification}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    preferences.notifications ? 'bg-fuchsia-500' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.notifications ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
              
              {/* Language */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Lingua</div>
                    <div className="text-xs text-white/40">
                      {preferences.language === 'it' ? 'Italiano' : 'English'}
                    </div>
                  </div>
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreference('language', e.target.value as 'it' | 'en')}
                  className="input-glass px-3 py-2 rounded-lg text-sm text-white/70 cursor-pointer"
                >
                  <option value="it" className="bg-gray-900">Italiano</option>
                  <option value="en" className="bg-gray-900">English</option>
                </select>
              </div>
              
              {/* GitHub Integration */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-600/20 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Integrazione GitHub</div>
                    <div className="text-xs text-white/40">Sincronizza dati repository</div>
                  </div>
                </div>
                <button
                  onClick={toggleGithubIntegration}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    preferences.githubIntegration ? 'bg-fuchsia-500' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.githubIntegration ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="glass-card p-5 border-red-500/20">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Gestione Dati
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (confirm('Esportare tutti i dati?')) {
                    const data = {
                      profile: localStorage.getItem(STORAGE_KEYS.USER_PROFILE),
                      preferences: localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES),
                      tasks: localStorage.getItem(STORAGE_KEYS.TASKS),
                      pomodoro: localStorage.getItem(STORAGE_KEYS.POMODORO),
                      meal: localStorage.getItem(STORAGE_KEYS.MEAL_PLAN),
                      lifeQuests: localStorage.getItem(STORAGE_KEYS.LIFE_QUESTS),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }
                }}
                className="btn-glass px-4 py-2 rounded-xl text-sm text-white/70 hover:text-white"
              >
                Esporta Dati
              </button>
              
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const data = JSON.parse(event.target?.result as string);
                          Object.entries(data).forEach(([key, value]) => {
                            if (value) localStorage.setItem(`dashboard_${key}`, value as string);
                          });
                          alert('Dati importati con successo!');
                          window.location.reload();
                        } catch (err) {
                          alert('Errore nell\'importazione dei dati');
                        }
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="btn-glass px-4 py-2 rounded-xl text-sm text-white/70 hover:text-white"
              >
                Importa Dati
              </button>
              
              <button
                onClick={() => {
                  if (confirm('ATTENZIONE: Questo cancellerà TUTTI i dati. Sei sicuro?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="btn-glass px-4 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Cancella Tutti i Dati
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

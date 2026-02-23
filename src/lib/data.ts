import { RocketbookNote, LifeQuest, GitHubProject, AINewsItem, WeatherData, LifeQuestHabit } from '@/lib/types';
import { fetchRealAINews } from '@/lib/ai-news';

// Life Quests Habits Configuration
export const lifeQuestHabits: LifeQuestHabit[] = [
  {
    id: 'pushups',
    name: 'Pushups',
    time: '07:00',
    days: [1, 2, 3, 4, 5, 6], // Monday-Saturday
    category: 'fitness',
    duration: '15 min',
    description: 'Morning strength routine',
  },
  {
    id: 'ted-talk',
    name: 'Ted Talk',
    time: '08:00',
    days: [1, 2, 3, 4, 5], // Weekdays
    category: 'learning',
    duration: '20 min',
    description: 'Daily inspiration & knowledge',
  },
  {
    id: 'check-notes',
    name: 'Check Notes',
    time: '09:00',
    days: [1, 2, 3, 4, 5], // Weekdays
    category: 'work',
    duration: '10 min',
    description: 'Review Rocketbook & daily tasks',
  },
  {
    id: 'side-job-1h',
    name: 'Side Job',
    time: '14:00',
    days: [1, 3, 5], // Mon, Wed, Fri
    category: 'work',
    duration: '1 hour',
    description: 'Autoblogger / Bookingolf / Personal projects',
  },
  {
    id: 'side-job-2h',
    name: 'Side Job (Deep Work)',
    time: '14:00',
    days: [2, 4], // Tue, Thu
    category: 'work',
    duration: '2 hours',
    description: 'Autoblogger / Bookingolf / Personal projects',
  },
  {
    id: 'storytelling',
    name: 'Storytell',
    time: '21:00',
    days: [0, 1, 2, 3, 4, 5, 6], // Daily
    category: 'creative',
    duration: '30 min',
    description: 'Writing, content creation, narrative practice',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    time: '07:00',
    days: [0, 3], // Sunday, Wednesday
    category: 'wellness',
    duration: '30 min',
    description: 'Flexibility & mindfulness practice',
  },
  {
    id: 'reading',
    name: 'Leggere',
    time: '22:00',
    days: [0, 2, 4, 6], // Sun, Tue, Thu, Sat
    category: 'learning',
    duration: '30 min',
    description: 'Book reading session',
  },
  {
    id: 'brilliant',
    name: 'Brilliant',
    time: '10:00',
    days: [0], // Sunday only
    category: 'learning',
    duration: '45 min',
    description: 'Interactive math & science learning',
  },
];

export async function getRocketbookNotes(): Promise<RocketbookNote[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/data/rocketbook_notes.json`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('Failed to load notes');
    return await response.json();
  } catch {
    // Return sample data if file doesn't exist
    return [
      {
        title: 'Rocketbook Scan - 2026-02-17',
        date: '17 Feb 2026',
        pdfUrl: '#',
        tags: ['Rocketbook', 'Scan'],
        preview: 'Note recenti...',
      },
    ];
  }
}

export async function getLifeQuests(): Promise<LifeQuest[]> {
  // Sample data - in production this would come from a database
  return [
    { id: '1', title: 'Fitness', category: 'Health', progress: 75, target: 100, unit: 'workouts' },
    { id: '2', title: 'Reading', category: 'Learning', progress: 12, target: 50, unit: 'books' },
    { id: '3', title: 'Coding', category: 'Career', progress: 180, target: 365, unit: 'days' },
    { id: '4', title: 'Meditation', category: 'Wellness', progress: 45, target: 100, unit: 'sessions' },
  ];
}

export async function getGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const response = await fetch('https://api.github.com/users/anselmomeshack/repos?sort=updated&per_page=6', {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('GitHub API error');
    const repos = await response.json();
    
    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description || 'No description',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'N/A',
      updatedAt: repo.updated_at,
      url: repo.html_url,
    }));
  } catch {
    return [
      { name: 'daily-brief', description: 'Dashboard personale', stars: 5, forks: 1, language: 'TypeScript', updatedAt: new Date().toISOString(), url: '#' },
    ];
  }
}

export async function getAINews(): Promise<AINewsItem[]> {
  // Fetch real AI news from HackerNews
  return fetchRealAINews();
}

export async function getWeatherData(): Promise<WeatherData> {
  // Return sample data - in production this would call the weather API
  return {
    temp: 15,
    condition: 'Parzialmente nuvoloso',
    humidity: 65,
    wind: 8,
    icon: '⛅',
  };
}

// Get habits scheduled for a specific day
export function getHabitsForDay(date: Date = new Date()): LifeQuestHabit[] {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  return lifeQuestHabits.filter(habit => habit.days.includes(dayOfWeek));
}

// Get habits for today formatted for display
export function getTodaysSchedule(date: Date = new Date()): { time: string; name: string; category: string; duration: string }[] {
  const habits = getHabitsForDay(date);
  return habits
    .sort((a, b) => a.time.localeCompare(b.time))
    .map(habit => ({
      time: habit.time,
      name: habit.name,
      category: habit.category,
      duration: habit.duration || '15 min',
    }));
}

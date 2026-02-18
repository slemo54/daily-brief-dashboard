import { RocketbookNote, LifeQuest, GitHubProject, AINewsItem, WeatherData } from '@/lib/types';

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
  // Sample AI news - in production this would come from an API
  return [
    {
      title: 'OpenAI rilascia GPT-5',
      source: 'TechCrunch',
      url: '#',
      summary: 'Nuovo modello con capacità avanzate di ragionamento',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Google DeepMind annuncia nuovo breakthrough',
      source: 'The Verge',
      url: '#',
      summary: 'Progressi significativi nella ricerca scientifica',
      publishedAt: new Date().toISOString(),
    },
  ];
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

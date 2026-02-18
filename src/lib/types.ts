export interface RocketbookNote {
  title: string;
  date: string;
  pdfUrl: string;
  tags: string[];
  preview: string;
}

export interface LifeQuest {
  id: string;
  title: string;
  category: string;
  progress: number;
  target: number;
  unit: string;
  deadline?: string;
}

export interface GitHubProject {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  url: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
}

export interface AINewsItem {
  title: string;
  source: string;
  url: string;
  summary: string;
  publishedAt: string;
}

export interface WorldClock {
  city: string;
  timezone: string;
  offset: string;
}

export interface CountdownEvent {
  name: string;
  date: string;
  emoji: string;
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Code2,
  AlertCircle,
  GitPullRequest,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Loader2,
  RefreshCw,
  User,
  X,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

// Types
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
  default_branch: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  closed_at: string | null;
  user: { login: string; avatar_url: string };
  labels: { name: string; color: string }[];
}

interface GitHubPR {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  merged: boolean;
  html_url: string;
  created_at: string;
  user: { login: string; avatar_url: string };
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface LanguageStat {
  name: string;
  bytes: number;
  color: string;
}

interface RepoDetails {
  repo: GitHubRepo;
  issues: { open: number; closed: number };
  pullRequests: { open: number; merged: number };
  languages: LanguageStat[];
}

// Configuration
const GITHUB_USERNAME = 'slemo54';
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';
const CACHE_KEY = 'github_projects_cache';
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

// Language colors mapping
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Swift: '#ffac45',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#239120',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Scala: '#c22d40',
  R: '#198CE7',
  Julia: '#a270ba',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  Perl: '#0298c3',
  PowerShell: '#012456',
  'Objective-C': '#438eff',
  Clojure: '#db5855',
  CoffeeScript: '#244776',
  Erlang: '#b83998',
  Groovy: '#e69f56',
  OCaml: '#3be133',
  F: '#b845fc',
  'F#': '#b845fc',
  WebAssembly: '#04133b',
  Markdown: '#083fa1',
  JSON: '#292929',
  YAML: '#cb171e',
  Dockerfile: '#384d54',
  'Jupyter Notebook': '#DA5B0B',
};

const contributionColors = [
  'bg-white/5',
  'bg-emerald-500/20',
  'bg-emerald-500/40',
  'bg-emerald-500/60',
  'bg-emerald-500',
];

// API Helper
async function fetchGitHub<T>(endpoint: string, token: string): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Dashboard',
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');
      if (rateLimitRemaining === '0' && rateLimitReset) {
        const resetDate = new Date(parseInt(rateLimitReset) * 1000);
        throw new Error(`Rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`);
      }
    }
    if (response.status === 401) {
      throw new Error('Invalid GitHub token. Please check your configuration.');
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Generate empty contributions grid (fallback)
function generateEmptyContributions(): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  const today = new Date();
  
  for (let w = 0; w < 52; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - ((51 - w) * 7 + (6 - d)));
      week.push({
        date: date.toISOString().split('T')[0],
        count: 0,
        level: 0,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

// Parse contributions from GitHub GraphQL response (if available)
function parseContributions(data: unknown): ContributionDay[][] {
  if (!data || typeof data !== 'object') {
    return generateEmptyContributions();
  }

  const userData = data as Record<string, unknown>;
  const user = userData.user as Record<string, unknown> | undefined;
  if (!user) return generateEmptyContributions();

  const contributions = user.contributionsCollection as Record<string, unknown> | undefined;
  if (!contributions) return generateEmptyContributions();

  const contributionCalendar = contributions.contributionCalendar as Record<string, unknown> | undefined;
  if (!contributionCalendar) return generateEmptyContributions();

  const weeks = contributionCalendar.weeks as Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> | undefined;
  if (!weeks) return generateEmptyContributions();

  return weeks.map(week => 
    week.contributionDays.map(day => {
      const count = day.contributionCount;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 30) level = 4;
      else if (count >= 20) level = 3;
      else if (count >= 10) level = 2;
      else if (count > 0) level = 1;
      
      return {
        date: day.date,
        count,
        level,
      };
    })
  );
}

export default function ProjectsPage() {
  // State
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repoDetails, setRepoDetails] = useState<Map<number, RepoDetails>>(new Map());
  const [contributions, setContributions] = useState<ContributionDay[][]>([]);
  const [languageStats, setLanguageStats] = useState<Map<string, number>>(new Map());
  
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name' | 'created'>('updated');
  const [minStars, setMinStars] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  // Cache functions
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          setRepos(data.repos || []);
          setUser(data.user || null);
          setContributions(data.contributions || []);
          setLanguageStats(new Map(data.languageStats || []));
          setRepoDetails(new Map(data.repoDetails || []));
          setLastUpdated(new Date(data.timestamp));
          return true;
        }
      }
    } catch {
      // Ignore cache errors
    }
    return false;
  }, []);

  const saveToCache = useCallback((data: {
    repos: GitHubRepo[];
    user: GitHubUser | null;
    contributions: ContributionDay[][];
    languageStats: Map<string, number>;
    repoDetails: Map<number, RepoDetails>;
  }) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        ...data,
        languageStats: Array.from(data.languageStats.entries()),
        repoDetails: Array.from(data.repoDetails.entries()),
        timestamp: Date.now(),
      }));
      setLastUpdated(new Date());
    } catch {
      // Ignore cache errors
    }
  }, []);

  // Fetch contributions using GraphQL API
  const fetchContributions = async (token: string): Promise<ContributionDay[][]> => {
    const query = `
      query {
        user(login: "${GITHUB_USERNAME}") {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        return generateEmptyContributions();
      }

      const data = await response.json();
      if (data.errors) {
        return generateEmptyContributions();
      }

      return parseContributions(data.data);
    } catch {
      return generateEmptyContributions();
    }
  };

  // Fetch repo languages
  const fetchRepoLanguages = async (repoName: string, token: string): Promise<LanguageStat[]> => {
    try {
      const data = await fetchGitHub<Record<string, number>>(`/repos/${GITHUB_USERNAME}/${repoName}/languages`, token);
      return Object.entries(data).map(([name, bytes]) => ({
        name,
        bytes,
        color: languageColors[name] || '#8b949e',
      })).sort((a, b) => b.bytes - a.bytes);
    } catch {
      return [];
    }
  };

  // Fetch repo issues count
  const fetchRepoIssues = async (repoName: string, token: string): Promise<{ open: number; closed: number }> => {
    try {
      const [openIssues, closedIssues] = await Promise.all([
        fetchGitHub<{ total_count: number }>(`/search/issues?q=repo:${GITHUB_USERNAME}/${repoName}+type:issue+state:open&per_page=1`, token),
        fetchGitHub<{ total_count: number }>(`/search/issues?q=repo:${GITHUB_USERNAME}/${repoName}+type:issue+state:closed&per_page=1`, token),
      ]);
      return {
        open: openIssues.total_count,
        closed: closedIssues.total_count,
      };
    } catch {
      return { open: 0, closed: 0 };
    }
  };

  // Fetch repo pull requests
  const fetchRepoPRs = async (repoName: string, token: string): Promise<{ open: number; merged: number }> => {
    try {
      const [openPRs, mergedPRs] = await Promise.all([
        fetchGitHub<{ total_count: number }>(`/search/issues?q=repo:${GITHUB_USERNAME}/${repoName}+type:pr+state:open&per_page=1`, token),
        fetchGitHub<{ total_count: number }>(`/search/issues?q=repo:${GITHUB_USERNAME}/${repoName}+type:pr+state:closed+is:merged&per_page=1`, token),
      ]);
      return {
        open: openPRs.total_count,
        merged: mergedPRs.total_count,
      };
    } catch {
      return { open: 0, merged: 0 };
    }
  };

  // Main fetch function
  const fetchGitHubData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && loadFromCache()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = GITHUB_TOKEN;
      if (!token) {
        throw new Error('GitHub token not configured. Please set NEXT_PUBLIC_GITHUB_TOKEN.');
      }

      // Fetch user and repos in parallel
      const [userData, reposData] = await Promise.all([
        fetchGitHub<GitHubUser>(`/users/${GITHUB_USERNAME}`, token),
        fetchGitHub<GitHubRepo[]>(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&direction=desc`, token),
      ]);

      setUser(userData);
      setRepos(reposData);

      // Fetch contributions
      const contributionsData = await fetchContributions(token);
      setContributions(contributionsData);

      // Calculate language stats
      const langStats = new Map<string, number>();
      
      // Fetch detailed data for each repo (limited to first 10 for performance)
      const detailsMap = new Map<number, RepoDetails>();
      const reposToFetch = reposData.slice(0, 10);
      
      setLoadingDetails(true);
      
      await Promise.all(
        reposToFetch.map(async (repo) => {
          const [languages, issues, pullRequests] = await Promise.all([
            fetchRepoLanguages(repo.name, token),
            fetchRepoIssues(repo.name, token),
            fetchRepoPRs(repo.name, token),
          ]);

          // Aggregate language stats
          languages.forEach(lang => {
            const current = langStats.get(lang.name) || 0;
            langStats.set(lang.name, current + lang.bytes);
          });

          detailsMap.set(repo.id, {
            repo,
            issues,
            pullRequests,
            languages,
          });
        })
      );

      setLanguageStats(langStats);
      setRepoDetails(detailsMap);
      setLoadingDetails(false);

      // Save to cache
      saveToCache({
        repos: reposData,
        user: userData,
        contributions: contributionsData,
        languageStats: langStats,
        repoDetails: detailsMap,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [loadFromCache, saveToCache]);

  // Initial load
  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  // Filtered and sorted repos
  const filteredRepos = repos
    .filter(repo => {
      const matchesSearch = 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        repo.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLanguage = languageFilter === 'all' || repo.language === languageFilter;
      const matchesStars = repo.stargazers_count >= minStars;
      
      return matchesSearch && matchesLanguage && matchesStars;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'updated':
          return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Get unique languages
  const languages = Array.from(new Set(repos.map(r => r.language).filter(Boolean))).sort();

  // Calculate totals
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const totalIssues = repos.reduce((sum, r) => sum + r.open_issues_count, 0);
  const totalContributions = contributions.flat().reduce((sum, day) => sum + day.count, 0);

  // Calculate language percentages
  const totalBytes = Array.from(languageStats.values()).reduce((sum, bytes) => sum + bytes, 0);
  const languagePercentages = Array.from(languageStats.entries())
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
      color: languageColors[name] || '#8b949e',
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Oggi';
    if (days === 1) return 'Ieri';
    if (days < 7) return `${days} giorni fa`;
    if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
    if (days < 365) return `${Math.floor(days / 30)} mesi fa`;
    return date.toLocaleDateString('it-IT');
  };

  // Get repo details
  const getRepoDetails = (repoId: number): RepoDetails | undefined => {
    return repoDetails.get(repoId);
  };

  if (loading && repos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Loader2 className="w-12 h-12 text-fuchsia-400 animate-spin mx-auto mb-4" />
          <p className="text-white/70">Caricamento repository...</p>
        </div>
      </div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white/70 mb-2">Errore nel caricamento</p>
          <p className="text-sm text-white/50 mb-4">{error}</p>
          <button 
            onClick={() => fetchGitHubData(true)}
            className="btn-primary-glow px-4 py-2 rounded-xl flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Riprova
          </button>
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
              <Github className="w-6 h-6 text-white/70" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                GitHub Projects
              </h1>
              <p className="text-sm text-white/50 mt-1">
                @{user?.login || GITHUB_USERNAME} • {repos.length} repositories pubblici
                {lastUpdated && (
                  <span className="ml-2 text-white/30">
                    • Aggiornato {formatDate(lastUpdated.toISOString())}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchGitHubData(true)}
              disabled={loading}
              className="btn-glass p-2.5 rounded-xl disabled:opacity-50"
              title="Aggiorna"
            >
              <RefreshCw className={`w-4 h-4 text-white/70 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a 
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary-glow px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Profilo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        {/* Error Banner */}
        {error && (
          <div className="glass-card p-4 mb-6 border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-white/70 flex-1">{error}</p>
              <button 
                onClick={() => fetchGitHubData(true)}
                className="text-sm text-fuchsia-400 hover:text-fuchsia-300"
              >
                Riprova
              </button>
            </div>
          </div>
        )}

        {/* User Profile Card */}
        {user && (
          <div className="glass-card p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img 
                src={user.avatar_url} 
                alt={user.login}
                className="w-16 h-16 rounded-full border-2 border-fuchsia-500/30"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">{user.login}</h2>
                <p className="text-sm text-white/50">{user.bio || 'Developer & Creator'}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {user.followers} followers
                  </span>
                  <span>{user.following} following</span>
                  <span>•</span>
                  <span>Membro dal {new Date(user.created_at).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalStars}</div>
                <div className="text-xs text-white/50">Stars totali</div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                <GitFork className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalForks}</div>
                <div className="text-xs text-white/50">Forks</div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalIssues}</div>
                <div className="text-xs text-white/50">Issues aperti</div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalContributions}</div>
                <div className="text-xs text-white/50">Contributi (anno)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-white/70">Contributions (ultimo anno)</span>
            </div>
            <span className="text-sm text-emerald-400 font-medium">{totalContributions} contributi</span>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <div className="flex gap-[3px] min-w-max py-2">
              {contributions.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dIndex) => (
                    <div
                      key={dIndex}
                      className={`w-[10px] h-[10px] rounded-sm ${contributionColors[day.level]} transition-all hover:ring-2 hover:ring-white/30 cursor-pointer`}
                      title={`${day.date}: ${day.count} contributi`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-xs text-white/40">
            <span>Meno</span>
            {contributionColors.map((color, i) => (
              <div key={i} className={`w-[10px] h-[10px] rounded-sm ${color}`} />
            ))}
            <span>Più</span>
          </div>
        </div>

        {/* Language Distribution */}
        {languagePercentages.length > 0 && (
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-fuchsia-400" />
              <span className="text-sm font-medium text-white/70">Linguaggi utilizzati</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 rounded-full overflow-hidden flex mb-4">
              {languagePercentages.map((lang, i) => (
                <div
                  key={lang.name}
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                  title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                />
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {languagePercentages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-xs text-white/70">
                    {lang.name} <span className="text-white/40">({lang.percentage.toFixed(1)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Cerca repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-3 h-3 text-white/50" />
                  </button>
                )}
              </div>
              
              {/* Quick filters */}
              <div className="flex gap-2">
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="input-glass px-4 py-2.5 rounded-xl text-sm text-white/70 cursor-pointer min-w-[140px]"
                >
                  <option value="all" className="bg-gray-900">Tutti i linguaggi</option>
                  {languages.filter((l): l is string => l !== null).map(lang => (
                    <option key={lang} value={lang} className="bg-gray-900">{lang}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="input-glass px-4 py-2.5 rounded-xl text-sm text-white/70 cursor-pointer min-w-[140px]"
                >
                  <option value="updated" className="bg-gray-900">Più recenti</option>
                  <option value="stars" className="bg-gray-900">Più stellati</option>
                  <option value="created" className="bg-gray-900">Data creazione</option>
                  <option value="name" className="bg-gray-900">Nome (A-Z)</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn-glass px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm ${showFilters ? 'bg-fuchsia-500/20 border-fuchsia-500/40' : ''}`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtri</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* Extended filters */}
            {showFilters && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/50">Minimo stelle:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={minStars}
                    onChange={(e) => setMinStars(parseInt(e.target.value))}
                    className="w-32 accent-fuchsia-500"
                  />
                  <span className="text-sm text-white/70 min-w-[3ch]">{minStars}</span>
                </div>
                
                {(searchQuery || languageFilter !== 'all' || minStars > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setLanguageFilter('all');
                      setMinStars(0);
                    }}
                    className="text-sm text-fuchsia-400 hover:text-fuchsia-300 ml-auto"
                  >
                    Resetta filtri
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm text-white/50">
              {filteredRepos.length} repository trovati
            </span>
            {loadingDetails && (
              <span className="text-xs text-white/40 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Caricamento dettagli...
              </span>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => {
            const details = getRepoDetails(repo.id);
            const langColor = languageColors[repo.language || ''] || '#8b949e';
            
            return (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 group hover:border-white/20 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Code2 className="w-5 h-5 text-white/50 flex-shrink-0" />
                    <h3 className="font-semibold text-white group-hover:text-fuchsia-400 transition-colors truncate">
                      {repo.name}
                    </h3>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ml-2" />
                </div>
                
                {/* Description */}
                <p className="text-sm text-white/50 mb-4 line-clamp-2">
                  {repo.description || 'Nessuna descrizione disponibile'}
                </p>
                
                {/* Topics */}
                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {repo.topics.slice(0, 4).map(topic => (
                      <span 
                        key={topic}
                        className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-white/50 border border-white/10"
                      >
                        {topic}
                      </span>
                    ))}
                    {repo.topics.length > 4 && (
                      <span className="px-2 py-0.5 text-[10px] text-white/30">
                        +{repo.topics.length - 4}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs mb-4">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-white/60">{repo.language}</span>
                    </span>
                  )}
                  
                  <span className="flex items-center gap-1 text-white/40">
                    <Star className="w-3.5 h-3.5" />
                    {repo.stargazers_count}
                  </span>
                  
                  <span className="flex items-center gap-1 text-white/40">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks_count}
                  </span>
                  
                  {details ? (
                    <>
                      {details.issues.open > 0 && (
                        <span className="flex items-center gap-1 text-red-400/70">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {details.issues.open}
                        </span>
                      )}
                      {details.pullRequests.open > 0 && (
                        <span className="flex items-center gap-1 text-cyan-400/70">
                          <GitPullRequest className="w-3.5 h-3.5" />
                          {details.pullRequests.open}
                        </span>
                      )}
                    </>
                  ) : (
                    repo.open_issues_count > 0 && (
                      <span className="flex items-center gap-1 text-red-400/70">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {repo.open_issues_count}
                      </span>
                    )
                  )}
                  
                  <span className="flex items-center gap-1 text-white/30 ml-auto">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(repo.pushed_at)}
                  </span>
                </div>
                
                {/* Detailed stats if available */}
                {details && (
                  <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-white/30 mb-1">Issues</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {details.issues.open}
                        </span>
                        <span className="text-xs text-white/20">|</span>
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {details.issues.closed}
                        </span>
                      </div>
                    </div>
                    <div className="text-center border-x border-white/5">
                      <div className="text-xs text-white/30 mb-1">Pull Requests</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-cyan-400 flex items-center gap-1">
                          <GitPullRequest className="w-3 h-3" />
                          {details.pullRequests.open}
                        </span>
                        <span className="text-xs text-white/20">|</span>
                        <span className="text-xs text-purple-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {details.pullRequests.merged}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/30 mb-1">Linguaggi</div>
                      <div className="flex items-center justify-center gap-1">
                        {details.languages.slice(0, 3).map(lang => (
                          <div
                            key={lang.name}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: lang.color }}
                            title={lang.name}
                          />
                        ))}
                        {details.languages.length > 3 && (
                          <span className="text-[10px] text-white/40">+{details.languages.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Homepage link */}
                {repo.homepage && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <a 
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Demo live
                    </a>
                  </div>
                )}
              </a>
            );
          })}
        </div>
        
        {/* Empty state */}
        {filteredRepos.length === 0 && (
          <div className="text-center py-12 glass-card">
            <Github className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 mb-2">Nessun repository trovato</p>
            <p className="text-sm text-white/30">Prova a modificare i filtri di ricerca</p>
          </div>
        )}
      </main>
    </div>
  );
}

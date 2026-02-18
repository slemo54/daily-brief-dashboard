import {
  WeatherWidget,
  PomodoroWidget,
  QuickNotesWidget,
  WorldClockWidget,
  CountdownWidget,
  LifeQuestsWidget,
  GitHubWidget,
  AINewsWidget,
  TaskPrioritiesWidget,
  RocketbookWidget,
} from '@/components/widgets';
import { getWeatherData, getLifeQuests, getGitHubProjects, getAINews, getRocketbookNotes } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [weather, lifeQuests, githubProjects, aiNews, rocketbookNotes] = await Promise.all([
    getWeatherData(),
    getLifeQuests(),
    getGitHubProjects(),
    getAINews(),
    getRocketbookNotes(),
  ]);

  const today = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Anselmo&apos;s Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">{today}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Weather - spans 1 column */}
          <WeatherWidget weather={weather} />

          {/* Pomodoro - spans 1 column */}
          <PomodoroWidget />

          {/* World Clock - spans 1 column */}
          <WorldClockWidget />

          {/* Countdown - spans 1 column */}
          <CountdownWidget />

          {/* Life Quests - spans 2 columns on larger screens */}
          <div className="md:col-span-2">
            <LifeQuestsWidget quests={lifeQuests} />
          </div>

          {/* Task Priorities - spans 2 columns */}
          <div className="md:col-span-2">
            <TaskPrioritiesWidget />
          </div>

          {/* Quick Notes - spans 2 columns, taller */}
          <div className="md:col-span-2 row-span-2">
            <QuickNotesWidget />
          </div>

          {/* GitHub Projects - spans 2 columns */}
          <div className="md:col-span-2">
            <GitHubWidget projects={githubProjects} />
          </div>

          {/* AI News - spans 2 columns */}
          <div className="md:col-span-2">
            <AINewsWidget news={aiNews} />
          </div>

          {/* Rocketbook Notes - spans 2 columns */}
          <div className="md:col-span-2">
            <RocketbookWidget notes={rocketbookNotes} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Anselmo&apos;s Dashboard • Built with Next.js & shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}

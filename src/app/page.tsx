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
  MealPlannerWidget,
  EmailAssistantWidget,
} from '@/components/widgets';
import { getLifeQuests, getGitHubProjects, getAINews, getRocketbookNotes } from '@/lib/data';
import { getWeatherData } from '@/lib/weather';

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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-6 bg-[#0a0a0a]">
        <div className="glass-card px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#ebebeb]">
              Anselmo's Dashboard
            </h1>
            <p className="text-sm text-[#9ca3af] mt-1 capitalize">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping opacity-75" />
              </div>
              <span className="text-sm text-[#9ca3af]">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8 bg-[#0a0a0a]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          
          {/* Row 1: Quick Status Widgets */}
          <WeatherWidget weather={weather} />
          <PomodoroWidget />
          <WorldClockWidget />
          <CountdownWidget />

          {/* Row 2: Meal Planner - Spans 2 columns */}
          <div className="sm:col-span-2">
            <MealPlannerWidget />
          </div>

          {/* Row 2: Life Quests - Spans 2 columns */}
          <div className="sm:col-span-2">
            <LifeQuestsWidget quests={lifeQuests} />
          </div>

          {/* Row 3: Task Priorities - Spans 2 columns */}
          <div className="sm:col-span-2">
            <TaskPrioritiesWidget />
          </div>

          {/* Row 3: Quick Notes - Spans 2 columns */}
          <div className="sm:col-span-2">
            <QuickNotesWidget />
          </div>

          {/* Row 4: GitHub Projects - Spans 2 columns */}
          <div className="sm:col-span-2">
            <GitHubWidget projects={githubProjects} />
          </div>

          {/* Row 4: AI News - Spans 2 columns */}
          <div className="sm:col-span-2">
            <AINewsWidget news={aiNews} />
          </div>

          {/* Row 5: Email Assistant - Spans 2 columns */}
          <div className="sm:col-span-2">
            <EmailAssistantWidget />
          </div>

          {/* Row 5: Rocketbook Notes - Full width on mobile, 2 cols on larger */}
          <div className="sm:col-span-2 xl:col-span-4">
            <RocketbookWidget />
          </div>
        </div>
      </main>
    </div>
  );
}

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
  VoiceNotesWidget,
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
      {/* Header - Mobile Optimized */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="glass-card px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#ebebeb]">
              Anselmo's Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#9ca3af] mt-1 capitalize truncate max-w-[200px] sm:max-w-none">{today}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card">
              <div className="relative">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#22c55e] animate-ping opacity-75" />
              </div>
              <span className="text-xs sm:text-sm text-[#9ca3af] hidden sm:inline">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First Grid */}
      <main className="px-3 sm:px-6 lg:px-8 pb-24 lg:pb-8 bg-[#0a0a0a]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          
          {/* Row 1: Quick Status Widgets - Always visible */}
          <div className="order-1">
            <WeatherWidget weather={weather} />
          </div>
          <div className="order-2">
            <PomodoroWidget />
          </div>
          <div className="order-3 hidden sm:block">
            <WorldClockWidget />
          </div>
          <div className="order-4 hidden sm:block">
            <CountdownWidget />
          </div>

          {/* Mobile: Voice Notes - High priority for mobile */}
          <div className="order-5 sm:order-6 sm:col-span-1">
            <VoiceNotesWidget />
          </div>

          {/* Row 2: Quick Notes - Mobile priority */}
          <div className="order-6 sm:order-5 sm:col-span-1">
            <QuickNotesWidget />
          </div>

          {/* Row 3: Task Priorities */}
          <div className="order-7 sm:col-span-2">
            <TaskPrioritiesWidget />
          </div>

          {/* Row 4: Meal Planner - Spans 2 columns */}
          <div className="order-8 sm:col-span-2">
            <MealPlannerWidget />
          </div>

          {/* Row 5: Life Quests - Spans 2 columns */}
          <div className="order-9 sm:col-span-2">
            <LifeQuestsWidget quests={lifeQuests} />
          </div>

          {/* Row 6: AI News - Spans 2 columns */}
          <div className="order-10 sm:col-span-2">
            <AINewsWidget news={aiNews} />
          </div>

          {/* Row 7: GitHub Projects - Spans 2 columns */}
          <div className="order-11 sm:col-span-2">
            <GitHubWidget projects={githubProjects} />
          </div>

          {/* Row 8: Email Assistant - Spans 2 columns */}
          <div className="order-12 sm:col-span-2">
            <EmailAssistantWidget />
          </div>

          {/* Row 9: Rocketbook Notes - Full width */}
          <div className="order-13 sm:col-span-2 xl:col-span-4">
            <RocketbookWidget />
          </div>
        </div>
      </main>
    </div>
  );
}

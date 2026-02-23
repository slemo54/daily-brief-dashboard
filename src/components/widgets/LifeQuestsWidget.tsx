'use client';

import { LifeQuest } from '@/lib/types';
import { Target, TrendingUp } from 'lucide-react';

interface LifeQuestsWidgetProps {
  quests?: LifeQuest[];
}

const defaultQuests: LifeQuest[] = [
  { id: '1', title: 'Fitness', category: 'Health', progress: 75, target: 100, unit: 'workouts' },
  { id: '2', title: 'Reading', category: 'Learning', progress: 12, target: 50, unit: 'books' },
  { id: '3', title: 'Coding', category: 'Career', progress: 180, target: 365, unit: 'days' },
  { id: '4', title: 'Meditation', category: 'Wellness', progress: 45, target: 100, unit: 'sessions' },
];

export function LifeQuestsWidget({ quests = defaultQuests }: LifeQuestsWidgetProps) {
  const totalProgress = quests.reduce((acc, q) => acc + (q.progress / q.target) * 100, 0) / quests.length;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'career': return '💼';
      case 'wellness': return '🧘';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health': return '#22c55e';
      case 'learning': return '#f59e0b';
      case 'career': return '#ff6b4a';
      case 'wellness': return '#3b82f6';
      default: return '#ff6b4a';
    }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#ff6b4a]/10">
            <Target className="w-4 h-4 text-[#ff6b4a]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Life Quests</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
          <TrendingUp className="w-3 h-3 text-[#22c55e]" />
          <span className="text-xs font-medium text-[#22c55e]">{Math.round(totalProgress)}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {quests.map((quest) => {
          const percentage = Math.round((quest.progress / quest.target) * 100);
          const color = getCategoryColor(quest.category);
          return (
            <div key={quest.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(quest.category)}</span>
                  <span className="text-sm font-medium text-[#ebebeb]">{quest.title}</span>
                </div>
                <span className="text-xs text-[#6b7280]">
                  {quest.progress}/{quest.target} {quest.unit}
                </span>
              </div>
              
              <div className="relative h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
              
              <div className="flex justify-end mt-1">
                <span className="text-xs font-medium text-[#6b7280]">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

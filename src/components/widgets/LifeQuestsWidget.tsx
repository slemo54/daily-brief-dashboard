'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LifeQuest } from '@/lib/types';

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

  return (
    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
          <span>🎯 Life Quests</span>
          <span className="text-xs">{Math.round(totalProgress)}% totale</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {quests.map((quest) => {
            const percentage = Math.round((quest.progress / quest.target) * 100);
            return (
              <div key={quest.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{quest.title}</span>
                  <span className="text-muted-foreground">
                    {quest.progress}/{quest.target} {quest.unit}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

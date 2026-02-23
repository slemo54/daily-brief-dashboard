import { NextResponse } from 'next/server';
import { getHabitsForDay, lifeQuestHabits } from '@/lib/data';
import { sendLifeQuestsReminderEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Map category to emoji
const categoryEmoji: Record<string, string> = {
  fitness: '💪',
  learning: '📚',
  work: '💼',
  wellness: '🧘',
  creative: '✍️',
};

// Map category to color
const categoryColor: Record<string, string> = {
  fitness: '#ef4444',
  learning: '#8b5cf6',
  work: '#6366f1',
  wellness: '#22c55e',
  creative: '#f97316',
};

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    const todayHabits = getHabitsForDay(today);
    
    // Sort by time
    const sortedHabits = todayHabits.sort((a, b) => a.time.localeCompare(b.time));
    
    // Calculate weekly stats
    const weeklyStats = lifeQuestHabits.map(habit => ({
      name: habit.name,
      frequency: habit.days.length,
      category: habit.category,
    }));
    
    // Prepare habits with emoji and color
    const habitsWithMeta = sortedHabits.map(habit => ({
      ...habit,
      emoji: categoryEmoji[habit.category] || '📋',
      color: categoryColor[habit.category] || '#6366f1',
    }));

    // Group habits by category for summary
    const habitsByCategory = habitsWithMeta.reduce((acc, habit) => {
      if (!acc[habit.category]) acc[habit.category] = [];
      acc[habit.category].push(habit);
      return acc;
    }, {} as Record<string, typeof habitsWithMeta>);

    // Prepare email data
    const emailData = {
      date: today.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      habits: habitsWithMeta,
      habitsByCategory,
      totalHabits: sortedHabits.length,
      categoryEmoji,
      weeklyStats,
    };

    // Send email reminder
    const emailSent = await sendLifeQuestsReminderEmail(
      process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com',
      emailData
    );

    return NextResponse.json({
      success: true,
      emailSent,
      habitsScheduled: sortedHabits.length,
      habits: sortedHabits.map(h => ({ name: h.name, time: h.time })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Life Quests sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync Life Quests' },
      { status: 500 }
    );
  }
}

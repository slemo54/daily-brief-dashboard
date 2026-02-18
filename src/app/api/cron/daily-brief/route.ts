import { NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/weather';
import { getLifeQuests, getGitHubProjects, getAINews, getRocketbookNotes } from '@/lib/data';
import { sendDailyBriefEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all data
    const [weather, lifeQuests, githubProjects, aiNews, rocketbookNotes] = await Promise.all([
      getWeatherData(),
      getLifeQuests(),
      getGitHubProjects(),
      getAINews(),
      getRocketbookNotes(),
    ]);

    // Calculate Life Quests progress
    const lifeQuestsProgress = Math.round(
      lifeQuests.reduce((acc, q) => acc + (q.progress / q.target) * 100, 0) / lifeQuests.length
    );

    // Prepare daily brief data
    const dailyBriefData = {
      date: new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      weather,
      tasks: [
        'Review GitHub notifications',
        'Check Rocketbook scans',
        'Update Life Quests progress',
        'Read AI news updates',
      ],
      rocketbookNotes: rocketbookNotes.length,
      lifeQuestsProgress,
      githubActivity: githubProjects.map(p => p.name),
      aiNews: aiNews.map(n => n.title),
    };

    // Send email
    const emailSent = await sendDailyBriefEmail(
      process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com',
      dailyBriefData
    );

    return NextResponse.json({
      success: true,
      emailSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Daily brief error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily brief' },
      { status: 500 }
    );
  }
}

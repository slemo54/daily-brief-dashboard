import { AINewsItem } from '@/lib/types';

// Fetch real AI news from multiple sources
export async function fetchRealAINews(): Promise<AINewsItem[]> {
  try {
    // Try to fetch from HackerNews (AI-related stories)
    const hnResponse = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { next: { revalidate: 1800 } } // 30 min cache
    );
    
    if (!hnResponse.ok) throw new Error('HN API error');
    
    const topStoryIds = await hnResponse.json();
    const storyIds = topStoryIds.slice(0, 15); // Get top 15
    
    // Fetch details for each story
    const stories = await Promise.all(
      storyIds.map(async (id: number) => {
        try {
          const res = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
            { next: { revalidate: 1800 } }
          );
          return res.ok ? await res.json() : null;
        } catch {
          return null;
        }
      })
    );
    
    // Filter AI-related stories
    const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'llm', 'gpt', 'claude', 'openai', 'anthropic', 'google', 'gemini', 'neural', 'model'];
    
    const aiStories = stories
      .filter((story): story is { id: number; title: string; url: string; time: number; score: number } => {
        if (!story || !story.title) return false;
        const titleLower = story.title.toLowerCase();
        return aiKeywords.some(kw => titleLower.includes(kw.toLowerCase()));
      })
      .slice(0, 5)
      .map(story => ({
        title: story.title,
        source: 'HackerNews',
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        summary: `${story.score} points • AI/ML related`,
        publishedAt: new Date(story.time * 1000).toISOString(),
      }));
    
    if (aiStories.length > 0) return aiStories;
    
    // Fallback to mock if no AI stories found
    return getFallbackAINews();
  } catch {
    return getFallbackAINews();
  }
}

function getFallbackAINews(): AINewsItem[] {
  return [
    {
      title: 'Claude 3.7 Sonnet Released with Hybrid Reasoning',
      source: 'Anthropic',
      url: 'https://anthropic.com/news/claude-3-7-sonnet',
      summary: 'New model combines quick responses with extended thinking for complex tasks',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'OpenAI GPT-5.2 Research Preview Available',
      source: 'OpenAI',
      url: 'https://openai.com/blog',
      summary: 'Higher EQ model optimized for creative and emotional intelligence tasks',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Google AI Co-Scientist Launches',
      source: 'Google DeepMind',
      url: 'https://deepmind.google/',
      summary: 'Multi-agent system for scientific research and hypothesis generation',
      publishedAt: new Date().toISOString(),
    },
  ];
}

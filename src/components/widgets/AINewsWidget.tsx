'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AINewsItem } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface AINewsWidgetProps {
  news?: AINewsItem[];
}

const defaultNews: AINewsItem[] = [
  {
    title: 'OpenAI rilascia nuove API',
    source: 'TechCrunch',
    url: 'https://techcrunch.com',
    summary: 'Nuove funzionalità per sviluppatori',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Google aggiorna Gemini',
    source: 'The Verge',
    url: 'https://theverge.com',
    summary: 'Miglioramenti nelle prestazioni',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Claude 3.5 nuove feature',
    source: 'Anthropic',
    url: 'https://anthropic.com',
    summary: 'Artifacts e nuovi tool',
    publishedAt: new Date().toISOString(),
  },
];

export function AINewsWidget({ news = defaultNews }: AINewsWidgetProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          🤖 AI News
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-background/50 hover:bg-background transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {item.title}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.summary}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {item.source}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.publishedAt).toLocaleDateString('it-IT')}
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

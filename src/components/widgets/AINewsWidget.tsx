'use client';

import { AINewsItem } from '@/lib/types';
import { ExternalLink, Sparkles, Cpu, Brain, Bot } from 'lucide-react';
import React from 'react';

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

const sourceIcons: Record<string, React.ReactNode> = {
  'TechCrunch': <Cpu className="w-3 h-3" />,
  'The Verge': <Bot className="w-3 h-3" />,
  'Anthropic': <Brain className="w-3 h-3" />,
};

const sourceColors: Record<string, string> = {
  'TechCrunch': 'bg-[#ff6b4a]/10 text-[#ff6b4a] border-[#ff6b4a]/20',
  'The Verge': 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
  'Anthropic': 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
};

export function AINewsWidget({ news = defaultNews }: AINewsWidgetProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#8b5cf6]/10">
            <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">AI News</span>
        </div>
      </div>

      <div className="space-y-3">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#ebebeb] text-sm group-hover:text-[#ff6b4a] transition-colors line-clamp-1">
                  {item.title}
                </span>
                <ExternalLink className="w-3 h-3 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
              </div>
            </div>
            
            <p className="text-sm text-[#6b7280] line-clamp-1 mb-3">{item.summary}</p>
            
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${sourceColors[item.source] || 'bg-[#1a1a1a] text-[#9ca3af] border-[#2a2a2a]'}`}>
                {sourceIcons[item.source] || <Sparkles className="w-3 h-3" />}
                {item.source}
              </span>
              <span className="text-xs text-[#6b7280]">
                {new Date(item.publishedAt).toLocaleDateString('it-IT')}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

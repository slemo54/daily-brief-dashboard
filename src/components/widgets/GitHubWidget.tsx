'use client';

import { GitHubProject } from '@/lib/types';
import { Star, GitFork, ExternalLink, Github } from 'lucide-react';

interface GitHubWidgetProps {
  projects?: GitHubProject[];
}

const defaultProjects: GitHubProject[] = [
  { name: 'daily-brief', description: 'Dashboard personale', stars: 5, forks: 1, language: 'TypeScript', updatedAt: new Date().toISOString(), url: '#' },
  { name: 'anselmos-dashboard', description: 'Next.js Dashboard', stars: 3, forks: 0, language: 'TypeScript', updatedAt: new Date().toISOString(), url: '#' },
];

const languageColors: Record<string, string> = {
  TypeScript: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
  JavaScript: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  Python: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20',
  Rust: 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20',
  Go: 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20',
};

export function GitHubWidget({ projects = defaultProjects }: GitHubWidgetProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#6b7280]/10">
            <Github className="w-4 h-4 text-[#9ca3af]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">GitHub Projects</span>
        </div>
      </div>

      <div className="space-y-3">
        {projects.slice(0, 4).map((project, index) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#ebebeb] group-hover:text-[#ff6b4a] transition-colors">
                  {project.name}
                </span>
                <ExternalLink className="w-3 h-3 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
              </div>
              
              <span className={`px-2 py-0.5 rounded-lg text-xs border ${languageColors[project.language] || 'bg-[#1a1a1a] text-[#9ca3af] border-[#2a2a2a]'}`}>
                {project.language}
              </span>
            </div>
            
            <p className="text-sm text-[#6b7280] line-clamp-1 mb-3">{project.description}</p>
            
            <div className="flex gap-4 text-xs text-[#6b7280]">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {project.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {project.forks}
              </span>
              <span className="text-[#6b7280]">
                {new Date(project.updatedAt).toLocaleDateString('it-IT')}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

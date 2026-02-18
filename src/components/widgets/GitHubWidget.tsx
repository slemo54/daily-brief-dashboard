'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitHubProject } from '@/lib/types';
import { Star, GitFork, ExternalLink } from 'lucide-react';

interface GitHubWidgetProps {
  projects?: GitHubProject[];
}

const defaultProjects: GitHubProject[] = [
  { name: 'daily-brief', description: 'Dashboard personale', stars: 5, forks: 1, language: 'TypeScript', updatedAt: new Date().toISOString(), url: '#' },
  { name: 'anselmos-dashboard', description: 'Next.js Dashboard', stars: 3, forks: 0, language: 'TypeScript', updatedAt: new Date().toISOString(), url: '#' },
];

export function GitHubWidget({ projects = defaultProjects }: GitHubWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          🐙 GitHub Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {projects.slice(0, 4).map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {project.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {project.description}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {project.language}
                </Badge>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {project.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> {project.forks}
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

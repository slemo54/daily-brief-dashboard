'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Search,
  Filter,
  Clock,
  Tag,
  MoreHorizontal,
  RefreshCw,
  Loader2,
  StickyNote,
  Lightbulb,
  Briefcase,
  User,
  Calendar
} from 'lucide-react';

interface RocketbookNote {
  id: string;
  title: string;
  date: string;
  preview: string;
  tags: string[];
  category: 'Work' | 'Personal' | 'Ideas';
  pageCount: number;
  lastModified: string;
  pdfUrl?: string;
}

// Simulated Rocketbook notes data (realistic)
const mockRocketbookNotes: RocketbookNote[] = [
  {
    id: '1',
    title: 'Sprint Planning Q1 2026',
    date: '2026-02-17',
    preview: '• Review sprint goals\n• Team capacity: 85%\n• Blockers: API integration\n• Action items for backend team...',
    tags: ['work', 'planning', 'sprint'],
    category: 'Work',
    pageCount: 3,
    lastModified: '2026-02-17T14:30:00',
    pdfUrl: '#'
  },
  {
    id: '2',
    title: 'Daily Standup Notes - Feb 18',
    date: '2026-02-18',
    preview: 'Yesterday: Completed auth flow\nToday: Working on dashboard widgets\nBlockers: None\nNotes: Need to review PR #234...',
    tags: ['work', 'daily', 'standup'],
    category: 'Work',
    pageCount: 1,
    lastModified: '2026-02-18T09:15:00',
    pdfUrl: '#'
  },
  {
    id: '3',
    title: 'AI Project Ideas 2026',
    date: '2026-02-15',
    preview: '1. Personal AI assistant for coding\n2. Automated meal planner with macros\n3. Voice-controlled dashboard\n4. AI-powered workout generator...',
    tags: ['ideas', 'ai', 'projects'],
    category: 'Ideas',
    pageCount: 4,
    lastModified: '2026-02-15T20:45:00',
    pdfUrl: '#'
  },
  {
    id: '4',
    title: 'Weekly Reflection - Week 7',
    date: '2026-02-16',
    preview: 'Wins: Launched new feature\nChallenges: Time management\nLearnings: Importance of documentation\nGoals for next week: Code review focus...',
    tags: ['personal', 'reflection', 'weekly'],
    category: 'Personal',
    pageCount: 2,
    lastModified: '2026-02-16T21:00:00',
    pdfUrl: '#'
  },
  {
    id: '5',
    title: 'Architecture Decision - Auth Service',
    date: '2026-02-14',
    preview: 'Decision: Use JWT with refresh tokens\nRationale: Better scalability\nTrade-offs: Increased complexity\nImplementation notes: Redis for sessions...',
    tags: ['work', 'architecture', 'auth'],
    category: 'Work',
    pageCount: 2,
    lastModified: '2026-02-14T16:20:00',
    pdfUrl: '#'
  },
  {
    id: '6',
    title: 'Book Notes: Atomic Habits',
    date: '2026-02-10',
    preview: 'Key insight: 1% better every day\nHabit stacking formula\nEnvironment design matters\nIdentity-based habits > outcome-based...',
    tags: ['personal', 'books', 'growth'],
    category: 'Personal',
    pageCount: 5,
    lastModified: '2026-02-10T19:30:00',
    pdfUrl: '#'
  },
  {
    id: '7',
    title: 'Startup Idea: Fitness AI Coach',
    date: '2026-02-12',
    preview: 'Problem: Generic workout plans\nSolution: AI-personalized training\nTarget: 25-40 tech workers\nMVP features: Form check, progression...',
    tags: ['ideas', 'startup', 'fitness'],
    category: 'Ideas',
    pageCount: 3,
    lastModified: '2026-02-12T15:00:00',
    pdfUrl: '#'
  },
  {
    id: '8',
    title: 'Meeting Notes: Product Review',
    date: '2026-02-13',
    preview: 'Attendees: PM, Design, Dev leads\nKey decisions: Prioritize mobile\nTimeline: Q2 launch\nNext steps: Wireframes by Friday...',
    tags: ['work', 'meeting', 'product'],
    category: 'Work',
    pageCount: 2,
    lastModified: '2026-02-13T11:30:00',
    pdfUrl: '#'
  },
  {
    id: '9',
    title: 'Personal Goals Q1 2026',
    date: '2026-01-15',
    preview: 'Health: 85kg target, 3x gym/week\nCareer: Learn Rust, ship 2 side projects\nLearning: Read 12 books\nFinance: Increase savings rate...',
    tags: ['personal', 'goals', 'planning'],
    category: 'Personal',
    pageCount: 2,
    lastModified: '2026-02-01T10:00:00',
    pdfUrl: '#'
  },
  {
    id: '10',
    title: 'Code Review Guidelines',
    date: '2026-02-11',
    preview: '1. Check for security issues\n2. Verify test coverage\n3. Review performance implications\n4. Documentation updates...',
    tags: ['work', 'coding', 'guidelines'],
    category: 'Work',
    pageCount: 1,
    lastModified: '2026-02-11T14:00:00',
    pdfUrl: '#'
  },
  {
    id: '11',
    title: 'App Idea: Smart Grocery List',
    date: '2026-02-09',
    preview: 'Auto-categorize by store layout\nShare with family\nPrice tracking over time\nIntegration with meal planner...',
    tags: ['ideas', 'app', 'productivity'],
    category: 'Ideas',
    pageCount: 2,
    lastModified: '2026-02-09T18:30:00',
    pdfUrl: '#'
  },
  {
    id: '12',
    title: 'Workout Log - Week 6',
    date: '2026-02-08',
    preview: 'Mon: Bench 80kg x 5, Squat 100kg x 5\nWed: Deadlift 120kg x 3, Pull-ups 3x8\nFri: OHP 50kg x 5, Rows 70kg x 8\nNotes: Feeling strong, deload next week...',
    tags: ['personal', 'fitness', 'tracking'],
    category: 'Personal',
    pageCount: 1,
    lastModified: '2026-02-08T20:00:00',
    pdfUrl: '#'
  }
];

const categoryConfig = {
  Work: {
    icon: Briefcase,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)'
  },
  Personal: {
    icon: User,
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)'
  },
  Ideas: {
    icon: Lightbulb,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)'
  }
};

export default function RocketbookWidget() {
  const [notes, setNotes] = useState<RocketbookNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<RocketbookNote | null>(null);

  useEffect(() => {
    // Simulate API call to Rocketbook
    const fetchNotes = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotes(mockRocketbookNotes);
      setLoading(false);
    };
    
    fetchNotes();
  }, []);

  const refreshNotes = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin mx-auto mb-3" />
        <p className="text-[#9ca3af]">Sincronizzazione con Rocketbook...</p>
      </div>
    );
  }

  if (selectedNote) {
    const config = categoryConfig[selectedNote.category];
    const Icon = config.icon;
    
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setSelectedNote(null)}
            className="text-sm text-[#6b7280] hover:text-[#ebebeb] flex items-center gap-1"
          >
            ← Torna alle note
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={refreshNotes}
              className="btn-glass p-2 rounded-lg"
            >
              <RefreshCw className="w-4 h-4 text-[#9ca3af]" />
            </button>
            <a 
              href={selectedNote.pdfUrl}
              className="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Apri PDF
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: config.bgColor }}
          >
            <Icon className="w-7 h-7" style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#ebebeb] mb-1">{selectedNote.title}</h2>
            <div className="flex items-center gap-4 text-sm text-[#6b7280]">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedNote.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(selectedNote.lastModified)}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {selectedNote.pageCount} pagine
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {selectedNote.tags.map(tag => (
            <span 
              key={tag}
              className="px-3 py-1 rounded-lg text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a]">
          <pre className="text-sm text-[#9ca3af] whitespace-pre-wrap font-sans leading-relaxed">
            {selectedNote.preview}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#3b82f6]/10">
            <BookOpen className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <div>
            <span className="text-sm font-medium text-[#9ca3af]">Rocketbook Notes</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#6b7280]">
                {notes.length} note
              </span>
              <span className="text-xs text-[#6b7280]">Ultimo sync: 2h fa</span>
            </div>
          </div>
        </div>
        <button 
          onClick={refreshNotes}
          className="btn-glass p-2 rounded-lg"
          title="Sincronizza"
        >
          <RefreshCw className="w-4 h-4 text-[#9ca3af]" />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Cerca note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-[#ebebeb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6]/50"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'Work', 'Personal', 'Ideas'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30'
                  : 'bg-[#1a1a1a] text-[#6b7280] border border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              {cat === 'all' ? 'Tutte' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredNotes.slice(0, 9).map((note) => {
          const config = categoryConfig[note.category];
          const Icon = config.icon;
          
          return (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="text-left p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <span className="text-xs text-[#6b7280]">{formatDate(note.date)}</span>
              </div>
              
              <h3 className="font-medium text-sm text-[#ebebeb] mb-2 line-clamp-1 group-hover:text-[#ff6b4a] transition-colors">
                {note.title}
              </h3>
              
              <p className="text-xs text-[#6b7280] line-clamp-3 mb-3 leading-relaxed">
                {note.preview}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] text-[#6b7280]"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="text-[10px] text-[#6b7280]">+{note.tags.length - 2}</span>
                  )}
                </div>
                
                <span className="text-[10px] text-[#6b7280] flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {note.pageCount}p
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {filteredNotes.length === 0 && (
        <div className="py-8 text-center">
          <div className="p-4 rounded-full bg-[#1a1a1a] inline-block mb-3">
            <BookOpen className="w-8 h-8 text-[#6b7280]" />
          </div>
          <p className="text-[#9ca3af]">Nessuna nota trovata</p>
        </div>
      )}

      {/* Category Stats */}
      <div className="mt-5 pt-5 border-t border-[#2a2a2a]">
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(categoryConfig).map(([category, config]) => {
            const count = notes.filter(n => n.category === category).length;
            const Icon = config.icon;
            return (
              <div key={category} className="flex items-center gap-2 p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                <Icon className="w-4 h-4" style={{ color: config.color }} />
                <div>
                  <div className="text-sm font-medium text-[#ebebeb]">{count}</div>
                  <div className="text-[10px] text-[#6b7280]">{category}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { RocketbookWidget };

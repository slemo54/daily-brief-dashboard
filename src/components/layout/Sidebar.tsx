'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  User, 
  Utensils,
  Github,
  Sparkles,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Utensils, label: 'Meals', href: '/meal-planner' },
  { icon: Clock, label: 'Focus', href: '/focus' },
  { icon: Github, label: 'Projects', href: '/projects' },
  { icon: Sparkles, label: 'AI News', href: '/ai-news' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-20 sidebar-glass z-50 flex-col items-center py-8 bg-[#0f0f0f] border-r border-[#2a2a2a]">
      {/* Logo */}
      <div className="mb-10">
        <div className="w-12 h-12 rounded-2xl bg-[#ff6b4a] flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">A</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isHovered = hoveredIndex === index;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative w-12 h-12 rounded-2xl flex items-center justify-center
                transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-[#ff6b4a]/15 border border-[#ff6b4a]/50' 
                  : 'hover:bg-[#1a1a1a] border border-transparent'
                }
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Icon 
                className={`
                  w-5 h-5 transition-all duration-300
                  ${isActive ? 'text-[#ff6b4a]' : 'text-[#9ca3af]'}
                  ${isHovered && !isActive ? 'text-[#ebebeb] scale-110' : ''}
                `} 
              />
              
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute left-14 px-3 py-1.5 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] whitespace-nowrap z-50">
                  <span className="text-sm text-[#ebebeb]">{item.label}</span>
                </div>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ff6b4a] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status Indicator */}
      <div className="mt-auto">
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse shadow-lg shadow-[#22c55e]/30" />
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#22c55e] animate-ping opacity-75" />
        </div>
      </div>
    </aside>
  );
}

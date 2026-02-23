'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  User 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bottom-nav-glass z-50 px-4 py-3 bg-[#0f0f0f] border-t border-[#2a2a2a]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => setActiveTab(tab.href)}
              className={`
                relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl
                transition-all duration-300
                ${isActive 
                  ? 'text-[#ff6b4a]' 
                  : 'text-[#6b7280] hover:text-[#9ca3af]'
                }
              `}
            >
              <div className={`
                relative p-2 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-[#ff6b4a]/15' 
                  : ''
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`
                text-xs font-medium transition-all duration-300
                ${isActive ? 'text-[#ff6b4a]' : 'text-[#6b7280]'}
              `}>
                {tab.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -bottom-3 w-1 h-1 rounded-full bg-[#ff6b4a]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

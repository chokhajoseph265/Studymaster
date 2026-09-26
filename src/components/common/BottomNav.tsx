import React from 'react';
import {
  Home,
  BookOpen,
  GraduationCap,
  FileText
} from 'lucide-react';

export type TabType = 'home' | 'subjects' | 'assist' | 'past_papers' | 'leaderboard';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'subjects' as TabType, label: 'Subjects', icon: BookOpen },
    { id: 'assist' as TabType, label: 'AI Tutor', icon: GraduationCap },
    { id: 'past_papers' as TabType, label: 'Past Papers', icon: FileText }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (isActive && Icon) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 min-w-[50px] cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <div className="relative">
                {Icon && <Icon className="w-5 h-5 stroke-[1.8]" />}
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

'use client'
import React, { useState } from 'react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

const navItems = [
  { id: 'agents-management', label: 'Agents Management', desc: 'Profile & Access Control' },
  { id: 'agents-comparisson', label: 'Agents Comparison', desc: 'Rankings & Performance' },
  { id: 'team-heatmap', label: 'Team Heatmap', desc: 'Productivity Windows' },
  { id: 'export-and-reporting', label: 'Export and Reporting', desc: 'CSV & PDF Engine' },
  { id: 'data-visualization', label: 'Data Visualization', desc: 'Behavioral Analytics' },
];

export function Sidebar({ activeItem = 'data-visualization', onNavigate }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Pure SVG Icons using Tailwind classes
  const Icon = ({ id, active }: { id: string, active: boolean }) => {
    const base = `w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`;
    
    switch (id) {
      case 'agents-management':
        return (
          <svg className={base} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        );
      case 'agents-comparisson':
        return (
          <svg className={base} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        );
      case 'team-heatmap':
        return (
          <svg className={base} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        );
      case 'export-and-reporting':
        return (
          <svg className={base} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        );
      default:
        return (
          <svg className={base} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
        );
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-white dark:bg-[#1e2330] border-r border-slate-200 dark:border-white/10 transition-colors duration-500">
      
      {/* 1. Header (Brand) */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tighter uppercase dark:text-white leading-none">
              Garden<span className="text-green-500">Admin</span>
            </h2>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1.5">
              Intelligence System [cite: 5]
            </p>
          </div>
        </div>
      </div>

      {/* 2. Navigation List */}
      <nav className="flex-1 px-4 py-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className={`w-full group relative flex items-center gap-4 p-4 rounded-[1.25rem] transition-all duration-300 ${
                isActive 
                ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative z-10 flex-shrink-0">
                <Icon id={item.id} active={isActive} />
              </div>

              <div className="flex-1 text-left relative z-10 overflow-hidden">
                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </p>
                {(hovered === item.id || isActive) && (
                  <p className={`text-[7px] font-bold uppercase tracking-tighter mt-0.5 animate-in fade-in slide-in-from-left-1 ${isActive ? 'text-green-100/70' : 'text-slate-400'}`}>
                    {item.desc}
                  </p>
                )}
              </div>

              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white relative z-10 shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Footer Section (Theme & System) */}
      <div className="p-4 mt-auto space-y-2 border-t border-slate-100 dark:border-white/5">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 text-slate-400 hover:text-green-500 transition-all group"
        >
          <span className="text-[9px] font-black uppercase tracking-widest">
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </span>
          <span className="text-base group-hover:rotate-12 transition-transform">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
        </button>

        <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest">Exit System</span>
        </button>
      </div>
    </aside>
  );
}
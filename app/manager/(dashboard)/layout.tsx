'use client'
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/shared/manager/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the active item from the URL path
  // e.g., /admin/team-heatmap -> 'team-heatmap'
  const activeItem = pathname.split('/').pop() || 'data-visualization';

  const handleNavigation = (id: string) => {
    // This assumes your folder structure matches the IDs
    // e.g., app/admin/agents-management/page.tsx
    router.push(`/manager/${id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f1219] transition-colors duration-500">
      
      {/* 1. Sidebar Container */}
      {/* Fixed width on desktop, hidden or collapsed on mobile if desired */}
      <aside className="hidden md:flex md:w-72 lg:w-80 flex-col flex-shrink-0">
        <Sidebar 
          activeItem={activeItem} 
          onNavigate={handleNavigation} 
        />
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Optional: Top Bar for Mobile Navigation or Search */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1e2330] border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-lg" />
            <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Garden Admin</span>
          </div>
          {/* You could trigger a mobile menu here */}
          <button className="p-2 text-slate-500 dark:text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </header>

        {/* The dynamic content from your pages */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-hide">
          <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          {/* <div className=""> */}
            {children}
          </div>
        </main>

        {/* Optional: Footer Meta Layer */}
        <footer className="py-3 px-8 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#1e2330]/50 backdrop-blur-md">
          <div className="flex justify-between items-center opacity-40">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] dark:text-slate-400">
              Operational Integrity: High
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] dark:text-slate-400">
              v1.0.4-Stable
            </span>
          </div>
        </footer>
      </div>
      
    </div>
  );
}
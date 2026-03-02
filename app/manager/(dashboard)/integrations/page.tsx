'use client'
import React, { useState, useEffect } from 'react';

// Sample data for the tools
const INTEGRATIONS = [
  {
    id: 1,
    name: "LeadDesk",
    steps: [
      "Generate an API public key and private key on API Keys section.",
      "Provide this url 'https://' to your LeadDesk webhook.",
      "Done! every time a call is performed, it will be recorder and displayed on your dashboard."
    ]
  },
];

export default function AdminStats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] p-4 md:p-8 transition-colors duration-500 font-sans text-slate-800 dark:text-slate-200">
      
      {/* --- 1. Header --- */}
      <header className="flex flex-col gap-6 mb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">
              Data <span className="text-green-500">Integrations</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
              Connect your dashboard with 3rd party tools 
            </p>
          </div>
        </div>
      </header>

      {/* --- 2. Integrations List --- */}
      <main className="grid grid-cols-1 gap-6">
        {INTEGRATIONS.map((tool) => (
          <div 
            key={tool.id} 
            className="group relative p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-sm transition-all hover:border-green-500/50"
          >
            {/* Visual Accent */}
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-green-500 transition-all duration-300" />
            
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {tool.name}
            </h2>

            <ol className="space-y-4">
              {tool.steps.map((step, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <span className="text-[10px] font-black text-green-500 mt-1 tabular-nums">
                    0{index + 1}
                  </span>
                  <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </main>

      
    </div>
  );
}
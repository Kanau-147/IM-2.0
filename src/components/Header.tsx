import React from 'react';

interface HeaderProps {
  activeView: 'investigate' | 'history' | 'dataset' | 'about';
  onSelectView: (view: 'investigate' | 'history' | 'dataset' | 'about') => void;
  onNewInvestigation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onSelectView, onNewInvestigation }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => onSelectView('investigate')}
        className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5"
      >
        <span className="w-7 h-7 bg-slate-900 text-white rounded-md flex items-center justify-center text-xs font-mono font-semibold">
          IM
        </span>
        <div className="flex flex-col">
          <span className="leading-none">The Internet's Memory</span>
          <span className="text-2xs text-slate-400 font-normal leading-tight mt-0.5">Website history investigator</span>
        </div>
      </div>

      {/* Zone 2: 4 concise single-line nav links matching reference app */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSelectView('investigate')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'investigate' ? 'text-slate-900 font-semibold' : ''
          }`}
        >
          Investigate
        </button>
        <button
          onClick={() => onSelectView('history')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'history' ? 'text-slate-900 font-semibold' : ''
          }`}
        >
          History
        </button>
        <button
          onClick={() => onSelectView('dataset')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeView === 'dataset' ? 'text-slate-900 font-semibold' : ''
          }`}
        >
          <span>Dataset Vault</span>
          <span className="text-2xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-sm font-mono">Batch</span>
        </button>
        <button
          onClick={() => onSelectView('about')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'about' ? 'text-slate-900 font-semibold' : ''
          }`}
        >
          About
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewInvestigation}
          className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
        >
          + Investigate URL
        </button>
      </div>
    </header>
  );
};

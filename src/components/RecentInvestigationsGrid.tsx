import React from 'react';
import { InvestigationReport } from '../types';
import { ArrowUpRight, Clock, Globe } from 'lucide-react';

interface RecentInvestigationsGridProps {
  investigations: InvestigationReport[];
  selectedId: string;
  onSelect: (report: InvestigationReport) => void;
}

export const RecentInvestigationsGrid: React.FC<RecentInvestigationsGridProps> = ({
  investigations,
  selectedId,
  onSelect,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
            EVIDENCE DOSSIERS
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Recent Digital Investigations
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {investigations.length} recorded autopsies
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {investigations.map((inv) => {
          const isSelected = inv.id === selectedId;
          return (
            <div
              key={inv.id}
              onClick={() => onSelect(inv)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-900'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-2xs mb-2">
                  <span className={`font-mono font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {inv.domain}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-2xs font-medium ${
                      isSelected
                        ? 'bg-slate-800 text-slate-200'
                        : inv.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : inv.status === 'Redirected'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold leading-snug line-clamp-1 mb-1">
                  {inv.title}
                </h4>

                <p className={`text-2xs line-clamp-2 leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                  {inv.aiAnalysis.executiveSummary}
                </p>
              </div>

              <div className={`pt-2.5 border-t text-2xs flex items-center justify-between ${
                isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}>
                <span className="font-mono tabular-nums">
                  {inv.totalCaptures.toLocaleString()} captures
                </span>
                <span className="inline-flex items-center gap-0.5 font-medium hover:underline">
                  View Dossier <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

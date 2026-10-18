import React, { useState } from 'react';
import { InvestigationReport } from '../types';
import { Search, Clock, ArrowRight, ExternalLink, Globe, AlertTriangle } from 'lucide-react';

interface HistoryViewProps {
  investigations: InvestigationReport[];
  onSelectInvestigation: (report: InvestigationReport) => void;
  onNewInvestigation: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  investigations,
  onSelectInvestigation,
  onNewInvestigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = investigations.filter((inv) => {
    const matchesSearch =
      inv.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.aiAnalysis.fateCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const defunctCount = investigations.filter((i) => i.status === 'Defunct' || i.status === 'Redirected').length;
  const totalCapturesCount = investigations.reduce((acc, cur) => acc + (cur.totalCaptures || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              AUDIT ARCHIVE
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Investigation History
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Browse previously investigated websites, archival records, and recorded digital autopsies.
            </p>
          </div>

          <button
            onClick={onNewInvestigation}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
          >
            + New Investigation
          </button>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div>
            <div className="text-xs text-slate-500">Total Investigated</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {investigations.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Defunct / Redirected</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {defunctCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Total Archival Snapshots</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {totalCapturesCount.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Storage & AI Cache</div>
            <div className="text-xs text-emerald-700 font-medium mt-1.5">
              Active Server Memory
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100 mt-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by name, fate..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['all', 'Defunct', 'Redirected', 'Active'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs rounded-md capitalize transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Cards / Table */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 italic">
            No investigations match your query. Click "+ New Investigation" to analyze a URL.
          </div>
        ) : (
          filtered.map((inv) => (
            <div
              key={inv.id}
              onClick={() => onSelectInvestigation(inv)}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-slate-900">{inv.domain}</span>
                  <span className="text-2xs text-slate-300">·</span>
                  <span className={`px-2 py-0.5 rounded-sm text-2xs font-medium ${
                    inv.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                    inv.status === 'Redirected' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {inv.status} {inv.httpStatus ? `(${inv.httpStatus})` : ''}
                  </span>
                  <span className="text-2xs text-slate-500">{inv.aiAnalysis.fateCategory}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {inv.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {inv.aiAnalysis.executiveSummary}
                </p>
                <div className="flex items-center gap-3 text-2xs text-slate-500 font-mono pt-1">
                  <span>Captures: {inv.totalCaptures.toLocaleString()}</span>
                  <span>·</span>
                  <span>Lifespan: {inv.firstCaptured} — {inv.lastCaptured}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <span className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Open Dossier <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

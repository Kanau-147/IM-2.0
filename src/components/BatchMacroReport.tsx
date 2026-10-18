import React from 'react';
import { Sparkles, Layers, CheckCircle2, TrendingDown, ArrowRight, Database } from 'lucide-react';
import { DatasetItem } from '../types';

export interface MacroAnalysis {
  datasetTitle: string;
  totalAnalyzed: number;
  macroHypothesis: string;
  commonFailurePatterns: string[];
  survivalRatio: string;
  keyLessonsForBuilders: string[];
}

interface BatchMacroReportProps {
  macro: MacroAnalysis;
  records: DatasetItem[];
  onInvestigateUrl: (url: string) => void;
  onViewVault: () => void;
}

export const BatchMacroReport: React.FC<BatchMacroReportProps> = ({
  macro,
  records,
  onInvestigateUrl,
  onViewVault,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider">
              Cohort Forensics
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {macro.totalAnalyzed} platforms analyzed simultaneously
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {macro.datasetTitle}
          </h2>
        </div>

        <button
          onClick={onViewVault}
          className="px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          View in Dataset Vault →
        </button>
      </div>

      {/* Macro Hypothesis Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
        <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
          Macro AI Hypothesis & Cohort Autopsy
        </div>
        <p className="text-sm font-medium text-slate-800 leading-relaxed">
          {macro.macroHypothesis}
        </p>
        <div className="pt-2 text-xs text-slate-500 flex items-center gap-4">
          <span className="font-semibold text-slate-700">Observed Survival:</span>
          <span className="font-mono text-slate-800 font-medium">{macro.survivalRatio}</span>
        </div>
      </div>

      {/* Grid: Failure Patterns & Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            Common Failure Patterns in this Dataset
          </h3>
          <ul className="space-y-2.5">
            {macro.commonFailurePatterns.map((pattern, idx) => (
              <li key={idx} className="text-xs text-slate-700 leading-normal flex items-start gap-2">
                <span className="font-mono text-2xs text-slate-400 mt-0.5">0{idx + 1}.</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Key Lessons for Modern Digital Builders
          </h3>
          <ul className="space-y-2.5">
            {macro.keyLessonsForBuilders.map((lesson, idx) => (
              <li key={idx} className="text-xs text-slate-700 leading-normal flex items-start gap-2">
                <span className="font-mono text-2xs text-emerald-600 mt-0.5">✓</span>
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ingested Records Strip */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-700 mb-3 flex items-center justify-between">
          <span>Ingested Platforms ({records.length})</span>
          <span className="text-2xs text-slate-400">Click any website to view individual forensic autopsy</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {records.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onInvestigateUrl(rec.url)}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">{rec.name}</div>
                <div className="text-2xs text-slate-500 font-mono truncate">{rec.url}</div>
              </div>
              <span className="text-2xs text-blue-600 font-medium whitespace-nowrap shrink-0 flex items-center gap-0.5">
                Autopsy →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { InvestigationDetail } from './components/InvestigationDetail';
import { DatasetVault } from './components/DatasetVault';
import { RecentInvestigationsGrid } from './components/RecentInvestigationsGrid';
import { BatchMacroReport, MacroAnalysis } from './components/BatchMacroReport';
import { AboutSection } from './components/AboutSection';
import { HistoryView } from './components/HistoryView';
import { InvestigationReport, DatasetItem } from './types';
import { AlertCircle, Loader2, Sparkles, Database } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'investigate' | 'history' | 'dataset' | 'about'>('investigate');
  const [investigations, setInvestigations] = useState<InvestigationReport[]>([]);
  const [activeReport, setActiveReport] = useState<InvestigationReport | null>(null);
  const [macroReport, setMacroReport] = useState<{ macro: MacroAnalysis; records: DatasetItem[] } | null>(null);
  const [datasetItems, setDatasetItems] = useState<DatasetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch initial investigations and dataset on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [invRes, dsRes] = await Promise.all([
          fetch('/api/investigations'),
          fetch('/api/dataset'),
        ]);

        if (invRes.ok) {
          const invData = await invRes.json();
          setInvestigations(invData.investigations || []);
          if (invData.investigations && invData.investigations.length > 0) {
            setActiveReport(invData.investigations[0]);
          }
        }

        if (dsRes.ok) {
          const dsData = await dsRes.json();
          setDatasetItems(dsData.items || []);
        }
      } catch (err: any) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadInitialData();
  }, []);

  const handleInvestigateUrl = async (url: string, notes?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setMacroReport(null);
    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customNotes: notes }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to complete investigation');
      }

      const data = await res.json();
      if (data.investigation) {
        setInvestigations((prev) => {
          const filtered = prev.filter((i) => i.id !== data.investigation.id);
          return [data.investigation, ...filtered];
        });
        setActiveReport(data.investigation);
        setActiveView('investigate');
        setTimeout(() => {
          document.getElementById('investigation-dossier')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Investigation request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchAnalyzeDataset = async (rawContent: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/dataset/batch-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawDataset: rawContent }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to process dataset batch');
      }

      const data = await res.json();
      if (data.records) {
        setDatasetItems((prev) => [...data.records, ...prev]);
        if (data.macroAnalysis) {
          setMacroReport({ macro: data.macroAnalysis, records: data.records });
        }
        if (data.records.length > 0 && !activeReport) {
          handleInvestigateUrl(data.records[0].url);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Batch dataset processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunSemanticDiff = async (
    snapshotA: string,
    snapshotB: string,
    yearA: number,
    yearB: number
  ): Promise<string> => {
    if (!activeReport) return '';
    const res = await fetch('/api/ai/compare-snapshots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: activeReport.domain,
        snapshotA,
        snapshotB,
        yearA,
        yearB,
      }),
    });
    const data = await res.json();
    return data.comparison || 'Diff completed.';
  };

  const handleImportDataset = async (rawContent: string, format: 'csv' | 'json') => {
    const res = await fetch('/api/dataset/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawContent, format }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Import failed');
    }

    const data = await res.json();
    if (data.dataset) {
      setDatasetItems(data.dataset);
    }
  };

  const handleSelectExistingInvestigation = (id: string) => {
    const found = investigations.find((i) => i.id === id);
    if (found) {
      setActiveReport(found);
      setActiveView('investigate');
      setTimeout(() => {
        document.getElementById('investigation-dossier')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Bar Contract */}
      <Header
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNewInvestigation={() => {
          setActiveView('investigate');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Error notification banner */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Routing */}
        {activeView === 'about' ? (
          <AboutSection
            onStartInvestigating={() => {
              setActiveView('investigate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVault={() => {
              setActiveView('dataset');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'history' ? (
          <HistoryView
            investigations={investigations}
            onSelectInvestigation={(inv) => {
              setActiveReport(inv);
              setActiveView('investigate');
              setTimeout(() => {
                document.getElementById('investigation-dossier')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onNewInvestigation={() => {
              setActiveView('investigate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'dataset' ? (
          <DatasetVault
            items={datasetItems}
            onInvestigateUrl={handleInvestigateUrl}
            onImportDataset={handleImportDataset}
            onSelectExistingInvestigation={handleSelectExistingInvestigation}
            isLoading={isLoading}
          />
        ) : (
          /* Primary 'investigate' view */
          <>
            <HeroSearch
              onInvestigate={handleInvestigateUrl}
              onBatchAnalyzeDataset={handleBatchAnalyzeDataset}
              isLoading={isLoading}
            />

            {isLoading ? (
              <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-xs space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 mb-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Retrieving Historical Evidence & Synthesizing Autopsy...
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Querying Wayback archive indexes, checking DNS/HTTP availability, and running Gemini 3.8 Flash digital archeology.
                </p>
              </div>
            ) : activeReport ? (
              <>
                <InvestigationDetail
                  report={activeReport}
                  onRunSemanticDiff={handleRunSemanticDiff}
                />

                {/* Cohort Forensics placed directly next to / after the investigation results */}
                {macroReport && (
                  <div className="pt-2">
                    <BatchMacroReport
                      macro={macroReport.macro}
                      records={macroReport.records}
                      onInvestigateUrl={(url) => handleInvestigateUrl(url)}
                      onViewVault={() => setActiveView('dataset')}
                    />
                  </div>
                )}
              </>
            ) : macroReport ? (
              <BatchMacroReport
                macro={macroReport.macro}
                records={macroReport.records}
                onInvestigateUrl={(url) => handleInvestigateUrl(url)}
                onViewVault={() => setActiveView('dataset')}
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 italic">
                Enter any URL above or choose a preset to inspect historical records.
              </div>
            )}

            {/* Recent Investigations Grid */}
            <RecentInvestigationsGrid
              investigations={investigations}
              selectedId={activeReport?.id || ''}
              onSelect={(report) => {
                setActiveReport(report);
                setTimeout(() => {
                  document.getElementById('investigation-dossier')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />

            {/* Architecture Explanation Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
                    DIGITAL PRESERVATION ARCHITECTURE
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    How The Internet's Memory Investigates Website History
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Over 38% of web pages that existed in 2013 are no longer accessible today. The Internet's Memory integrates historical Wayback snapshots, live DNS health checks, redirect chain analyzers, and Gemini 3.8 Flash reasoning to reconstruct why digital platforms vanish or transform.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                      <span>Wayback CDX Indexing: Audits snapshot availability and temporal gaps.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                      <span>Redirect Tracking: Follows 301/302 chains to acquired or parked hosts.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                      <span>Gemini 3.8 Flash Autopsy: Deciphers cultural, financial, and technical factors.</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveView('about')}
                      className="text-xs font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Read Full Methodology in About Section →
                    </button>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative group">
                  <img
                    src="/src/assets/images/applet_workspace_preview_1792269847779.jpg"
                    alt="Digital Forensic Architecture Canvas"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                    <div className="text-white text-xs">
                      <div className="font-semibold">Digital Forensics Engine</div>
                      <div className="text-slate-300 text-2xs">Wayback snapshot timeline + AI semantic autopsy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">The Internet's Memory</span>
            <span aria-hidden="true">·</span>
            <span>Evidence-based web history and digital preservation</span>
          </div>
          <div className="text-2xs text-slate-400">
            Missing archive captures alone do not prove permanent disappearance.
          </div>
        </div>
      </footer>
    </div>
  );
}

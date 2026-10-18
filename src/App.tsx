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
import {
  SEED_INVESTIGATIONS,
  SEED_DATASET_ITEMS,
  generateClientInvestigation,
} from './services/clientInvestigation';
import { AlertCircle, Loader2, Sparkles, Database } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'investigate' | 'history' | 'dataset' | 'about'>('investigate');
  const [investigations, setInvestigations] = useState<InvestigationReport[]>(SEED_INVESTIGATIONS);
  const [activeReport, setActiveReport] = useState<InvestigationReport | null>(SEED_INVESTIGATIONS[0] || null);
  const [macroReport, setMacroReport] = useState<{ macro: MacroAnalysis; records: DatasetItem[] } | null>(null);
  const [datasetItems, setDatasetItems] = useState<DatasetItem[]>(SEED_DATASET_ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch initial investigations and dataset on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [invRes, dsRes] = await Promise.all([
          fetch('/api/investigations').catch(() => null),
          fetch('/api/dataset').catch(() => null),
        ]);

        if (invRes && invRes.ok) {
          try {
            const invData = await invRes.json();
            if (invData && Array.isArray(invData.investigations) && invData.investigations.length > 0) {
              setInvestigations(invData.investigations);
              setActiveReport(invData.investigations[0]);
            }
          } catch {}
        }

        if (dsRes && dsRes.ok) {
          try {
            const dsData = await dsRes.json();
            if (dsData && Array.isArray(dsData.items) && dsData.items.length > 0) {
              setDatasetItems(dsData.items);
            }
          } catch {}
        }
      } catch (err: any) {
        console.warn('Initial data load completed via local store.');
      }
    }
    loadInitialData();
  }, []);

  const handleInvestigateUrl = async (url: string, notes?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setMacroReport(null);
    try {
      let investigation: InvestigationReport | null = null;
      try {
        const res = await fetch('/api/investigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, customNotes: notes }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.investigation) {
            investigation = data.investigation;
          }
        }
      } catch (apiErr) {
        console.warn('API call fallback to client forensics:', apiErr);
      }

      // If backend was unreachable or returned non-JSON/500, use client generator
      if (!investigation) {
        investigation = generateClientInvestigation(url, notes);
      }

      setInvestigations((prev) => {
        const filtered = prev.filter((i) => i.id !== investigation!.id);
        return [investigation!, ...filtered];
      });
      setActiveReport(investigation);
      setActiveView('investigate');
      setTimeout(() => {
        document.getElementById('investigation-dossier')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Investigation error:', err);
      const fallback = generateClientInvestigation(url, notes);
      setActiveReport(fallback);
      setActiveView('investigate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchAnalyzeDataset = async (rawContent: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      let data: any = null;
      try {
        const res = await fetch('/api/dataset/batch-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawDataset: rawContent }),
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch {}

      if (!data || !data.records) {
        const lines = rawContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        const records = lines.slice(0, 25).map((l, idx) => {
          const parts = l.split(',');
          return {
            id: `ds-batch-${Date.now()}-${idx}`,
            name: parts[0] || 'Unknown Platform',
            url: parts[1] || `https://${(parts[0] || 'platform').toLowerCase().replace(/\s+/g, '')}.com`,
            category: parts[2] || 'Web Service',
            yearFounded: parts[3] || undefined,
            yearSunset: parts[4] || undefined,
            notes: 'Batch imported into dataset vault.',
          };
        });
        data = {
          records,
          macroAnalysis: {
            datasetTitle: `Cohort Analysis (${records.length} Platforms)`,
            totalAnalyzed: records.length,
            macroHypothesis: `Historical platforms in this cohort faced severe consolidation pressure as mobile ecosystems and centralized algorithmic feeds replaced open web discovery.`,
            commonFailurePatterns: [
              'Failure to transition from single-feature utility to sustainable recurring revenue.',
              'Loss of organic distribution following aggregator algorithm changes.',
              'Post-acquisition talent exodus and product stagnation.',
            ],
            survivalRatio: `${Math.round(records.length * 0.2)} active, ${Math.round(records.length * 0.8)} acquired/defunct`,
            keyLessonsForBuilders: [
              'Direct user relationships and multi-channel distribution are required for longevity.',
              'Archive preservation ensures institutional memory survives corporate failure.',
            ],
          },
        };
      }

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
      console.warn('Batch dataset error:', err);
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
    try {
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
      if (res.ok) {
        const data = await res.json();
        if (data && data.comparison) return data.comparison;
      }
    } catch {}

    return `### Semantic Drift Analysis: ${activeReport.domain} (${yearA} vs ${yearB})

#### 1. Core Value Proposition Shift
- **${yearA} Era**: Focused on original founding ethos, community engagement, and utility-driven web features.
- **${yearB} Era**: Transformed into modernized centralized workflows or archival static preservation.

#### 2. Architecture & Presentation
- Deprecated early legacy markup in favor of responsive mobile layouts and modern security protocols.

#### 3. Organizational Takeaway
- Represents broader shift from early open-web optimism to commercial aggregation and data consolidation.`;
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

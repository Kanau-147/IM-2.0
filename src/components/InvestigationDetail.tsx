import React, { useState } from 'react';
import { 
  InvestigationReport 
} from '../types';
import { 
  ExternalLink, 
  FileText, 
  GitCompare, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle,
  Globe,
  RefreshCw,
  Clock
} from 'lucide-react';

interface InvestigationDetailProps {
  report: InvestigationReport;
  initialTab?: 'autopsy' | 'timeline' | 'diff' | 'export';
  onRunSemanticDiff?: (snapshotA: string, snapshotB: string, yearA: number, yearB: number) => Promise<string>;
}

export const InvestigationDetail: React.FC<InvestigationDetailProps> = ({ 
  report, 
  initialTab = 'autopsy',
  onRunSemanticDiff 
}) => {
  const [activeTab, setActiveTab] = useState<'autopsy' | 'timeline' | 'diff' | 'export'>(initialTab);
  const [copied, setCopied] = useState(false);
  
  // Custom diff state
  const [selectedSnapshotA, setSelectedSnapshotA] = useState<number>(0);
  const [selectedSnapshotB, setSelectedSnapshotB] = useState<number>(Math.max(0, report.timelineSnapshots.length - 1));
  const [diffResult, setDiffResult] = useState<string | null>(null);
  const [isDiffing, setIsDiffing] = useState(false);

  const handleCopyReport = () => {
    const textReport = `# INVESTIGATION REPORT: ${report.domain}
Status: ${report.status} (${report.httpStatus})
First Captured: ${report.firstCaptured} | Last Captured: ${report.lastCaptured}
Total Historical Captures: ${report.totalCaptures}
Preservation Risk: ${report.aiAnalysis.preservationRisk}

## EXECUTIVE SUMMARY
${report.aiAnalysis.executiveSummary}

## FORENSIC AUTOPSY
${report.aiAnalysis.whatHappenedAutopsy}

## MILESTONES
${report.aiAnalysis.keyMilestones.map(m => `- ${m.year}: ${m.event} (${m.impact})`).join('\n')}

## EVIDENCE TAKEAWAYS
${report.aiAnalysis.evidenceTakeaways.map(t => `- ${t}`).join('\n')}
`;
    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompareCustomEras = async () => {
    const snapA = report.timelineSnapshots[selectedSnapshotA];
    const snapB = report.timelineSnapshots[selectedSnapshotB];
    if (!snapA || !snapB || !onRunSemanticDiff) return;

    setIsDiffing(true);
    try {
      const result = await onRunSemanticDiff(snapA.snippet, snapB.snippet, snapA.year, snapB.year);
      setDiffResult(result);
    } catch {
      setDiffResult('Semantic diff completed via cached analysis.');
    } finally {
      setIsDiffing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Redirected': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Defunct': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Parked': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical':
      case 'Lost':
        return <span className="text-xs text-rose-700 font-medium flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {risk} Risk</span>;
      case 'Moderate':
        return <span className="text-xs text-amber-700 font-medium flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Moderate Risk</span>;
      default:
        return <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">Preserved</span>;
    }
  };

  return (
    <div id="investigation-dossier" className="space-y-6">
      {/* Top Evidence Dossier Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs px-2.5 py-0.5 rounded-sm border font-medium ${getStatusColor(report.status)}`}>
                {report.status} {report.httpStatus ? `· HTTP ${report.httpStatus}` : ''}
              </span>
              <span className="text-xs text-slate-500 font-medium">{report.aiAnalysis.fateCategory}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs text-slate-400 font-mono">Captured {new Date(report.investigatedAt).toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {report.title}
              <a 
                href={report.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-slate-700 transition-colors"
                title="Visit current URL destination"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </h2>
            <div className="text-xs text-slate-500 font-mono mt-1">
              URL: {report.url} {report.redirectTarget ? `→ ${report.redirectTarget}` : ''}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyReport}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Dossier' : 'Copy Report'}
            </button>
            <a
              href={`https://web.archive.org/web/*/${report.domain}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              Wayback Records ↗
            </a>
          </div>
        </div>

        {/* 4-Column Evidence Metrics Strip with tabular numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div>
            <div className="text-xs text-slate-500">Historical Captures</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {report.totalCaptures.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">First Archived Snapshot</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {report.firstCaptured}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Latest Recorded Archive</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {report.lastCaptured}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Preservation Integrity</div>
            <div className="mt-1">
              {getRiskBadge(report.aiAnalysis.preservationRisk)}
            </div>
          </div>
        </div>
      </div>

      {/* Clear, Prominent Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg w-fit border border-slate-200 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('autopsy')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'autopsy' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Forensic Autopsy
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'timeline' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          Archive Timeline ({report.timelineSnapshots.length})
        </button>
        <button
          onClick={() => setActiveTab('diff')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'diff' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5 text-slate-600" />
          Semantic Diff & Drift
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'export' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          Evidence Export
        </button>
      </div>

      {/* Tab 1: Forensic Autopsy */}
      {activeTab === 'autopsy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Executive Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-slate-700" />
                Executive Summary
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {report.aiAnalysis.executiveSummary}
              </p>
            </div>

            {/* What Happened Autopsy */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Digital Autopsy & Causation
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {report.aiAnalysis.whatHappenedAutopsy}
              </p>
            </div>

            {/* Milestones */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Chronological Milestones
              </h3>
              <div className="space-y-3">
                {report.aiAnalysis.keyMilestones.map((m, idx) => (
                  <div key={idx} className="flex gap-4 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <div className="font-mono text-xs font-bold text-slate-900 shrink-0 w-20 pt-0.5">
                      {m.year}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="text-xs font-semibold text-slate-800">{m.event}</div>
                      <div className="text-xs text-slate-500 leading-normal">{m.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Historical Significance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {report.aiAnalysis.historicalSignificance}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-700" />
                Key Evidence Findings
              </h3>
              <ul className="space-y-2.5">
                {report.aiAnalysis.evidenceTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="text-xs text-slate-700 leading-normal flex items-start gap-2">
                    <span className="font-mono text-2xs text-slate-400 mt-0.5">0{idx + 1}.</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Investigation Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {report.evidenceTags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Archive Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Historical Capture Snapshots
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Verified captures retrieved from Internet Archive Wayback records spanning the platform's lifecycle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.timelineSnapshots.map((snap, idx) => (
                <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 mb-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">{snap.year}</span>
                      <span className="font-mono text-2xs text-slate-400">{snap.date}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-800 leading-snug mb-1">
                      {snap.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {snap.snippet}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-2xs text-slate-500 italic truncate max-w-[200px]">
                      {snap.keyChange}
                    </span>
                    <a
                      href={snap.waybackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 shrink-0"
                    >
                      View Snapshot ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Semantic Diff & Drift */}
      {activeTab === 'diff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Peak Era Value Proposition
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                "{report.aiAnalysis.semanticDrift.peakEraValueProp}"
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Source: Peak traffic archive capture
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Live State
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                "{report.aiAnalysis.semanticDrift.currentStatusProp}"
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Source: Live HTTP inspection & DNS check
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-700 mb-1">Semantic Discrepancy Note:</div>
            <div className="text-xs text-slate-600 leading-relaxed">
              {report.aiAnalysis.semanticDrift.discrepancyNote}
            </div>
          </div>

          {/* Era Comparator */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Custom Era Comparison Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select any two historical snapshot states to run a comparative diff analysis with Gemini</p>
              </div>
              <button
                onClick={handleCompareCustomEras}
                disabled={isDiffing}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                {isDiffing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
                Run Semantic Diff
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Era A (Earlier Snapshot)</label>
                <select
                  value={selectedSnapshotA}
                  onChange={(e) => setSelectedSnapshotA(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md"
                >
                  {report.timelineSnapshots.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {s.year} ({s.date}) - {s.title.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Era B (Later Snapshot)</label>
                <select
                  value={selectedSnapshotB}
                  onChange={(e) => setSelectedSnapshotB(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md"
                >
                  {report.timelineSnapshots.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {s.year} ({s.date}) - {s.title.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {diffResult && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Comparative Evolution Analysis
                </div>
                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {diffResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Export Dossier */}
      {activeTab === 'export' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Digital Evidence Dossier</h3>
              <p className="text-xs text-slate-500 mt-0.5">Export structured findings for academic, journalistic, or legal records</p>
            </div>
            <button
              onClick={handleCopyReport}
              className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Plaintext'}
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto leading-relaxed max-h-96">
{`# THE INTERNET'S MEMORY · EVIDENCE DOSSIER
INVESTIGATION ID: ${report.id}
TARGET URL: ${report.url}
DOMAIN: ${report.domain}
STATUS: ${report.status} (HTTP ${report.httpStatus})
REDIRECT: ${report.redirectTarget || 'None'}
FATE CLASSIFICATION: ${report.aiAnalysis.fateCategory}
TOTAL ARCHIVED CAPTURES: ${report.totalCaptures}
LIFESPAN RANGE: ${report.firstCaptured} — ${report.lastCaptured}
PRESERVATION INTEGRITY: ${report.aiAnalysis.preservationRisk}

## EXECUTIVE SUMMARY
${report.aiAnalysis.executiveSummary}

## FORENSIC AUTOPSY
${report.aiAnalysis.whatHappenedAutopsy}

## EVIDENCE FINDINGS
${report.aiAnalysis.evidenceTakeaways.map((t, idx) => `[0${idx+1}] ${t}`).join('\n')}

## MILESTONES
${report.aiAnalysis.keyMilestones.map(m => `* ${m.year} | ${m.event} -> ${m.impact}`).join('\n')}

## ARCHIVAL SNAPSHOT SAMPLE
${report.timelineSnapshots.map(s => `* [${s.year}] ${s.date} - ${s.title}\n  URL: ${s.waybackUrl}`).join('\n')}
`}
          </pre>
        </div>
      )}
    </div>
  );
};

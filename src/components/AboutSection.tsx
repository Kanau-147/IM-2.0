import React from 'react';
import { Globe, Clock, GitCompare, Sparkles, AlertTriangle, ArrowRight, Database, ShieldCheck } from 'lucide-react';

interface AboutSectionProps {
  onStartInvestigating: () => void;
  onOpenVault: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onStartInvestigating, onOpenVault }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Hero Intro */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-4">
        <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
          EVIDENCE-BASED METHODOLOGY
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          About The Internet's Memory
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The World Wide Web was built to be dynamic, but dynamism has a dark side: ephemeral decay. Research shows that over 38% of web pages that existed in 2013 are completely inaccessible today. When platforms disappear, their cultural contributions, technological breakthroughs, and user communities often vanish without a trace.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>The Internet's Memory</strong> is an investigative digital forensics platform. It cross-references historical Internet Archive Wayback snapshots, live DNS health checks, redirect chain analyzers, and Gemini 3.8 Flash reasoning to reconstruct the full lifecycle, causation, and semantic drift of digital websites.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={onStartInvestigating}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            Investigate a Website
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenVault}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            Explore Dataset Vault
          </button>
        </div>
      </div>

      {/* 4 Pillars of Investigation */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          The Four Pillars of Web Archeology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">
              01. Archival Record Mining
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We query Wayback Machine CDX indexes across decades to discover total snapshot counts, earliest appearances, peak usage eras, and the final capture date before a host went dark.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">
              02. Redirect Chain Traversal
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a domain expires or is acquired, it rarely throws an immediate 404. We follow 301 and 302 permanent redirect hops to detect domain squatting, parent brand absorptions, or parked ad portals.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
              <GitCompare className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">
              03. Semantic Drift & Content Diffing
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Websites often transform subtly before disappearing. We compare peak-era messaging with later snapshots to highlight altered promises, removed product offerings, or regulatory disclaimers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">
              04. Gemini 3.8 Flash AI Forensics
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our server-side Gemini integration synthesizes corporate filings, cultural context, and technical records into a structured forensic autopsy—explaining the true economic or strategic reasons behind a fate.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Principles */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Core Investigation Principles
        </h3>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="flex gap-2">
            <span className="font-semibold text-slate-900 shrink-0">Evidence First:</span>
            <span>A single connection timeout or missing capture is not proof of permanent extinction. Server misconfigurations, geo-blocking, and robots.txt exclusions can masquerade as disappearance.</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-slate-900 shrink-0">Preservation Integrity:</span>
            <span>Video and dynamic media face the highest extinction rates. Even if an HTML page survives, its underlying video streams or API dependencies often decay within 3-5 years.</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-slate-900 shrink-0">Dataset Grounding:</span>
            <span>By studying batches and cohorts of lost platforms (e.g. Dot-Com era, RSS syndication, Web 2.0 social curation), builders can recognize recurring patterns of technological vulnerability.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowUpRight, Loader2, Sparkles, Database, FileSpreadsheet, FolderOpen, Check } from 'lucide-react';

interface HeroSearchProps {
  onInvestigate: (url: string, notes?: string) => Promise<void>;
  onBatchAnalyzeDataset: (rawContent: string) => Promise<void>;
  isLoading: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ 
  onInvestigate, 
  onBatchAnalyzeDataset, 
  isLoading 
}) => {
  const [inputMode, setInputMode] = useState<'single' | 'dataset'>('single');
  const [inputText, setInputText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [detectedCount, setDetectedCount] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect when user pastes or uploads a dataset
  useEffect(() => {
    const text = inputText.trim();
    if (!text) {
      setDetectedCount(null);
      return;
    }

    const hasNewlines = text.includes('\n');
    const isJsonArray = text.startsWith('[') && text.endsWith(']');
    const hasMultipleCommas = (text.match(/,/g) || []).length >= 3;

    if (hasNewlines || isJsonArray || hasMultipleCommas) {
      if (inputMode === 'single') {
        setInputMode('dataset');
      }
      if (isJsonArray) {
        try {
          const parsed = JSON.parse(text);
          setDetectedCount(Array.isArray(parsed) ? parsed.length : 1);
        } catch {
          setDetectedCount(null);
        }
      } else {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const count = text.includes(',') && lines.length > 1 ? lines.length - 1 : lines.length;
        setDetectedCount(count);
      }
    } else {
      setDetectedCount(null);
    }
  }, [inputText, inputMode]);

  const samplePresets = [
    { label: 'vine.co', url: 'https://vine.co', note: '6-second looping video platform' },
    { label: 'theranos.com', url: 'https://theranos.com', note: 'Biotech blood diagnostic startup' },
    { label: 'geocities.com', url: 'https://geocities.com', note: 'Early personal web neighborhoods' },
    { label: 'google.com/reader', url: 'https://google.com/reader', note: 'RSS feed aggregator' },
    { label: 'pebble.com', url: 'https://pebble.com', note: 'Kickstarter e-paper smartwatch' },
    { label: 'internet-memory.onrender.com', url: 'https://internet-memory.onrender.com', note: 'Website history investigator' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (inputMode === 'dataset') {
      onBatchAnalyzeDataset(inputText.trim());
    } else {
      onInvestigate(inputText.trim(), customNotes.trim() || undefined);
    }
  };

  const handleSelectPreset = (url: string) => {
    setInputMode('single');
    setInputText(url);
    onInvestigate(url);
  };

  // Handle local file selection from device / file manager
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputMode('dataset');
        setInputText(content);
      }
    };
    reader.readAsText(file);
    // Reset file input value so user can re-select the same file if desired
    e.target.value = '';
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-10 px-6 border-b border-slate-200 bg-white">
      {/* Hidden native file input targeting user's file explorer */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json,.txt,.tsv,.sqlite,.db,.xml"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="max-w-4xl mx-auto text-center space-y-4">
        {/* Eyebrow */}
        <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center justify-center gap-2">
          <span>WEB HISTORY · EVIDENCE · CHANGE</span>
          {detectedCount !== null && (
            <span className="text-2xs bg-amber-100 text-amber-800 font-mono font-medium px-2 py-0.5 rounded-sm">
              Dataset Input ({detectedCount} records)
            </span>
          )}
        </div>

        {/* Clean Display Headline */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
          {inputMode === 'dataset' ? (
            <>Batch investigate an entire dataset</>
          ) : (
            <>What happened to that website?</>
          )}
        </h1>

        {/* Lead prose */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {inputMode === 'dataset'
            ? 'Inspect records from your local files or text. Gemini 3.8 Flash will cross-reference archival histories, identify macro failure patterns, and batch-triage all platforms.'
            : 'Investigate a URL using historical archive records, current availability checks, redirects, and content comparison.'}
        </p>

        {/* Mode Selector and Direct File Picker Connection */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setInputMode('single')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                inputMode === 'single' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Single URL Search
            </button>
            <button
              type="button"
              onClick={() => setInputMode('dataset')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'dataset' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Whole Dataset Input
              {detectedCount !== null && (
                <span className="text-2xs bg-slate-200 text-slate-800 font-mono px-1 rounded-sm">
                  {detectedCount}
                </span>
              )}
            </button>
          </div>

          {/* Primary Connection: Opens User's File Manager */}
          <button
            type="button"
            onClick={triggerFilePicker}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Open file explorer to select CSV, JSON, TXT, or DB files"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-700" />
            <span>Select File from Computer...</span>
          </button>
        </div>

        {/* Investigation Form */}
        <form onSubmit={handleSubmit} className="mt-4 max-w-2xl mx-auto space-y-3">
          {inputMode === 'dataset' ? (
            /* Multi-line Dataset Input */
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 shadow-xs focus-within:border-slate-800 transition-colors text-left space-y-2">
              <div className="flex items-center justify-between text-2xs text-slate-500 pb-1 border-b border-slate-200">
                <span className="font-medium flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                  {uploadedFileName ? (
                    <span className="text-emerald-700 font-mono font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected File: {uploadedFileName}
                    </span>
                  ) : (
                    <span>Paste or loaded dataset contents (CSV, JSON, URLs):</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={triggerFilePicker}
                  className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 font-medium"
                >
                  <FolderOpen className="w-3 h-3" />
                  Browse Different File
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                required
                placeholder="Paste CSV records, JSON array, or list of URLs here, or click 'Select File from Computer'..."
                className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-400 resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-2xs text-slate-500 font-mono">
                  {detectedCount !== null ? `${detectedCount} records detected` : 'Ready for batch processing'}
                </span>
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Dataset with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Analyze Entire Dataset with AI</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Single URL Input */
            <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 p-1.5 border border-slate-300 rounded-xl shadow-xs focus-within:border-slate-800 transition-colors">
              <div className="flex items-center gap-2 px-3 flex-1">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="https://example.com/page"
                  required
                  className="w-full text-sm text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-hidden py-2"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Investigating...</span>
                  </>
                ) : (
                  <>
                    <span>Investigate URL</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Helper note */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-1 gap-1">
            <span className="text-2xs text-slate-400">
              Checks are snapshots in time. A single failure is not proof that a website disappeared.
            </span>
            {inputMode === 'single' && (
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-2xs hover:text-slate-800 transition-colors underline cursor-pointer shrink-0"
              >
                {showAdvanced ? 'Hide context' : '+ Add historical context'}
              </button>
            )}
          </div>

          {showAdvanced && inputMode === 'single' && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-left">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Optional Context (e.g., suspected reason for closure or specific clues)
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={2}
                placeholder="Add clues, suspected reason for closure, or dataset annotations..."
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              />
            </div>
          )}
        </form>

        {/* Quick Presets */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Sample URLs:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleSelectPreset(preset.url)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-mono text-2xs cursor-pointer"
              title={preset.note}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

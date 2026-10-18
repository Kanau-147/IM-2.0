import React, { useState } from 'react';
import { Search, X, Loader2, ArrowUpRight, Sparkles, Database } from 'lucide-react';

interface InvestigateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvestigate: (url: string, notes?: string) => Promise<void>;
  onBatchAnalyzeDataset: (rawContent: string) => Promise<void>;
  isLoading: boolean;
}

export const InvestigateModal: React.FC<InvestigateModalProps> = ({
  isOpen,
  onClose,
  onInvestigate,
  onBatchAnalyzeDataset,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  if (!isOpen) return null;

  const isDataset = inputText.includes('\n') || (inputText.match(/,/g) || []).length >= 2 || inputText.startsWith('[');

  const samplePresets = [
    { label: 'vine.co', url: 'https://vine.co' },
    { label: 'theranos.com', url: 'https://theranos.com' },
    { label: 'geocities.com', url: 'https://geocities.com' },
    { label: 'google.com/reader', url: 'https://google.com/reader' },
    { label: 'pebble.com', url: 'https://pebble.com' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    if (isDataset) {
      await onBatchAnalyzeDataset(inputText.trim());
    } else {
      await onInvestigate(inputText.trim(), customNotes.trim() || undefined);
    }
    onClose();
  };

  const handleSelectPreset = (url: string) => {
    setInputText(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Investigate Website or Dataset</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter any URL or paste a dataset to retrieve historical evidence & AI autopsy
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target URL or Dataset (CSV / URLs):
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={isDataset ? 4 : 2}
                placeholder="https://example.com/page or paste list of URLs / CSV"
                autoFocus
                required
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-800 resize-none leading-relaxed"
              />
            </div>
            {isDataset && (
              <span className="text-2xs text-amber-700 font-mono mt-1 block">
                Dataset format detected — will run batch macro analysis.
              </span>
            )}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-2xs font-medium">Quick suggestions:</span>
            {samplePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono text-2xs transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Optional notes toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className="text-2xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
            >
              {showNotes ? 'Hide notes' : '+ Add historical context or clues'}
            </button>
            {showNotes && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Acquired in 2014, or shutdown rumors"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-400"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Start Investigation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

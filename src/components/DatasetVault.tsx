import React, { useState, useRef } from 'react';
import { DatasetItem } from '../types';
import { 
  Database, 
  Upload, 
  Download, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  FolderOpen,
  Check
} from 'lucide-react';

interface DatasetVaultProps {
  items: DatasetItem[];
  onInvestigateUrl: (url: string, notes?: string) => void;
  onImportDataset: (rawContent: string, format: 'csv' | 'json') => Promise<void>;
  onSelectExistingInvestigation: (id: string) => void;
  isLoading: boolean;
}

export const DatasetVault: React.FC<DatasetVaultProps> = ({
  items,
  onInvestigateUrl,
  onImportDataset,
  onSelectExistingInvestigation,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFormat, setImportFormat] = useState<'csv' | 'json'>('csv');
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.fate && item.fate.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Handle native file selection from local device
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const isJson = file.name.endsWith('.json');
    const formatToUse = isJson ? 'json' : 'csv';
    setImportFormat(formatToUse);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        try {
          await onImportDataset(content, formatToUse);
          setImportStatus(`Successfully imported "${file.name}" into your Dataset Vault!`);
          setTimeout(() => {
            setImportStatus(null);
            setShowImportModal(false);
          }, 1800);
        } catch (err: any) {
          setImportStatus(`Import notice: ${err.message || 'File loaded into editor below'}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleExecuteImport = async () => {
    if (!importText.trim()) return;
    try {
      await onImportDataset(importText.trim(), importFormat);
      setImportStatus('Dataset successfully parsed and appended to your vault!');
      setTimeout(() => {
        setImportStatus(null);
        setShowImportModal(false);
        setImportText('');
        setSelectedFileName(null);
      }, 1500);
    } catch (err: any) {
      setImportStatus(`Import error: ${err.message || 'Check syntax'}`);
    }
  };

  const handleExportCSV = () => {
    const header = ['URL', 'Name', 'Year Founded', 'Year Sunset', 'Category', 'Fate / Status', 'Notes'];
    const rows = items.map((i) => [
      `"${i.url}"`,
      `"${i.name}"`,
      i.yearFounded || '',
      i.yearSunset || '',
      `"${i.category}"`,
      `"${i.fate || 'Pending Investigation'}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `the-internets-memory-dataset-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for native OS file selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json,.txt,.tsv,.sqlite,.db,.xml"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Header and action bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-slate-700" />
              Website Investigation Dataset Vault
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curate, batch investigate, and import datasets of historical, defunct, or evolved web platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Direct button to open file manager */}
            <button
              onClick={triggerFilePicker}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Open your file browser to pick CSV, JSON, or DB files"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-700" />
              Select File from Device...
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Paste Dataset
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search website name, fate, or URL..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 mr-1 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-2xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Platform Name & URL</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Lifespan</th>
                <th className="py-3 px-4">Historical Fate</th>
                <th className="py-3 px-4 text-right">Investigation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                    No matching websites found. Click "Select File from Device" to load your dataset.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="font-mono text-2xs text-slate-500">{item.url}</div>
                      {item.notes && <div className="text-2xs text-slate-400 mt-0.5 line-clamp-1">{item.notes}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {item.yearFounded || '?'} — {item.yearSunset || 'Present'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-slate-800">
                        {item.fate || 'Unclassified'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.investigationId ? (
                        <button
                          onClick={() => onSelectExistingInvestigation(item.investigationId!)}
                          className="px-2.5 py-1 text-2xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          View Dossier
                        </button>
                      ) : (
                        <button
                          onClick={() => onInvestigateUrl(item.url, item.notes)}
                          disabled={isLoading}
                          className="px-2.5 py-1 text-2xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-slate-600" />
                          Investigate with AI
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="py-2.5 px-4 bg-slate-50/50 border-t border-slate-200 text-2xs text-slate-500 flex items-center justify-between">
          <span className="font-mono tabular-nums">Showing {filteredItems.length} of {items.length} records</span>
          <span>Compatible with CSV, JSON, and TSV files</span>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Import Dataset into Vault</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a file from your computer or paste records directly
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Direct File Picker Dropzone Banner */}
            <div 
              onClick={triggerFilePicker}
              className="p-4 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-lg text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100/70 space-y-1.5"
            >
              <FolderOpen className="w-6 h-6 text-slate-600 mx-auto" />
              <div className="text-xs font-semibold text-slate-800">
                Click to browse files on your computer
              </div>
              <div className="text-2xs text-slate-500">
                Accepts CSV, JSON, TXT, TSV, DB files
              </div>
              {selectedFileName && (
                <div className="text-xs font-mono font-medium text-emerald-700 pt-1 flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Loaded: {selectedFileName}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Format:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                  <button
                    onClick={() => setImportFormat('csv')}
                    className={`px-2.5 py-1 text-xs rounded-sm transition-colors cursor-pointer ${
                      importFormat === 'csv' ? 'bg-white text-slate-900 font-medium shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    CSV / TSV
                  </button>
                  <button
                    onClick={() => setImportFormat('json')}
                    className={`px-2.5 py-1 text-xs rounded-sm transition-colors cursor-pointer ${
                      importFormat === 'json' ? 'bg-white text-slate-900 font-medium shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    JSON
                  </button>
                </div>
              </div>

              <span className="text-2xs text-slate-400">Or paste raw text below</span>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={7}
              placeholder={
                importFormat === 'csv'
                  ? 'url,name,year_founded,year_sunset,category,fate,notes\nhttps://example.com,Example,2001,2008,Media,Acquired,Sample notes'
                  : '[\n  {\n    "url": "https://example.com",\n    "name": "Example",\n    "year_founded": 2001\n  }\n]'
              }
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-400 resize-none leading-relaxed"
            />

            {importStatus && (
              <div className={`p-2.5 rounded-lg text-xs ${
                importStatus.includes('error') ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
              }`}>
                {importStatus}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteImport}
                disabled={!importText.trim()}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                Import to Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

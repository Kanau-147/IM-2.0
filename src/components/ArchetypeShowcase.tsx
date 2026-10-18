import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Sparkles, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  RefreshCw,
  Plus
} from 'lucide-react';

interface ArchetypeShowcaseProps {
  onSelectArchetypePrompt: (prompt: string) => void;
}

export const ArchetypeShowcase: React.FC<ArchetypeShowcaseProps> = ({ onSelectArchetypePrompt }) => {
  const [selectedArchetype, setSelectedArchetype] = useState<'content' | 'kanban' | 'research' | 'feedback'>('content');
  
  // Content Studio state
  const [contentInput, setContentInput] = useState(
    'Introducing NextScale: A cloud automation platform that streamlines microservice orchestration, reduces latency by 35%, and automatically scales Kubernetes clusters based on predictive demand patterns.'
  );
  const [contentTone, setContentTone] = useState<'executive' | 'technical' | 'casual'>('executive');
  const [isProcessing, setIsProcessing] = useState(false);
  const [contentOutput, setContentOutput] = useState<string | null>(null);

  // Kanban state
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Implement Gemini 3.8 Flash live streaming', status: 'In Progress', priority: 'High', points: '5 pts' },
    { id: '2', title: 'Design zero-pill typography system', status: 'Done', priority: 'Medium', points: '3 pts' },
    { id: '3', title: 'Build telemetry-free dashboard architecture', status: 'Done', priority: 'High', points: '8 pts' },
    { id: '4', title: 'Add schema validation for app blueprint', status: 'Todo', priority: 'Low', points: '2 pts' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Feedback Classifier state
  const [feedbacks, setFeedbacks] = useState([
    { id: 'f1', customer: 'Acme Corp', text: 'The response latency on Gemini requests dropped significantly. Great release!', sentiment: 'Positive', tag: 'Performance' },
    { id: 'f2', customer: 'Starlight Inc', text: 'Would love if exports supported raw JSON along with Markdown.', sentiment: 'Neutral', tag: 'Feature Request' },
    { id: 'f3', customer: 'DataFlow Systems', text: 'Encountered a timeout when parsing a 50MB payload.', sentiment: 'Urgent', tag: 'Bug' },
  ]);
  const [feedbackResponseDraft, setFeedbackResponseDraft] = useState<string | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);

  // Research Synthesizer state
  const [researchTopic, setResearchTopic] = useState('Advances in Multimodal Reasoning with Gemini 3');
  const [researchSummary, setResearchSummary] = useState<string | null>(null);

  const handleGenerateContent = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Rewrite and analyze the following text for a ${contentTone} audience:\n"${contentInput}"\nProvide: 1. Polished Summary 2. Key Actionable Takeaways 3. Target Audience Positioning`,
        }),
      });
      const data = await res.json();
      setContentOutput(data.text || 'Generated content successfully.');
    } catch {
      setContentOutput(`[${contentTone.toUpperCase()} VERSION]\nNextScale eliminates manual orchestration bottlenecks by applying machine learning to real-time workload forecasting. With automated cluster rightsizing and a proven 35% latency reduction, operational teams achieve maximum infrastructure efficiency.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: String(Date.now()),
        title: newTaskTitle.trim(),
        status: 'Todo',
        priority: 'Medium',
        points: '3 pts',
      },
    ]);
    setNewTaskTitle('');
  };

  const handleMoveTask = (id: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDraftReply = async (feedbackItem: { id: string; customer: string; text: string }) => {
    setSelectedFeedbackId(feedbackItem.id);
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Draft a professional, empathetic customer support reply to ${feedbackItem.customer} who wrote: "${feedbackItem.text}". Keep it concise and solutions-oriented.`,
        }),
      });
      const data = await res.json();
      setFeedbackResponseDraft(data.text);
    } catch {
      setFeedbackResponseDraft(`Hello ${feedbackItem.customer} team,\n\nThank you for sharing your feedback regarding "${feedbackItem.text}". Our engineering team has logged this and we are actively optimizing this path in our upcoming release cycle.\n\nBest regards,\nPlatform Engineering Team`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunResearch = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Synthesize a structured research briefing on: "${researchTopic}". Include: 1. Core Technical Foundations 2. Architectural Breakthroughs 3. Industry Applications. Format with clear editorial markdown.`,
        }),
      });
      const data = await res.json();
      setResearchSummary(data.text);
    } catch {
      setResearchSummary(`### Research Briefing: ${researchTopic}\n\n1. Technical Foundations: Unified multimodal tokenization enables seamless cross-attentive processing between text, vision, and temporal audio.\n2. Key Innovations: Native native latency reduction with speculative decoding and hierarchical memory caching.\n3. Implementation: Applied to real-time interactive agents, complex document workflows, and high-throughput automation.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Archetype Selector Strip */}
      <div className="border-b border-slate-200 p-4 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Interactive Applet Archetypes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a pre-built archetype frequently used in Google AI Studio to test live features and workflows
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
            <button
              onClick={() => setSelectedArchetype('content')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedArchetype === 'content'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Document Studio
            </button>
            <button
              onClick={() => setSelectedArchetype('kanban')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedArchetype === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task Kanban
            </button>
            <button
              onClick={() => setSelectedArchetype('research')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedArchetype === 'research'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Research Digest
            </button>
            <button
              onClick={() => setSelectedArchetype('feedback')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedArchetype === 'feedback'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feedback Classifier
            </button>
          </div>
        </div>
      </div>

      {/* Archetype Body */}
      <div className="p-6">
        {selectedArchetype === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Document Intelligence & Content Transformation</h4>
                <p className="text-xs text-slate-500 mt-0.5">Analyzes, restyles, and extracts strategic takeaways via Gemini 3.8 Flash</p>
              </div>
              <button
                onClick={() => onSelectArchetypePrompt('Build a document intelligence app that rewrites text for executive, technical, or marketing audiences with actionable summaries')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                Use this template prompt <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Source Text / Document Extract
                  </label>
                  <textarea
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    rows={5}
                    className="w-full text-xs text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400 focus:bg-white resize-none"
                    placeholder="Paste text here..."
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Tone:</span>
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                      {(['executive', 'technical', 'casual'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setContentTone(t)}
                          className={`px-2.5 py-1 text-xs capitalize rounded-sm transition-colors ${
                            contentTone === t ? 'bg-white text-slate-900 font-medium shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateContent}
                    disabled={isProcessing}
                    className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Transform Content
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <span className="text-xs font-medium text-slate-700">Synthesized Output</span>
                    {contentOutput && (
                      <button
                        onClick={() => navigator.clipboard.writeText(contentOutput)}
                        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    )}
                  </div>
                  {contentOutput ? (
                    <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {contentOutput}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic py-10 text-center">
                      Click "Transform Content" to run Gemini analysis on the source text.
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-400 pt-3 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                  <span>Engine: Gemini 3.8 Flash</span>
                  <span>Latency ~180ms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedArchetype === 'kanban' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Agile Workflow & Sprint Board</h4>
                <p className="text-xs text-slate-500 mt-0.5">Interactive board with status pipelines and priority filters</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Filter:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                  {['all', 'High', 'Medium', 'Low'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-2 py-0.5 text-xs capitalize rounded-sm transition-colors ${
                        filterPriority === p ? 'bg-white text-slate-900 font-medium shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="New task title..."
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              />
              <button
                onClick={handleAddTask}
                className="px-3 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Todo', 'In Progress', 'Done'].map((statusCol) => {
                const colTasks = tasks.filter(
                  (t) => t.status === statusCol && (filterPriority === 'all' || t.priority === filterPriority)
                );
                return (
                  <div key={statusCol} className="bg-slate-50/70 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                      <span className="text-xs font-semibold text-slate-700">{statusCol}</span>
                      <span className="text-xs font-mono tabular-nums text-slate-400">{colTasks.length}</span>
                    </div>
                    <div className="space-y-2 min-h-32">
                      {colTasks.length === 0 ? (
                        <div className="text-xs text-slate-400 italic py-6 text-center">No tasks</div>
                      ) : (
                        colTasks.map((t) => (
                          <div key={t.id} className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs space-y-2">
                            <p className="text-xs font-medium text-slate-800 leading-snug">{t.title}</p>
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                              <span>{t.priority}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">{t.points}</span>
                              <div className="flex items-center gap-1">
                                {statusCol !== 'Todo' && (
                                  <button
                                    onClick={() => handleMoveTask(t.id, statusCol === 'Done' ? 'In Progress' : 'Todo')}
                                    className="text-slate-400 hover:text-slate-700 text-xs px-1"
                                    title="Move back"
                                  >
                                    ←
                                  </button>
                                )}
                                {statusCol !== 'Done' && (
                                  <button
                                    onClick={() => handleMoveTask(t.id, statusCol === 'Todo' ? 'In Progress' : 'Done')}
                                    className="text-slate-400 hover:text-slate-700 text-xs px-1"
                                    title="Move forward"
                                  >
                                    →
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedArchetype === 'research' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Research & Technical Synthesizer</h4>
                <p className="text-xs text-slate-500 mt-0.5">Deep query breakdown, structured technical synthesis, and markdown export</p>
              </div>
              <button
                onClick={() => onSelectArchetypePrompt('Build a research analysis assistant that breaks complex topics into technical foundations, architectural breakthroughs, and commercial applications')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                Use this template prompt <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="Enter technical topic or question..."
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              />
              <button
                onClick={handleRunResearch}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate Synthesis
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <span className="text-xs font-medium text-slate-700">Synthesized Knowledge Record</span>
                {researchSummary && (
                  <button
                    onClick={() => navigator.clipboard.writeText(researchSummary)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Markdown
                  </button>
                )}
              </div>
              {researchSummary ? (
                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {researchSummary}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic py-8 text-center">
                  Enter a topic and click "Generate Synthesis" to extract structured intelligence.
                </div>
              )}
            </div>
          </div>
        )}

        {selectedArchetype === 'feedback' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Customer Feedback & Sentiment Classifier</h4>
                <p className="text-xs text-slate-500 mt-0.5">Automated triage, sentiment classification, and tailored response drafts</p>
              </div>
              <button
                onClick={() => onSelectArchetypePrompt('Build a feedback triage system that parses customer comments, scores urgency, and generates tailored response drafts')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                Use this template prompt <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-medium text-slate-700 block">Incoming Customer Messages</span>
                {feedbacks.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedFeedbackId === item.id
                        ? 'border-slate-800 bg-slate-50/80 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => handleDraftReply(item)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-900">{item.customer}</span>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{item.tag}</span>
                        <span aria-hidden="true">·</span>
                        <span className={item.sentiment === 'Urgent' ? 'text-amber-700 font-medium' : 'text-slate-600'}>
                          {item.sentiment}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">{item.text}</p>
                    <div className="mt-2 text-right">
                      <span className="text-xs text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
                        Draft AI Response →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <span className="text-xs font-medium text-slate-700">Automated Reply Assistant</span>
                    {feedbackResponseDraft && (
                      <button
                        onClick={() => navigator.clipboard.writeText(feedbackResponseDraft)}
                        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy Reply
                      </button>
                    )}
                  </div>
                  {feedbackResponseDraft ? (
                    <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {feedbackResponseDraft}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic py-12 text-center">
                      Select an incoming customer message on the left to draft an AI-assisted response.
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-400 pt-3 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                  <span>Audience: Customer Success</span>
                  <span>Tone: Empathetic & Clear</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

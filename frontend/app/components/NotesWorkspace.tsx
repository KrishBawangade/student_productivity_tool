'use client';

import React, { useState } from 'react';
import { 
  FileText, Sparkles, Plus, Search, Filter, Trash2, Save, 
  Layers, Brain, CheckCircle2, ArrowRight, Zap, RefreshCw, 
  Tag, HelpCircle, BookOpen, Clock, Copy, Check
} from 'lucide-react';
import { NoteItem, Flashcard, CourseGrade } from '../types';

interface NotesWorkspaceProps {
  notes: NoteItem[];
  courses: CourseGrade[];
  onSaveNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onGenerateFlashcards: (noteTitle: string, cards: Flashcard[]) => void;
  onLaunchQuizFromNote: (quizData: { title: string; course: string; questions: any[] }) => void;
  onOpenCopilot: (initialPrompt?: string) => void;
}

export const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({
  notes,
  courses,
  onSaveNote,
  onDeleteNote,
  onGenerateFlashcards,
  onLaunchQuizFromNote,
  onOpenCopilot,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [activeViewTab, setActiveViewTab] = useState<'editor' | 'summary' | 'convert'>('editor');

  // Active Note State
  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];
  const [titleInput, setTitleInput] = useState(activeNote?.title || '');
  const [courseInput, setCourseInput] = useState(activeNote?.course || 'CS401');
  const [rawTextInput, setRawTextInput] = useState(activeNote?.rawText || '');
  const [summary, setSummary] = useState(activeNote?.summary || '');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(activeNote?.keyTakeaways || []);
  const [tags, setTags] = useState<string[]>(activeNote?.tags || []);
  const [tagInput, setTagInput] = useState('');

  // Status flags
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Sync state when active note selection changes
  React.useEffect(() => {
    if (activeNote) {
      setTitleInput(activeNote.title);
      setCourseInput(activeNote.course);
      setRawTextInput(activeNote.rawText);
      setSummary(activeNote.summary);
      setKeyTakeaways(activeNote.keyTakeaways || []);
      setTags(activeNote.tags || []);
    }
  }, [selectedNoteId]);

  // Filtered Notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCourse = selectedCourseFilter === 'all' || n.course === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  // Calculate Word Count
  const wordCount = rawTextInput.trim().split(/\s+/).filter(Boolean).length;

  // Create New Note Handler
  const handleCreateNewNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'Untitled Lecture Notes',
      course: courses[0]?.code || 'CS401',
      rawText: 'Paste or type your lecture notes here...',
      summary: '',
      keyTakeaways: [],
      tags: ['Lecture'],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
    setActiveViewTab('editor');
  };

  // Save current active note
  const handleSaveCurrentNote = () => {
    if (!activeNote) return;
    const updated: NoteItem = {
      ...activeNote,
      title: titleInput || 'Untitled Note',
      course: courseInput,
      rawText: rawTextInput,
      summary,
      keyTakeaways,
      tags,
      lastUpdated: new Date().toISOString(),
    };
    onSaveNote(updated);
  };

  // Trigger AI Summarize API
  const handleRunAiSummarizer = async () => {
    if (!rawTextInput.trim()) return;
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/notes/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput,
          course: courseInput,
          rawText: rawTextInput,
          action: 'summarize',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        setKeyTakeaways(data.keyTakeaways || []);
        setTags(data.tags || tags);
        
        // Auto-save
        if (activeNote) {
          onSaveNote({
            ...activeNote,
            title: titleInput,
            course: courseInput,
            rawText: rawTextInput,
            summary: data.summary,
            keyTakeaways: data.keyTakeaways || [],
            tags: data.tags || tags,
            lastUpdated: new Date().toISOString(),
          });
        }
        setActiveViewTab('summary');
      }
    } catch (err) {
      console.error('Failed to summarize note:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // 1-Click Flashcard Conversion
  const handleConvertFlashcards = async () => {
    if (!rawTextInput.trim()) return;
    setIsGeneratingCards(true);
    try {
      const res = await fetch('/api/notes/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput,
          course: courseInput,
          rawText: rawTextInput,
          action: 'convert_flashcards',
        }),
      });
      const data = await res.json();
      if (res.ok && data.flashcards) {
        onGenerateFlashcards(titleInput, data.flashcards);
      }
    } catch (err) {
      console.error('Failed to convert flashcards:', err);
    } finally {
      setIsGeneratingCards(false);
    }
  };

  // 1-Click Quiz Conversion
  const handleConvertQuiz = async () => {
    if (!rawTextInput.trim()) return;
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/notes/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput,
          course: courseInput,
          rawText: rawTextInput,
          action: 'convert_quiz',
        }),
      });
      const data = await res.json();
      if (res.ok && data.questions) {
        onLaunchQuizFromNote({
          title: data.title,
          course: data.course,
          questions: data.questions,
        });
      }
    } catch (err) {
      console.error('Failed to convert quiz:', err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Add tag handler
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Copy raw text to clipboard
  const handleCopyNote = () => {
    navigator.clipboard.writeText(rawTextInput);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 relative overflow-hidden shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  AI Smart Notes &amp; Lecture Workspace
                </h2>
                <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                  Active Recall Engine
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
                Paste lecture notes to generate instant summaries, key takeaways, SM-2 flashcard decks, and practice quizzes.
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateNewNote}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Note List Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Course Filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 text-xs font-bold w-full focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Courses ({notes.length})</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code}: {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center text-slate-500 text-xs font-medium shadow-2xs">
                No notes found matching query.
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = n.id === selectedNoteId;
                const courseObj = courses.find((c) => c.code === n.course);
                const badgeColor = courseObj?.color || '#4F46E5';

                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNoteId(n.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md text-white shadow-2xs"
                        style={{ backgroundColor: badgeColor }}
                      >
                        {n.course}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.lastUpdated || n.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm mt-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {n.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {n.summary || n.rawText}
                    </p>

                    {/* Footer Tags & Counts */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {n.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-extrabold">
                        {n.generatedFlashcardsCount ? (
                          <span>⚡ {n.generatedFlashcardsCount} Cards</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Workbench (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeNote ? (
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-5 bg-white/90 shadow-2xs">
              
              {/* Header Editor Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-2 flex-1">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Lecture Note Title..."
                    className="w-full bg-transparent text-xl font-extrabold text-slate-900 placeholder-slate-400 focus:outline-none border-b border-transparent focus:border-indigo-500 pb-1"
                  />
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 font-bold">Course:</span>
                    <select
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      className="bg-slate-100 border border-slate-200 text-indigo-700 font-extrabold rounded-xl px-3 py-1 focus:outline-none focus:border-indigo-500"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.code}: {c.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-medium">{wordCount} words</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyNote}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                    title="Copy Raw Text"
                  >
                    {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToast ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleSaveCurrentNote}
                    className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>

                  <button
                    onClick={() => onDeleteNote(activeNote.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/90 text-xs font-bold">
                <button
                  onClick={() => setActiveViewTab('editor')}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    activeViewTab === 'editor'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Raw Lecture Text</span>
                </button>

                <button
                  onClick={() => setActiveViewTab('summary')}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    activeViewTab === 'summary'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Summary &amp; Takeaways</span>
                </button>

                <button
                  onClick={() => setActiveViewTab('convert')}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    activeViewTab === 'convert'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>1-Click Convert Hub</span>
                </button>
              </div>

              {/* TAB 1: Editor View */}
              {activeViewTab === 'editor' && (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      rows={14}
                      value={rawTextInput}
                      onChange={(e) => setRawTextInput(e.target.value)}
                      placeholder="Paste your raw lecture notes, slide transcriptions, or textbook summaries here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 text-sm leading-relaxed font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Dynamic Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-600" />
                      Note Tags &amp; Keywords:
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5"
                        >
                          #{t}
                          <button
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-rose-600 text-slate-400 transition-colors font-extrabold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add tag (Press Enter)..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Primary AI Summarize Trigger */}
                  <div className="pt-2">
                    <button
                      onClick={handleRunAiSummarizer}
                      disabled={isSummarizing || !rawTextInput.trim()}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.01] cursor-pointer"
                    >
                      {isSummarizing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Extracting Key Concepts &amp; Summarizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Generate AI Summary &amp; Key Takeaways</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: AI Summary & Takeaways View */}
              {activeViewTab === 'summary' && (
                <div className="space-y-5">
                  {summary ? (
                    <>
                      {/* Executive Summary Card */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/90 rounded-2xl p-5 space-y-2 shadow-2xs">
                        <div className="flex items-center gap-2 text-indigo-900 text-xs font-extrabold uppercase tracking-wider">
                          <Brain className="w-4 h-4 text-indigo-600" />
                          <span>Executive AI Summary</span>
                        </div>
                        <p className="text-slate-800 text-sm leading-relaxed font-medium">
                          {summary}
                        </p>
                      </div>

                      {/* Key Takeaways */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Key Takeaways &amp; Core Principles
                        </h4>
                        <div className="space-y-2.5">
                          {keyTakeaways.map((point, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm font-medium flex items-start gap-3 shadow-2xs"
                            >
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                      <Sparkles className="w-8 h-8 text-indigo-500 mx-auto opacity-70" />
                      <h4 className="text-slate-900 font-extrabold text-sm">No Summary Generated Yet</h4>
                      <p className="text-slate-500 text-xs max-w-md mx-auto font-medium">
                        Click the button below to analyze raw notes and extract structured key takeaways using AI.
                      </p>
                      <button
                        onClick={handleRunAiSummarizer}
                        disabled={isSummarizing}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-sm cursor-pointer"
                      >
                        Run AI Summarizer
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: 1-Click Conversion Hub */}
              {activeViewTab === 'convert' && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs font-medium text-indigo-900 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>
                      Convert lecture notes into study assets with one click. Generated cards and quizzes automatically reward XP and save to your persistent workspace!
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: Convert to Flashcard Deck */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between shadow-2xs">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Layers className="w-5 h-5" />
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                          <span>Generate Flashcard Deck</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-extrabold">
                            +75 XP
                          </span>
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed font-medium">
                          Extract 3-5 structured SM-2 Active Recall cards from key note definitions and formulas.
                        </p>
                      </div>

                      <button
                        onClick={handleConvertFlashcards}
                        disabled={isGeneratingCards || !rawTextInput.trim()}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        {isGeneratingCards ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Building Deck...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>Generate &amp; Add Cards</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Option 2: Convert to Interactive Quiz */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-purple-300 transition-all flex flex-col justify-between shadow-2xs">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                          <span>Generate Practice Quiz</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-extrabold">
                            +100 XP
                          </span>
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed font-medium">
                          Generate a 4-question interactive practice quiz and test your knowledge immediately.
                        </p>
                      </div>

                      <button
                        onClick={handleConvertQuiz}
                        disabled={isGeneratingQuiz || !rawTextInput.trim()}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        {isGeneratingQuiz ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Creating Quiz...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Create &amp; Launch Quiz</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Option 3: Copilot Prompt Banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="space-y-1 text-left">
                      <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-400" />
                        Discuss Note with AI Study Copilot
                      </h4>
                      <p className="text-slate-300 text-xs font-medium">
                        Open Copilot with note context to ask follow-up questions, explain complex math, or request examples.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        onOpenCopilot(
                          `I'm studying my lecture note on "${titleInput}". Can you explain the main concepts in detail?`
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Ask Copilot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl border border-slate-200/90 text-center text-slate-500 font-medium">
              Select or create a note to start editing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

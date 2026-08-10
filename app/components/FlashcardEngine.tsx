'use client';

import React, { useState } from 'react';
import { Brain, RefreshCw, Sparkles, Plus, CheckCircle2, ChevronRight, ChevronLeft, BookOpen, Code2 } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardEngineProps {
  cards: Flashcard[];
  onRateCard: (cardId: string, rating: 1 | 2 | 3 | 4, xpAmount: number) => void;
  onAddCards: (newCards: Flashcard[]) => void;
}

export const FlashcardEngine: React.FC<FlashcardEngineProps> = ({
  cards,
  onRateCard,
  onAddCards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);

  // AI Modal inputs
  const [genSubject, setGenSubject] = useState('Computer Science');
  const [genTopic, setGenTopic] = useState('');
  const [genNotes, setGenNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleRating = (rating: 1 | 2 | 3 | 4) => {
    let xp = 20;
    if (rating === 1) xp = 5;
    if (rating === 2) xp = 10;
    if (rating === 3) xp = 20;
    if (rating === 4) xp = 35;

    if (currentCard) {
      onRateCard(currentCard.id, rating, xp);
    }
    handleNext();
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic && !genNotes) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: genSubject,
          topic: genTopic,
          sourceText: genNotes,
          cardCount: 3,
        }),
      });

      const data = await res.json();
      if (data?.cards) {
        onAddCards(data.cards);
        setIsGenModalOpen(false);
        setGenTopic('');
        setGenNotes('');
        setCurrentIndex(cards.length); // Focus on newly generated deck
      }
    } catch {
      // error fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = cards.filter((c) => c.mastered || c.repetitions > 1).length;
  const masteryPercentage = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
            <Brain className="w-5 h-5" />
            <span>AI Active Recall Deck (SM-2 SRS)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGenModalOpen(true)}
              className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Auto-Generate</span>
            </button>
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="mb-4 bg-slate-100/80 p-2.5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Deck Memory Retention:</span>
            <span className="text-emerald-700 font-mono">{masteryPercentage}% Mastered</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </div>

        {/* 3D Flip Card Container */}
        {currentCard ? (
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 my-4 cursor-pointer min-h-[240px] w-full group relative"
          >
            <div
              className={`relative w-full min-h-[240px] duration-500 transform-style-3d rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-sm ${
                isFlipped
                  ? 'rotate-y-180 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-700 text-white shadow-xl'
                  : 'bg-white border-slate-200 hover:border-emerald-500'
              }`}
            >
              {/* Front Side */}
              {!isFlipped ? (
                <div className="flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {currentCard.topic}
                      </span>
                      <span className="text-xs font-extrabold text-amber-600 font-mono">
                        EF: {currentCard.easeFactor.toFixed(2)}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-4 leading-snug">
                      {currentCard.question}
                    </h4>

                    {currentCard.codeSnippet && (
                      <div className="mt-3 bg-slate-900 text-slate-200 p-3 rounded-xl text-xs font-mono border border-slate-800 overflow-x-auto">
                        <div className="text-[10px] text-slate-400 font-bold mb-1 flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-indigo-400" />
                          Code Reference
                        </div>
                        <pre>{currentCard.codeSnippet}</pre>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Click anywhere on card to reveal answer</span>
                  </div>
                </div>
              ) : (
                /* Back Side */
                <div className="flex flex-col justify-between h-full rotate-y-180 text-white space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-mono">
                        SM-2 ACTIVE RECALL SOLUTION
                      </span>
                      <span className="text-xs text-indigo-300 font-mono">
                        Interval: {currentCard.interval}d
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed font-medium">
                      {currentCard.answer}
                    </p>
                  </div>

                  {/* SM-2 Recall Difficulty Buttons */}
                  <div className="pt-2 border-t border-indigo-900/60">
                    <p className="text-[11px] text-slate-300 font-bold mb-2 text-center">
                      Rate Your Recall (SuperMemo-2 Spaced Repetition):
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(1);
                        }}
                        className="py-2 rounded-xl bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 text-xs font-extrabold border border-rose-400/40 font-mono"
                      >
                        1. Again (+5 XP)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(2);
                        }}
                        className="py-2 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 text-xs font-extrabold border border-amber-400/40 font-mono"
                      >
                        2. Hard (+10 XP)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(3);
                        }}
                        className="py-2 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 text-indigo-100 text-xs font-extrabold border border-indigo-400/40 font-mono"
                      >
                        3. Good (+20 XP)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(4);
                        }}
                        className="py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-md font-mono"
                      >
                        4. Easy (+35 XP)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-semibold text-xs">
            No flashcards in deck. Click &quot;AI Auto-Generate&quot; to create cards!
          </div>
        )}

        {/* Card Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/80">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev Card
          </button>

          <span className="font-extrabold font-mono text-slate-900">
            Card {currentIndex + 1} of {cards.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900"
          >
            Next Card
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Card Generator Modal */}
      {isGenModalOpen && (
        <div 
          onClick={() => setIsGenModalOpen(false)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="glass-panel p-6 sm:p-7 rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 cursor-default"
          >
            <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-lg mb-2">
              <Sparkles className="w-5 h-5" />
              <h3>AI Flashcard Deck Generator</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              Paste your lecture notes or enter a topic to automatically extract key concepts into SM-2 flashcards!
            </p>

            <form onSubmit={handleAiGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={genSubject}
                    onChange={(e) => setGenSubject(e.target.value)}
                    className="glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backpropagation Math"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lecture Notes / Textbook Excerpt (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste your notes here to extract questions and answers..."
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  className="glass-input text-xs font-mono resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGenModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Deck...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate 3 Cards</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

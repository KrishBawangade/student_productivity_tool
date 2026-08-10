'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, XCircle, Award, Clock, ArrowRight, RotateCcw, Brain, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizAttempt } from '../types';

interface QuizEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: (attempt: QuizAttempt) => void;
}

export const QuizEngineModal: React.FC<QuizEngineModalProps> = ({
  isOpen,
  onClose,
  onQuizComplete,
}) => {
  const [topic, setTopic] = useState('Neural Networks Backpropagation');
  const [courseCode, setCourseCode] = useState('CS401');
  const [sourceText, setSourceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          sourceText,
          courseCode,
          questionCount: 4,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setUserAnswers([]);
        setIsSubmitted(false);
        setIsFinished(false);
      }
    } catch {
      // fallback mock questions if offline
      setQuestions([
        {
          id: 'fb_1',
          question: `What primary mathematical operation computes loss gradients in ${topic}?`,
          options: [
            'Chain Rule Derivative Updates',
            'Simple Arithmetic Mean',
            'Bitwise Shift Left',
            'Modular Arithmetic'
          ],
          correctIndex: 0,
          explanation: 'The chain rule enables backwards propagation of errors across computational graphs.'
        },
        {
          id: 'fb_2',
          question: `How does learning rate hyperparameter impact optimization in ${topic}?`,
          options: [
            'High learning rates risk overshooting global minima',
            'Zero learning rate speeds up convergence infinitely',
            'Learning rate has no effect on parameter updates',
            'It only alters CPU fan speed'
          ],
          correctIndex: 0,
          explanation: 'High learning rates cause step instability while small rates lead to slow convergence.'
        }
      ]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setUserAnswers([]);
      setIsSubmitted(false);
      setIsFinished(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    setUserAnswers((prev) => [...prev, selectedOption]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz Finished!
      setIsFinished(true);
      const correctCount = userAnswers.filter((ans, idx) => ans === questions[idx].correctIndex).length + 
                           (selectedOption === questions[currentIndex].correctIndex ? 1 : 0);
      const total = questions.length;
      const xp = correctCount * 30 + 30; // base + bonus per correct

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#0284C7', '#059669', '#F59E0B'],
        });
      } catch {
        // fallback
      }

      onQuizComplete({
        id: `q_attempt_${Date.now()}`,
        title: `${courseCode}: ${topic}`,
        course: courseCode,
        score: correctCount,
        totalQuestions: total,
        date: new Date().toISOString().split('T')[0],
        xpEarned: xp,
      });
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setIsFinished(false);
    setIsSubmitted(false);
    setSelectedOption(null);
    setUserAnswers([]);
  };

  const currentQ = questions[currentIndex];
  const finalCorrectCount = userAnswers.reduce((acc, ans, idx) => acc + (ans === questions[idx]?.correctIndex ? 1 : 0), 0);

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white border border-slate-200/90 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto cursor-default"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Interactive Practice Quiz</h2>
            <p className="text-xs text-slate-500 font-semibold">Test active recall retention with instant Socratic feedback</p>
          </div>
        </div>

        {/* STEP 1: GENERATOR FORM */}
        {questions.length === 0 && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Course Code</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. CS401"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Topic Title</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Backpropagation & Optimization"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lecture Notes / Excerpt (Optional)</span>
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste raw lecture notes, slide text, or textbook excerpt here to extract custom quiz questions..."
              />
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || !topic}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing AI Quiz Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Practice Quiz (+100 XP Potential)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: ACTIVE QUIZ DISPLAY */}
        {questions.length > 0 && !isFinished && (
          <div className="space-y-6 pt-2">
            
            {/* Progress & Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 font-mono">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Untimed Practice</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = 'border-slate-200 hover:border-indigo-300 bg-slate-50/50 text-slate-800';

                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-red-400 bg-red-50 text-red-900 font-bold';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-50 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-mono font-extrabold flex items-center justify-center text-xs text-slate-700 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>

                    {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Socratic Feedback Box */}
            {isSubmitted && (
              <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-xs space-y-1 animate-fadeIn">
                <div className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>Socratic Explanation:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* STEP 3: SCORE REPORT */}
        {isFinished && (
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200 shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Quiz Completed! 🎉</h3>
              <p className="text-sm text-slate-500 font-semibold">
                You scored <span className="font-black text-indigo-600 font-mono">{finalCorrectCount}</span> out of{' '}
                <span className="font-black text-slate-900 font-mono">{questions.length}</span> questions correctly.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 font-extrabold text-xs font-mono">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>+{finalCorrectCount * 30 + 30} XP Earned</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={resetQuiz}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

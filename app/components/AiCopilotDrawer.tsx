'use client';

import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send, X, Copy, Check, Terminal, Brain, HelpCircle, Code } from 'lucide-react';
import { CopilotMessage } from '../types';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello Alex! I am your 24/7 AI Study Copilot. How can I assist your academic work today? Select a mode below or type your question!',
      mode: 'general',
      timestamp: '10:00 AM',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'eli5' | 'socratic' | 'formula' | 'general'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendMessage = async (customQuery?: string, customMode?: 'eli5' | 'socratic' | 'formula' | 'general') => {
    const textToSend = customQuery || inputQuery;
    const modeToSend = customMode || selectedMode;

    if (!textToSend.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      mode: modeToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode: modeToSend,
        }),
      });

      const data = await res.json();

      const aiMsg: CopilotMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'Here is the response to your query.',
        codeSnippet: data.codeSnippet,
        mode: modeToSend,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'Apologies, I encountered a temporary connection issue while processing your request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-lg bg-slate-950 text-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-800 relative animate-in slide-in-from-right duration-300 cursor-default"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">AI Study Copilot</h3>
              <p className="text-[11px] text-slate-400 font-mono">GPT-4o Academic Tutor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Prompt Pills */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setSelectedMode('eli5');
              handleSendMessage('Explain Backpropagation in Neural Networks', 'eli5');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all border ${
              selectedMode === 'eli5'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Feynman ELI5</span>
          </button>

          <button
            onClick={() => {
              setSelectedMode('socratic');
              handleSendMessage('Quiz me on Operating System Semaphores', 'socratic');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all border ${
              selectedMode === 'socratic'
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Socratic Quiz</span>
          </button>

          <button
            onClick={() => {
              setSelectedMode('formula');
              handleSendMessage('Break down Binary Cross Entropy Formula', 'formula');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all border ${
              selectedMode === 'formula'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Formula Breakdown</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-4 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-inner'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>{msg.sender === 'user' ? 'You' : 'AI Copilot'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed font-mono">{msg.text}</div>

                {msg.codeSnippet && (
                  <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 relative group">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-slate-400" /> Code Snippet
                      </span>
                      <button
                        onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto">{msg.codeSnippet}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-400 py-2 font-mono text-xs animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Generating response with GPT-4o...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your courses, equations, or notes..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

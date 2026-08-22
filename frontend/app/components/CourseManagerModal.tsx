'use client';

import React, { useState } from 'react';
import { X, BookOpen, Plus, Trash2, Calculator, Check, Sparkles } from 'lucide-react';
import { CourseGrade } from '../types';

interface CourseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseGrade[];
  onAddCourse: (newCourse: CourseGrade) => void;
}

export const CourseManagerModal: React.FC<CourseManagerModalProps> = ({
  isOpen,
  onClose,
  courses,
  onAddCourse,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [currentGrade, setCurrentGrade] = useState(85);
  const [targetGrade, setTargetGrade] = useState(90);
  const [examWeight, setExamWeight] = useState(30);
  const [color, setColor] = useState('#4F46E5');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newCourse: CourseGrade = {
      id: `c_${Date.now()}`,
      code: code.toUpperCase(),
      name,
      currentGrade: Number(currentGrade),
      targetGrade: Number(targetGrade),
      examWeight: Number(examWeight),
      color,
    };

    onAddCourse(newCourse);
    setCode('');
    setName('');
  };

  // Calculate Cumulative GPA approximation (4.0 scale)
  const calculateGpa = (percentage: number) => {
    if (percentage >= 93) return 4.0;
    if (percentage >= 90) return 3.7;
    if (percentage >= 87) return 3.3;
    if (percentage >= 83) return 3.0;
    if (percentage >= 80) return 2.7;
    if (percentage >= 77) return 2.3;
    if (percentage >= 73) return 2.0;
    return 1.7;
  };

  const avgCurrentGrade = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.currentGrade, 0) / courses.length)
    : 0;

  const currentGpa = calculateGpa(avgCurrentGrade);

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
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Course & Syllabus Manager</h2>
            <p className="text-xs text-slate-500 font-semibold">Track enrolled modules, grade targets & cumulative GPA</p>
          </div>
        </div>

        {/* GPA Summary Card */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl text-white flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">Estimated Cumulative GPA</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white">{currentGpa.toFixed(2)}</span>
              <span className="text-xs text-indigo-200 font-medium">/ 4.00 Scale</span>
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <span className="text-xs font-bold text-slate-300">Average Grade</span>
            <div className="text-xl font-black text-emerald-400 font-mono">{avgCurrentGrade}%</div>
          </div>
        </div>

        {/* Course List Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Enrolled Academic Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.map((c) => (
              <div key={c.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-10 rounded-lg" style={{ backgroundColor: c.color }} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-slate-900">{c.code}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                        Exam {c.examWeight}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{c.name}</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-black text-slate-900">{c.currentGrade}%</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Target {c.targetGrade}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Course Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add New Academic Course</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600">Course Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS305"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600">Course Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600">Current Grade (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600">Target Grade (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={targetGrade}
                onChange={(e) => setTargetGrade(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course to Syllabus</span>
          </button>
        </form>

      </div>
    </div>
  );
};

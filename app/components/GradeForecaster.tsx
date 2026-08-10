'use client';

import React, { useState } from 'react';
import { TrendingUp, Sliders, AlertCircle, CheckCircle2, ShieldAlert, Plus, Calculator, BookOpen } from 'lucide-react';
import { CourseGrade } from '../types';

interface GradeForecasterProps {
  courses: CourseGrade[];
  onAddCourse: (course: CourseGrade) => void;
}

export const GradeForecaster: React.FC<GradeForecasterProps> = ({ courses, onAddCourse }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'c1');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [targetGrade, setTargetGrade] = useState(selectedCourse?.targetGrade || 92);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New course modal state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCurrentGrade, setNewCurrentGrade] = useState(85);
  const [newTargetGrade, setNewTargetGrade] = useState(90);
  const [newExamWeight, setNewExamWeight] = useState(30);

  const calculateRequiredExamScore = (current: number, target: number, weightPct: number) => {
    const w = weightPct / 100;
    const wCompleted = 1 - w;
    const required = (target - current * wCompleted) / w;
    return Math.round(required * 10) / 10;
  };

  const currentGrade = selectedCourse ? selectedCourse.currentGrade : 86;
  const examWeight = selectedCourse ? selectedCourse.examWeight : 30;
  const requiredExamScore = calculateRequiredExamScore(currentGrade, targetGrade, examWeight);

  const getStatusInfo = (score: number) => {
    if (score <= 75) {
      return {
        label: 'SAFE',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        message: 'Comfortable Target — You are well on track!',
        icon: CheckCircle2,
      };
    }
    if (score <= 89.9) {
      return {
        label: 'MODERATE',
        color: 'bg-sky-100 text-sky-800 border-sky-300',
        message: 'Achievable Target — Requires solid final exam preparation.',
        icon: TrendingUp,
      };
    }
    if (score <= 99.9) {
      return {
        label: 'HIGH',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        message: 'High Target — Near-perfect exam score needed.',
        icon: AlertCircle,
      };
    }
    return {
      label: 'EXTRA CREDIT REQUIRED',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      message: 'Extra Credit Needed — Unachievable on final exam score alone.',
      icon: ShieldAlert,
    };
  };

  const status = getStatusInfo(requiredExamScore);
  const StatusIcon = status.icon;

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const colors = ['#4F46E5', '#0284C7', '#059669', '#D97706', '#9333EA'];
    const randomColor = colors[courses.length % colors.length];

    const created: CourseGrade = {
      id: `c_${Date.now()}`,
      code: newCode,
      name: newName,
      currentGrade: newCurrentGrade,
      targetGrade: newTargetGrade,
      examWeight: newExamWeight,
      color: randomColor,
    };

    onAddCourse(created);
    setSelectedCourseId(created.id);
    setTargetGrade(newTargetGrade);
    setIsModalOpen(false);
  };

  return (
    <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Grade Target Forecaster &amp; Analytics
            </h3>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        </div>

        {/* Course Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setTargetGrade(course.targetGrade);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedCourseId === course.id
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {course.code}: {course.currentGrade}%
            </button>
          ))}
        </div>

        {/* Selected Course Forecaster Card */}
        {selectedCourse && (
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                  {selectedCourse.code}
                </span>
                <h4 className="text-base font-extrabold text-slate-900">{selectedCourse.name}</h4>
              </div>

              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] text-slate-500 font-bold uppercase">Current Course Standing</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5 font-mono">
                  {selectedCourse.currentGrade}%
                </div>
                <span className="text-[10px] text-slate-400 font-medium">To Date</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] text-indigo-900 font-bold uppercase">Target Desired Grade</span>
                <div className="text-2xl font-extrabold text-indigo-600 mt-0.5 font-mono">
                  {targetGrade}%
                </div>
                <span className="text-[10px] text-indigo-600 font-bold">Goal Target</span>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-sky-50 p-3.5 rounded-2xl border border-indigo-200 text-center shadow-xs">
                <span className="text-[11px] text-indigo-950 font-bold uppercase">Required Final Exam</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-0.5 font-mono">
                  {requiredExamScore}%
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">
                  Weight: {selectedCourse.examWeight}%
                </span>
              </div>
            </div>

            {/* Interactive Target Grade What-If Slider */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mt-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive What-If Grade Slider:</span>
                </span>
                <span className="text-indigo-600 font-extrabold text-sm font-mono">{targetGrade}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={targetGrade}
                onChange={(e) => setTargetGrade(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Warning Banner */}
      <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold ${status.color}`}>
        <StatusIcon className="w-4 h-4 shrink-0" />
        <span>{status.message}</span>
      </div>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-lg mb-2">
              <Calculator className="w-5 h-5" />
              <h3>Add Course Target</h3>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS305"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="glass-input uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Operating Systems"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newCurrentGrade}
                    onChange={(e) => setNewCurrentGrade(Number(e.target.value))}
                    className="glass-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newTargetGrade}
                    onChange={(e) => setNewTargetGrade(Number(e.target.value))}
                    className="glass-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Final Weight %</label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    required
                    value={newExamWeight}
                    onChange={(e) => setNewExamWeight(Number(e.target.value))}
                    className="glass-input font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

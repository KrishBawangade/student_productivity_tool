'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Tag, Calendar, AlertCircle, Filter } from 'lucide-react';
import { Task } from '../types';

interface QuestMatrixProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const QuestMatrix: React.FC<QuestMatrixProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [filterCourse, setFilterCourse] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS401 AI');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newDueDate, setNewDueDate] = useState('Today, 11:59 PM');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const xpAmount = newPriority === 'high' ? 50 : newPriority === 'medium' ? 35 : 20;

    onAddTask({
      title: newTitle.trim(),
      course: newCourse,
      priority: newPriority,
      dueDate: newDueDate || 'Today',
      xp: xpAmount,
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  const courses = Array.from(new Set(tasks.map((t) => t.course)));

  const filteredTasks = tasks.filter((task) => {
    const matchesCourse = filterCourse === 'ALL' || task.course === filterCourse;
    const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
    return matchesCourse && matchesPriority;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Assignment Quest Matrix</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              {completedCount}/{tasks.length} Completed
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Quest</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 text-xs">
          <span className="font-extrabold text-slate-600 flex items-center gap-1">
            <Filter className="w-3 h-3 text-indigo-600" />
            Filter:
          </span>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="high">🔥 High Priority (+50 XP)</option>
            <option value="medium">⚡ Medium Priority (+35 XP)</option>
            <option value="low">🌱 Low Priority (+20 XP)</option>
          </select>
        </div>

        {/* Task List */}
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-semibold">
              No tasks found for selected filters. Click &quot;New Quest&quot; to add one!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  task.completed
                    ? 'bg-emerald-50/70 border-emerald-200/90 text-slate-400 line-through'
                    : 'bg-white border-slate-200/90 hover:border-indigo-400 text-slate-900 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-indigo-500 shrink-0 hover:scale-110 transition-transform" />
                  )}

                  <div>
                    <div className="text-xs sm:text-sm font-extrabold leading-snug">{task.title}</div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-1">
                      <span className="text-indigo-600 font-bold flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {task.course}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg font-mono ${
                      task.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.priority === 'high'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : task.priority === 'medium'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    +{task.xp} XP
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Matrix Stats Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-semibold">
        <span className="flex items-center gap-1 text-emerald-700">
          <AlertCircle className="w-3.5 h-3.5" />
          Active Quest Multiplier: 1.5x XP
        </span>
        <span className="text-indigo-700 font-bold font-mono">
          +{filteredTasks.filter((t) => !t.completed).reduce((acc, curr) => acc + curr.xp, 0)} XP Potential
        </span>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="glass-panel p-6 sm:p-7 rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 cursor-default"
          >
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">Create New Quest</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dijkstra Algorithm HW"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS401 AI"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Quadrant</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="glass-input font-bold"
                  >
                    <option value="high">🔥 High (+50 XP)</option>
                    <option value="medium">⚡ Medium (+35 XP)</option>
                    <option value="low">🌱 Low (+20 XP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="text"
                  placeholder="e.g. Tomorrow, 11:59 PM"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="glass-input"
                />
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
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Quest</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

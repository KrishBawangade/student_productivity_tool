'use client';

import React from 'react';
import { 
  BarChart3, TrendingUp, Clock, Brain, Award, Flame, Zap, 
  CheckCircle2, Target, Calendar, Sparkles
} from 'lucide-react';
import { Task, Flashcard, CourseGrade, UserProfile, StudySession, QuizAttempt } from '../types';

interface StudyAnalyticsProps {
  user: UserProfile;
  tasks: Task[];
  cards: Flashcard[];
  courses: CourseGrade[];
  sessions: StudySession[];
  quizAttempts: QuizAttempt[];
}

export const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({
  user,
  tasks,
  cards,
  courses,
  sessions,
  quizAttempts,
}) => {
  // Compute analytics
  const totalFocusMins = sessions.reduce((acc, s) => acc + s.durationMinutes, user.totalFocusMinutes);
  const totalHours = (totalFocusMins / 60).toFixed(1);
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  const masteredCardsCount = cards.filter((c) => c.mastered).length;
  const cardMasteryRate = cards.length > 0 ? Math.round((masteredCardsCount / cards.length) * 100) : 0;

  // Mock days of the week data for the focus graph
  const daysData = [
    { day: 'Mon', mins: 45, label: '0.75h' },
    { day: 'Tue', mins: 90, label: '1.5h' },
    { day: 'Wed', mins: 60, label: '1.0h' },
    { day: 'Thu', mins: 120, label: '2.0h' },
    { day: 'Fri', mins: 80, label: '1.3h' },
    { day: 'Sat', mins: 150, label: '2.5h' },
    { day: 'Sun', mins: 105, label: '1.75h' },
  ];

  const maxMins = Math.max(...daysData.map((d) => d.mins), 1);

  // Subject distribution
  const courseMinsMap: Record<string, number> = {};
  sessions.forEach((s) => {
    courseMinsMap[s.course] = (courseMinsMap[s.course] || 0) + s.durationMinutes;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Focus Hours */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/90 flex items-center justify-between relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Focus Time</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{totalHours}</span>
              <span className="text-sm font-extrabold text-slate-600">Hours</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% vs last week
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Quest Velocity */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/90 flex items-center justify-between relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quest Velocity</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{taskCompletionRate}%</span>
            </div>
            <p className="text-[11px] font-semibold text-sky-600">
              {completedTasksCount} of {tasks.length} Quests done
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Flashcard Retention */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/90 flex items-center justify-between relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SM-2 Mastery</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{cardMasteryRate}%</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-600">
              {masteredCardsCount} Deck cards mastered
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
        </div>

        {/* Scholar Streak */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/90 flex items-center justify-between relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scholar Streak</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{user.streak}</span>
              <span className="text-sm font-extrabold text-amber-600">Days</span>
            </div>
            <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> Active Multiplier (1.5x XP)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
        </div>

      </div>

      {/* Main Analytics Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Focus Time Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Weekly Focus Volume</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Hours logged per day across Pomodoro soundscapes</p>
            </div>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flow Peak: Sat (2.5h)</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2 px-2 flex items-end justify-between gap-3 h-48 border-b border-slate-100">
            {daysData.map((item, idx) => {
              const heightPercent = Math.round((item.mins / maxMins) * 100);
              const isPeak = item.mins === maxMins;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200">
                    {item.label}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end p-0.5">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isPeak 
                          ? 'bg-gradient-to-t from-indigo-600 to-sky-500 shadow-md shadow-indigo-500/30' 
                          : 'bg-indigo-500/80 group-hover:bg-indigo-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Footnote */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              <span>Pomodoro Work Focus</span>
            </span>
            <span>Target: 2.0h / day</span>
          </div>
        </div>

        {/* Subject Focus Distribution & Course Mastery */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>Subject Focus Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Time allocation by course module</p>
          </div>

          <div className="space-y-4">
            {courses.map((course) => {
              const mins = courseMinsMap[course.code] || (course.code === 'CS401' ? 110 : course.code === 'MATH302' ? 70 : course.code === 'CS310' ? 165 : 40);
              const percentage = Math.round((mins / (totalFocusMins || 1)) * 100);
              return (
                <div key={course.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: course.color }} />
                      <span>{course.code} – {course.name}</span>
                    </span>
                    <span className="font-mono text-slate-600">{mins} mins ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%`, backgroundColor: course.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Tip Pill */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs font-semibold text-indigo-900 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Pro Tip: Reallocate 30 mins to <strong>PHYS201</strong> to reach target grade 85%!</span>
          </div>
        </div>

      </div>

      {/* Recent Practice Quiz Attempts & XP Log Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Interactive Quiz History & XP Log</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">{quizAttempts.length} Quizzes Completed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Quiz Title</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">XP Earned</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {quizAttempts.map((attempt) => {
                const accuracy = Math.round((attempt.score / attempt.totalQuestions) * 100);
                return (
                  <tr key={attempt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{attempt.title}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-[11px] border border-indigo-100">
                        {attempt.course}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">{attempt.score} / {attempt.totalQuestions}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[11px] font-extrabold ${
                        accuracy >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-600">+{attempt.xpEarned} XP</td>
                    <td className="py-3 px-3 text-right text-slate-400 font-medium">{attempt.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

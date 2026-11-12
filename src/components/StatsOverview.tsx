import React from 'react';
import { Award, CheckCircle2, MessageSquareText, TrendingUp, Users } from 'lucide-react';
import { TeacherStaff } from '../types';
import { getCompletionStats } from '../utils/whatsapp';

interface StatsOverviewProps {
  teachers: TeacherStaff[];
  onFilterChange?: (filter: 'all' | '100' | 'incomplete') => void;
  activeFilter?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  teachers,
  onFilterChange,
  activeFilter = 'all',
}) => {
  const total = teachers.length;
  const completed100 = teachers.filter((t) => getCompletionStats(t).is100Percent).length;
  const incomplete = total - completed100;
  const totalDaysPossible = total * 5;
  const totalDaysFilled = teachers.reduce(
    (acc, t) => acc + getCompletionStats(t).filledCount,
    0
  );
  const complianceRate = totalDaysPossible > 0
    ? Math.round((totalDaysFilled / totalDaysPossible) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stat 1: Total Peserta */}
      <button
        onClick={() => onFilterChange && onFilterChange('all')}
        className={`p-4 bg-white rounded-xl border text-left transition-all hover:border-slate-300 ${
          activeFilter === 'all' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Total Partisipan</span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
          {total}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>Guru &amp; Tenaga Kependidikan</span>
        </div>
      </button>

      {/* Stat 2: Tuntas 100% */}
      <button
        onClick={() => onFilterChange && onFilterChange('100')}
        className={`p-4 bg-white rounded-xl border text-left transition-all hover:border-slate-300 ${
          activeFilter === '100' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Tuntas 100% (Apresiasi)</span>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
          {completed100}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Berhak mendapat video &amp; sertifikat</span>
        </div>
      </button>

      {/* Stat 3: Belum 100% */}
      <button
        onClick={() => onFilterChange && onFilterChange('incomplete')}
        className={`p-4 bg-white rounded-xl border text-left transition-all hover:border-slate-300 ${
          activeFilter === 'incomplete' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Belum 100% (Perlu Reminder)</span>
          <MessageSquareText className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-amber-600">
          {incomplete}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>Siap kirim pengingat WhatsApp</span>
        </div>
      </button>

      {/* Stat 4: Kepatuhan Sekolah */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 text-left">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Tingkat Kepatuhan Mingguan</span>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
          {complianceRate}%
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>{totalDaysFilled} dari {totalDaysPossible} log terisi</span>
        </div>
      </div>
    </div>
  );
};

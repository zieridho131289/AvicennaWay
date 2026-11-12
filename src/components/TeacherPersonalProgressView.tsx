import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import { DayOfWeek, TeacherStaff } from '../types';
import {
  createWhatsAppUrl,
  formatDisplayPhoneNumber,
  generatePersonalReminderMessage,
  getCompletionStats,
  getMissedDays,
} from '../utils/whatsapp';

interface TeacherPersonalProgressViewProps {
  teachers: TeacherStaff[];
  selectedTeacherId: string;
  onSelectTeacherId: (id: string) => void;
  onOpenQuickLog: (teacherId: string, day?: DayOfWeek) => void;
  onOpenAppreciation: (teacher: TeacherStaff) => void;
  schoolName: string;
}

export const TeacherPersonalProgressView: React.FC<TeacherPersonalProgressViewProps> = ({
  teachers,
  selectedTeacherId,
  onSelectTeacherId,
  onOpenQuickLog,
  onOpenAppreciation,
  schoolName,
}) => {
  const currentTeacher =
    teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  if (!currentTeacher) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        Belum ada data guru terdaftar.
      </div>
    );
  }

  const stats = getCompletionStats(currentTeacher);
  const missedDays = getMissedDays(currentTeacher);
  const is100 = stats.is100Percent;

  const handleSelfReminderWhatsApp = () => {
    const msg = generatePersonalReminderMessage(
      currentTeacher,
      'Sistem Portal Daily Log',
      'encouraging'
    );
    const url = createWhatsAppUrl(currentTeacher.phoneNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Switcher / Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {currentTeacher.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Portal Progres Pengisian Guru</span>
                <span>·</span>
                <span className="font-semibold text-emerald-800">{currentTeacher.unit}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {currentTeacher.name}
              </h2>
              <div className="text-xs text-slate-500 font-mono">
                NIP: {currentTeacher.nip} · WA: {formatDisplayPhoneNumber(currentTeacher.phoneNumber)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="text-xs text-slate-500 font-medium hidden md:inline">
              Pilih Nama Guru:
            </label>
            <select
              value={currentTeacher.id}
              onChange={(e) => onSelectTeacherId(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.unit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Kepatuhan */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Progres Pengisian Pekan Ini</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {stats.percentage}%
              </span>
              <span className="text-xs text-slate-500">
                ({stats.filledCount} dari 5 hari kerja)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${
                  is100
                    ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            {is100 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selamat! Pengisian tuntas sempurna 100%
              </span>
            ) : (
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Masih ada {missedDays.length} hari yang belum diisi
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Hari Belum Terisi */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Daftar Hari Belum Terisi</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            {missedDays.length === 0 ? (
              <div className="py-2 text-emerald-700 font-bold text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Semua hari sudah tercatat rapi</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 py-1">
                {missedDays.map((d) => (
                  <button
                    key={d}
                    onClick={() => onOpenQuickLog(currentTeacher.id, d)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1"
                    title={`Klik untuk isi hari ${d}`}
                  >
                    <span>{d}</span>
                    <Plus className="w-3 h-3 text-amber-700" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Batas pengisian mingguan: Setiap Jumat pukul 17.00 WIB
          </div>
        </div>

        {/* Card 3: Status Penghargaan */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Status Penghargaan Bintang</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            {is100 ? (
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg inline-block">
                  🌟 Bintang Teladan Avicenna Way
                </span>
                <p className="text-xs text-slate-600 mt-1.5">
                  Piagam digital &amp; video apresiasi telah aktif dan siap dibuka.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Sedang Berprogres
                </span>
                <p className="text-xs text-slate-500 mt-1.5">
                  Lengkapi 100% untuk membuka Piagam Apresiasi resmi.
                </p>
              </div>
            )}
          </div>
          <div className="mt-3">
            {is100 ? (
              <button
                onClick={() => onOpenAppreciation(currentTeacher)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Buka Piagam &amp; Video Apresiasi</span>
              </button>
            ) : (
              <button
                onClick={handleSelfReminderWhatsApp}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kirim Link Pengisian ke WA Saya</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5-Day Interactive Timeline & Log Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Catatan Pengisian Harian (Senin – Jumat)
            </h3>
            <p className="text-xs text-slate-500">
              Refleksi 7 Karakter Luhur Avicenna Way dan Pembiasaan 7 Habits
            </p>
          </div>

          <button
            onClick={() => onOpenQuickLog(currentTeacher.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Isi Logbook Hari Ini</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as DayOfWeek[]).map((day) => {
            const entry = currentTeacher.days[day];
            const isFilled = entry?.isFilled;

            return (
              <div
                key={day}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isFilled
                    ? 'bg-white border-emerald-300 shadow-2xs hover:border-emerald-400'
                    : 'bg-slate-50/70 border-dashed border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{day}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isFilled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isFilled ? 'Terisi ✓' : 'Belum'}
                    </span>
                  </div>

                  {isFilled ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-emerald-900 leading-tight">
                        {entry.characterValue || 'Nilai Avicenna'}
                      </div>
                      {entry.habitValue && (
                        <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded leading-tight">
                          {entry.habitValue}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-600 line-clamp-4 leading-relaxed">
                        {entry.reflection}
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-[11px] text-slate-400 italic">
                        Belum ada catatan refleksi
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  {isFilled ? (
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{entry.filledAt ? entry.filledAt.split(' ')[1] : ''} WIB</span>
                      <button
                        onClick={() => onOpenQuickLog(currentTeacher.id, day)}
                        className="text-emerald-700 hover:underline font-sans font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenQuickLog(currentTeacher.id, day)}
                      className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Isi {day}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

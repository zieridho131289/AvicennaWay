import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Camera,
  ChevronDown,
  Clock,
  ExternalLink,
  Filter,
  MessageCircle,
  PlusCircle,
  Search,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { DayOfWeek, SchoolIdentity, SchoolUnit, TeacherStaff } from '../types';
import {
  createWhatsAppUrl,
  formatDisplayPhoneNumber,
  generatePersonalReminderMessage,
  getCompletionStats,
  getMissedDays,
} from '../utils/whatsapp';

interface WeeklyResumeViewProps {
  teachers: TeacherStaff[];
  onOpenAppreciation: (teacher: TeacherStaff) => void;
  onOpenPersonalReminder: (teacher: TeacherStaff) => void;
  onOpenQuickLog: (teacherId: string) => void;
  onReminderSent: (teacherId: string) => void;
  coordinatorName: string;
  schoolIdentity?: SchoolIdentity;
  isAdmin?: boolean;
  onOpenEditIdentity?: () => void;
}

export const WeeklyResumeView: React.FC<WeeklyResumeViewProps> = ({
  teachers,
  onOpenAppreciation,
  onOpenPersonalReminder,
  onOpenQuickLog,
  onReminderSent,
  coordinatorName,
  schoolIdentity,
  isAdmin,
  onOpenEditIdentity,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | '100' | 'incomplete'>('all');
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedReflectionId, setExpandedReflectionId] = useState<string | null>(null);

  // Filtered teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const stats = getCompletionStats(teacher);
    // Status filter
    if (filterStatus === '100' && !stats.is100Percent) return false;
    if (filterStatus === 'incomplete' && stats.is100Percent) return false;

    // Unit filter
    if (filterUnit !== 'all' && teacher.unit !== filterUnit) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = teacher.name.toLowerCase().includes(q);
      const matchNip = teacher.nip.toLowerCase().includes(q);
      const matchRole = teacher.role.toLowerCase().includes(q);
      const matchUnit = teacher.unit.toLowerCase().includes(q);
      if (!matchName && !matchNip && !matchRole && !matchUnit) return false;
    }

    return true;
  });

  const handleQuickWhatsAppReminder = (teacher: TeacherStaff) => {
    const msg = generatePersonalReminderMessage(teacher, coordinatorName, 'friendly');
    const url = createWhatsAppUrl(teacher.phoneNumber, msg);
    onReminderSent(teacher.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header & School Context Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src={
              schoolIdentity?.heroImageUrl ||
              '/src/assets/images/avicenna_school_campus_1794464193346.jpg'
            }
            alt={schoolIdentity?.name || 'Sekolah Avicenna Leadership'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-transparent" />

          {/* Admin Change Photo Button */}
          {isAdmin && onOpenEditIdentity && (
            <button
              onClick={onOpenEditIdentity}
              className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-semibold border border-white/20 transition-all shadow-md active:scale-95"
              title="Ganti Foto Gedung Sekolah"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-300" />
              <span>Ganti Foto Sekolah</span>
            </button>
          )}

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resume Mingguan Daily Log Avicenna Way</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {schoolIdentity?.name ? `Rekapitulasi Kepatuhan ${schoolIdentity.name}` : 'Rekapitulasi & Reminder Kepatuhan Karakter'}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Periode Aktif: 9 – 13 November 2026 (Pekan Berjalan) · {schoolIdentity?.academicYear || 'Tahun Ajaran 2026/2027'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Batas Penutupan: <strong>Jumat, 17.00 WIB</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({teachers.length})
          </button>
          <button
            onClick={() => setFilterStatus('100')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              filterStatus === '100'
                ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>100% Apresiasi ({teachers.filter((t) => getCompletionStats(t).is100Percent).length})</span>
          </button>
          <button
            onClick={() => setFilterStatus('incomplete')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              filterStatus === 'incomplete'
                ? 'bg-white text-amber-800 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Belum 100% ({teachers.filter((t) => !getCompletionStats(t).is100Percent).length})</span>
          </button>
        </div>

        {/* Unit Dropdown & Search Input */}
        <div className="flex items-center gap-2">
          <select
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value)}
            className="text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Unit Sekolah</option>
            <option value="SD Avicenna">SD Avicenna</option>
            <option value="SMP Avicenna">SMP Avicenna</option>
            <option value="SMA Avicenna">SMA Avicenna</option>
            <option value="Staf &amp; Operasional">Staf &amp; Operasional</option>
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari guru / NIP..."
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Teachers List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Guru / Staf</th>
                <th className="py-3 px-4">Progres Minggu Ini</th>
                <th className="py-3 px-4">Rincian Hari (Sen - Jum)</th>
                <th className="py-3 px-4">Status &amp; WhatsApp</th>
                <th className="py-3 px-4 text-right">Tindakan Khusus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ditemukan data yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => {
                  const stats = getCompletionStats(teacher);
                  const missedDays = getMissedDays(teacher);
                  const is100 = stats.is100Percent;
                  const isExpanded = expandedReflectionId === teacher.id;

                  return (
                    <React.Fragment key={teacher.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Unit */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{teacher.name}</span>
                              {is100 && (
                                <span title="Bintang 100%">
                                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {teacher.role} · <span className="font-medium text-slate-700">{teacher.unit}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              NIP: {teacher.nip}
                            </div>
                          </div>
                        </td>

                        {/* Progress Bar & Tabular Percentage */}
                        <td className="py-3.5 px-4 align-top w-44">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span
                                className={`font-mono font-bold tabular-nums ${
                                  is100 ? 'text-emerald-700 font-extrabold' : 'text-slate-700'
                                }`}
                              >
                                {stats.percentage}%
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {stats.filledCount}/5 hari
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  is100
                                    ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                                    : stats.percentage >= 60
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${stats.percentage}%` }}
                              />
                            </div>
                            {is100 ? (
                              <span className="text-[10px] text-emerald-800 font-semibold block">
                                Sempurna 100% · Layak Apresiasi
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-800 block">
                                Kurang {5 - stats.filledCount} hari
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5-Day Tracker (Senin - Jumat) */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-1.5">
                            {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as DayOfWeek[]).map((day) => {
                              const dayData = teacher.days[day];
                              const isFilled = dayData?.isFilled;

                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() =>
                                    setExpandedReflectionId(isExpanded ? null : teacher.id)
                                  }
                                  title={`${day}: ${
                                    isFilled
                                      ? `Terisi (${dayData?.characterValue || 'Refleksi'}) - Klik untuk baca`
                                      : 'Belum diisi'
                                  }`}
                                  className={`w-7 h-7 rounded-md flex flex-col items-center justify-center text-[9px] font-bold transition-all ${
                                    isFilled
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:ring-2 hover:ring-emerald-400'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  <span>{day.slice(0, 1)}</span>
                                  <span className="text-[7px]">
                                    {isFilled ? '✓' : '—'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          {!is100 && missedDays.length > 0 && (
                            <div className="text-[10px] text-slate-500 mt-1">
                              Belum: <span className="font-semibold text-rose-700">{missedDays.join(', ')}</span>
                            </div>
                          )}
                          {is100 && (
                            <button
                              onClick={() =>
                                setExpandedReflectionId(isExpanded ? null : teacher.id)
                              }
                              className="text-[10px] text-emerald-700 hover:underline mt-1 flex items-center gap-0.5"
                            >
                              <span>{isExpanded ? 'Sembunyikan log' : 'Lihat catatan log'}</span>
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          )}
                        </td>

                        {/* WhatsApp Number & Status */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-semibold text-slate-800">
                                {formatDisplayPhoneNumber(teacher.phoneNumber)}
                              </span>
                            </div>

                            {teacher.lastReminderSentAt && (
                              <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Reminder: {teacher.lastReminderSentAt}</span>
                              </div>
                            )}

                            {teacher.lastAppreciationSentAt && (
                              <div className="text-[10px] text-amber-700 flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                <span>Apresiasi: {teacher.lastAppreciationSentAt}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions (Apresiasi 100% vs Reminder Personal) */}
                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                          {is100 ? (
                            /* 1. UDAH 100% MENGISI -> DAPAT APRESIASI VIDEO & GAMBAR */
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onOpenAppreciation(teacher)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Apresiasi Video/Gambar</span>
                              </button>
                            </div>
                          ) : (
                            /* 2. BELUM 100% MENGISI -> REMINDER PERSONAL WA */
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onOpenPersonalReminder(teacher)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                                title="Kirim reminder personal otomatis via WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Reminder WA</span>
                              </button>

                              <button
                                onClick={() => onOpenQuickLog(teacher.id)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                                title="Bantu isi log hari ini"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Isi Log</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Daily Reflections Details */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={5} className="p-4">
                            <div className="text-xs font-bold text-slate-800 mb-2">
                              Rincian Refleksi Harian Avicenna Way: {teacher.name}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as DayOfWeek[]).map((d) => {
                                const entry = teacher.days[d];
                                return (
                                  <div
                                    key={d}
                                    className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                                      entry?.isFilled
                                        ? 'bg-white border-emerald-200 shadow-xs'
                                        : 'bg-slate-100/60 border-slate-200 text-slate-400'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between font-bold">
                                      <span className={entry?.isFilled ? 'text-emerald-900' : 'text-slate-400'}>
                                        {d}
                                      </span>
                                      <span className="text-[10px]">
                                        {entry?.isFilled ? '✓ Terisi' : 'Kosong'}
                                      </span>
                                    </div>
                                    {entry?.isFilled ? (
                                      <>
                                        <div className="text-[10px] font-semibold text-emerald-800">
                                          {entry.characterValue}
                                        </div>
                                        {entry.habitValue && (
                                          <div className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 inline-block">
                                            {entry.habitValue}
                                          </div>
                                        )}
                                        <p className="text-[11px] text-slate-600 line-clamp-3 pt-0.5">
                                          {entry.reflection}
                                        </p>
                                        {entry.filledAt && (
                                          <div className="text-[9px] text-slate-400 font-mono pt-1">
                                            {entry.filledAt}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-[11px] italic text-slate-400">
                                        Belum ada refleksi yang dicatat
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

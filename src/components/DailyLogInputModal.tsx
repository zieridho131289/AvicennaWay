import React, { useState } from 'react';
import { Award, BookOpen, Check, Sparkles, X } from 'lucide-react';
import { AvicennaValueItem, DayOfWeek, HabitItem, TeacherStaff } from '../types';
import { getCompletionStats } from '../utils/whatsapp';

interface DailyLogInputModalProps {
  teachers: TeacherStaff[];
  avicennaValues: AvicennaValueItem[];
  habits: HabitItem[];
  onClose: () => void;
  onSubmitLog: (
    teacherId: string,
    day: DayOfWeek,
    characterValue: string,
    habitValue: string,
    reflection: string,
    notes?: string
  ) => void;
  initialTeacherId?: string;
}

export const DailyLogInputModal: React.FC<DailyLogInputModalProps> = ({
  teachers,
  avicennaValues,
  habits,
  onClose,
  onSubmitLog,
  initialTeacherId,
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    initialTeacherId || (teachers[0]?.id ?? '')
  );
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Jumat');
  const [selectedCoreValue, setSelectedCoreValue] = useState<string>(
    avicennaValues[0]?.name || 'Leadership (Kepemimpinan)'
  );
  const [selectedHabit, setSelectedHabit] = useState<string>(
    habits[0]?.name || 'Habit 1: Be Proactive (Jadilah Proaktif)'
  );
  const [reflection, setReflection] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);
  const currentStats = selectedTeacher ? getCompletionStats(selectedTeacher) : null;
  const isDayAlreadyFilled = selectedTeacher ? selectedTeacher.days[selectedDay]?.isFilled : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !reflection.trim()) return;

    onSubmitLog(
      selectedTeacherId,
      selectedDay,
      selectedCoreValue,
      selectedHabit,
      reflection.trim(),
      notes.trim() || undefined
    );

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Form Input Daily Log Avicenna Way &amp; 7 Habits
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan refleksi nilai karakter harian dan pembiasaan 7 Habits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Select Teacher */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Guru / Staf:
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.unit}) - NIP: {t.nip}
                </option>
              ))}
            </select>
          </div>

          {/* Current Progress Alert */}
          {selectedTeacher && currentStats && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Progres minggu ini:{' '}
                <strong className="text-emerald-700 font-mono">
                  {currentStats.percentage}% ({currentStats.filledCount}/5 hari)
                </strong>
              </span>
              {currentStats.is100Percent && (
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Sudah 100%
                </span>
              )}
            </div>
          )}

          {/* Select Day */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Hari Pengisian:
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as DayOfWeek[]).map((day) => {
                const filled = selectedTeacher?.days[day]?.isFilled;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`py-2 px-1 text-xs rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      selectedDay === day
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                        : filled
                        ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{day}</span>
                    <span className="text-[10px]">
                      {filled ? '✓ Terisi' : 'Kosong'}
                    </span>
                  </button>
                );
              })}
            </div>
            {isDayAlreadyFilled && (
              <p className="text-[11px] text-amber-700 mt-1">
                Catatan: Hari {selectedDay} sudah terisi sebelumnya. Pengisian baru akan memperbarui data sebelumnya.
              </p>
            )}
          </div>

          {/* Core Value Selection (Nilai Utama Avicenna Way) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nilai Utama Avicenna Way:
            </label>
            <select
              value={selectedCoreValue}
              onChange={(e) => setSelectedCoreValue(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {avicennaValues.map((val) => (
                <option key={val.id} value={val.name}>
                  {val.name} - {val.description.slice(0, 48)}...
                </option>
              ))}
            </select>
          </div>

          {/* 7 Habits Selection (Nilai 7 Habits) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Nilai 7 Habits (Covey Framework):</span>
              <span className="text-[10px] text-amber-700 font-normal">7 Habits Logbook</span>
            </label>
            <select
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {habits.map((habit) => (
                <option key={habit.id} value={habit.name}>
                  {habit.name} - {habit.description.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Refleksi &amp; Aksi Nyata Hari Ini: <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Contoh: Mengintegrasikan nilai kepemimpinan dan Habit 1 (Be Proactive) dalam memandu diskusi sains, memotivasi siswa untuk berani memimpin percobaan..."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Tambahan / Link Dokumentasi (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Dokumentasi kegiatan tersimpan di Google Drive"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSuccess || !reflection.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.99]"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Berhasil Tersimpan &amp; Tersinkronisasi!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simpan Daily Log &amp; Sinkronkan Database</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

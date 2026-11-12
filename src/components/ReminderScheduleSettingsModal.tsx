import React, { useState } from 'react';
import { Bell, Check, Clock, Save, ShieldCheck, Sparkles, X } from 'lucide-react';
import { ReminderScheduleSettings } from '../types';

interface ReminderScheduleSettingsModalProps {
  settings: ReminderScheduleSettings;
  onSave: (newSettings: ReminderScheduleSettings) => void;
  onClose: () => void;
}

export const ReminderScheduleSettingsModal: React.FC<ReminderScheduleSettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState<ReminderScheduleSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [simulationTriggered, setSimulationTriggered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleRunSimulation = () => {
    setSimulationTriggered(true);
    setTimeout(() => {
      setSimulationTriggered(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Pengaturan Jadwal &amp; Otomatisasi Reminder
              </h2>
              <p className="text-xs text-slate-500">
                Konfigurasi jadwal pengiriman reminder WA harian dan resume mingguan
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Daily Reminder Setting */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Pengingat Harian Otomatis (Senin - Jumat)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Mengingatkan guru yang belum mengisi log harian sebelum jam pulang
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoReminderDaily}
                  onChange={(e) =>
                    setForm({ ...form, autoReminderDaily: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {form.autoReminderDaily && (
              <div className="pt-2 flex items-center gap-3">
                <label className="text-xs text-slate-700 font-medium">Jam Pengingat:</label>
                <input
                  type="time"
                  value={form.dailyReminderTime}
                  onChange={(e) =>
                    setForm({ ...form, dailyReminderTime: e.target.value })
                  }
                  className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                />
                <span className="text-xs text-slate-500">WIB (Waktu Indonesia Barat)</span>
              </div>
            )}
          </div>

          {/* Weekly Resume Setting */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Rekap &amp; Resume Mingguan Otomatis
                </h3>
                <p className="text-[11px] text-slate-500">
                  Kompilasi mingguan: pisahkan 100% (Apresiasi) dan &lt;100% (Reminder)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoWeeklyResume}
                  onChange={(e) =>
                    setForm({ ...form, autoWeeklyResume: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {form.autoWeeklyResume && (
              <div className="pt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Hari Rekap:</label>
                  <select
                    value={form.weeklyResumeDay}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        weeklyResumeDay: e.target.value as 'Jumat' | 'Sabtu',
                      })
                    }
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Jumat">Jumat Sore</option>
                    <option value="Sabtu">Sabtu Pagi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Pukul:</label>
                  <input
                    type="time"
                    value={form.weeklyResumeTime}
                    onChange={(e) =>
                      setForm({ ...form, weeklyResumeTime: e.target.value })
                    }
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* School & Coordinator Identity */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Sekolah:
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penanggung Jawab / Koordinator Avicenna Way:
              </label>
              <input
                type="text"
                value={form.schoolCoordinatorName}
                onChange={(e) =>
                  setForm({ ...form, schoolCoordinatorName: e.target.value })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Scheduler Simulation Trigger */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Simulasi Pengecekan Jadwal
                </span>
                <span className="text-[11px] text-emerald-700">
                  Uji coba deteksi otomatis guru yang belum mengisi
                </span>
              </div>
              <button
                type="button"
                onClick={handleRunSimulation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jalankan Tes</span>
              </button>
            </div>

            {simulationTriggered && (
              <div className="mt-2.5 p-2 bg-white rounded border border-emerald-300 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Scheduler Aktif: Pukul {form.dailyReminderTime} WIB</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Sistem mendeteksi guru yang belum lengkap, men-generate pesan personal wa.me, dan menyiapkan antrean reminder WhatsApp otomatis tanpa perlu input manual.
                </p>
              </div>
            )}
          </div>

          {/* Footer Save */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

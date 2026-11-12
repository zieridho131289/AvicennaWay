import React, { useState } from 'react';
import { Award, BookOpen, Edit2, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { DEFAULT_7_HABITS, DEFAULT_AVICENNA_VALUES } from '../data/mockData';
import { AvicennaValueItem, HabitItem } from '../types';

interface ManageValuesAndHabitsModalProps {
  avicennaValues: AvicennaValueItem[];
  habits: HabitItem[];
  onUpdateValues: (values: AvicennaValueItem[]) => void;
  onUpdateHabits: (habits: HabitItem[]) => void;
  onClose: () => void;
}

export const ManageValuesAndHabitsModal: React.FC<ManageValuesAndHabitsModalProps> = ({
  avicennaValues,
  habits,
  onUpdateValues,
  onUpdateHabits,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'values' | 'habits'>('values');

  // Avicenna Values state
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [valName, setValName] = useState('');
  const [valDesc, setValDesc] = useState('');
  const [valColor, setValColor] = useState('emerald');

  // Habits state
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');

  // Handlers for Values
  const handleSaveNewValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valName.trim()) return;

    if (editingValueId) {
      const updated = avicennaValues.map((v) =>
        v.id === editingValueId
          ? { ...v, name: valName.trim(), description: valDesc.trim(), color: valColor }
          : v
      );
      onUpdateValues(updated);
      setEditingValueId(null);
    } else {
      const newItem: AvicennaValueItem = {
        id: `val-${Date.now()}`,
        name: valName.trim(),
        description: valDesc.trim(),
        color: valColor,
      };
      onUpdateValues([...avicennaValues, newItem]);
      setIsAddingValue(false);
    }

    setValName('');
    setValDesc('');
    setValColor('emerald');
  };

  const handleStartEditValue = (item: AvicennaValueItem) => {
    setEditingValueId(item.id);
    setValName(item.name);
    setValDesc(item.description);
    setValColor(item.color || 'emerald');
    setIsAddingValue(true);
  };

  const handleDeleteValue = (id: string, name: string) => {
    if (avicennaValues.length <= 1) {
      alert('Minimal harus ada satu nilai utama Avicenna Way.');
      return;
    }
    if (window.confirm(`Hapus nilai utama "${name}"?`)) {
      const updated = avicennaValues.filter((v) => v.id !== id);
      onUpdateValues(updated);
    }
  };

  // Handlers for Habits
  const handleSaveNewHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    if (editingHabitId) {
      const updated = habits.map((h) =>
        h.id === editingHabitId
          ? { ...h, name: habitName.trim(), description: habitDesc.trim() }
          : h
      );
      onUpdateHabits(updated);
      setEditingHabitId(null);
    } else {
      const newHabit: HabitItem = {
        id: `hbt-${Date.now()}`,
        habitNumber: habits.length + 1,
        name: habitName.trim(),
        description: habitDesc.trim(),
      };
      onUpdateHabits([...habits, newHabit]);
      setIsAddingHabit(false);
    }

    setHabitName('');
    setHabitDesc('');
  };

  const handleStartEditHabit = (item: HabitItem) => {
    setEditingHabitId(item.id);
    setHabitName(item.name);
    setHabitDesc(item.description);
    setIsAddingHabit(true);
  };

  const handleDeleteHabit = (id: string, name: string) => {
    if (habits.length <= 1) {
      alert('Minimal harus ada satu nilai habit.');
      return;
    }
    if (window.confirm(`Hapus "${name}"?`)) {
      const updated = habits.filter((h) => h.id !== id);
      onUpdateHabits(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Kelola Nilai Utama &amp; Nilai 7 Habits
            </h2>
            <p className="text-xs text-slate-500">
              Input manual untuk menambahkan atau mengurangi parameter pengisian logbook
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white">
          <button
            onClick={() => {
              setActiveTab('values');
              setIsAddingValue(false);
              setEditingValueId(null);
            }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'values'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>1. Nilai Utama Avicenna Way ({avicennaValues.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('habits');
              setIsAddingHabit(false);
              setEditingHabitId(null);
            }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'habits'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>2. Nilai 7 Habits ({habits.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: AVICENNA VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Daftar nilai utama yang dipilih guru saat mengisi Daily Log Avicenna Way:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingValue(!isAddingValue);
                    setEditingValueId(null);
                    setValName('');
                    setValDesc('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingValue ? 'Tutup Form' : 'Tambah Nilai Utama'}</span>
                </button>
              </div>

              {/* Add / Edit Form */}
              {isAddingValue && (
                <form
                  onSubmit={handleSaveNewValue}
                  className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3"
                >
                  <h4 className="text-xs font-bold text-emerald-950">
                    {editingValueId ? 'Edit Nilai Utama' : 'Tambah Nilai Utama Avicenna Baru'}:
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Nilai Utama:
                      </label>
                      <input
                        type="text"
                        required
                        value={valName}
                        onChange={(e) => setValName(e.target.value)}
                        placeholder="Contoh: Digital Literacy &amp; Wisdom"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Deskripsi / Indikator Perilaku:
                      </label>
                      <input
                        type="text"
                        required
                        value={valDesc}
                        onChange={(e) => setValDesc(e.target.value)}
                        placeholder="Contoh: Pemanfaatan teknologi edukasi secara bijak dan beretika."
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Warna Tema Tag:
                      </label>
                      <select
                        value={valColor}
                        onChange={(e) => setValColor(e.target.value)}
                        className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="emerald">Emerald (Hijau)</option>
                        <option value="blue">Blue (Biru)</option>
                        <option value="amber">Amber (Kuning/Emas)</option>
                        <option value="teal">Teal (Tosca)</option>
                        <option value="indigo">Indigo (Ungu Biru)</option>
                        <option value="rose">Rose (Merah Muda)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingValue(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                    >
                      {editingValueId ? 'Simpan Perubahan' : 'Tambahkan Nilai'}
                    </button>
                  </div>
                </form>
              )}

              {/* List of Values */}
              <div className="space-y-2">
                {avicennaValues.map((val) => (
                  <div
                    key={val.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{val.name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          {val.color}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {val.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditValue(val)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit nilai"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteValue(val.id, val.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Kurangi / Hapus nilai"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Kembalikan ke daftar 5 nilai utama standar Avicenna Way?')) {
                      onUpdateValues(DEFAULT_AVICENNA_VALUES);
                    }
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ke Standar Avicenna</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 7 HABITS */}
          {activeTab === 'habits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Daftar nilai 7 Habits (The 7 Habits) untuk pilihan logbook:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingHabit(!isAddingHabit);
                    setEditingHabitId(null);
                    setHabitName('');
                    setHabitDesc('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingHabit ? 'Tutup Form' : 'Tambah Habit Baru'}</span>
                </button>
              </div>

              {/* Add / Edit Habit Form */}
              {isAddingHabit && (
                <form
                  onSubmit={handleSaveNewHabit}
                  className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3"
                >
                  <h4 className="text-xs font-bold text-amber-950">
                    {editingHabitId ? 'Edit Nilai Habit' : 'Tambah Nilai Habit Baru'}:
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Habit:
                      </label>
                      <input
                        type="text"
                        required
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        placeholder="Contoh: Habit 8: Find Your Voice (Temukan Suaramu)"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Deskripsi / Penjelasan:
                      </label>
                      <input
                        type="text"
                        required
                        value={habitDesc}
                        onChange={(e) => setHabitDesc(e.target.value)}
                        placeholder="Contoh: Menginspirasi orang lain untuk menemukan potensi dan suaranya."
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingHabit(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                    >
                      {editingHabitId ? 'Simpan Perubahan' : 'Tambahkan Habit'}
                    </button>
                  </div>
                </form>
              )}

              {/* List of Habits */}
              <div className="space-y-2">
                {habits.map((habit, idx) => (
                  <div
                    key={habit.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900">
                          {habit.name}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {habit.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditHabit(habit)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit habit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHabit(habit.id, habit.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Kurangi / Hapus habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Kembalikan ke 7 Habits standar Stephen Covey?')) {
                      onUpdateHabits(DEFAULT_7_HABITS);
                    }
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ke 7 Habits Standar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

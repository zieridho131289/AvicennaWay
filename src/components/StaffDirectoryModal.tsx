import React, { useState } from 'react';
import { Edit2, MessageCircle, Phone, Plus, Save, Trash2, Users, X } from 'lucide-react';
import { SchoolUnit, TeacherStaff } from '../types';
import { createWhatsAppUrl, formatDisplayPhoneNumber, normalizeWhatsAppNumber } from '../utils/whatsapp';

interface StaffDirectoryModalProps {
  teachers: TeacherStaff[];
  onClose: () => void;
  onUpdateTeacher: (updated: TeacherStaff) => void;
  onAddTeacher: (newTeacher: TeacherStaff) => void;
  onDeleteTeacher: (id: string) => void;
}

export const StaffDirectoryModal: React.FC<StaffDirectoryModalProps> = ({
  teachers,
  onClose,
  onUpdateTeacher,
  onAddTeacher,
  onDeleteTeacher,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPhone, setEditPhone] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editUnit, setEditUnit] = useState<SchoolUnit>('SMP Avicenna');
  const [editRole, setEditRole] = useState<string>('');

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newNip, setNewNip] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [newUnit, setNewUnit] = useState<SchoolUnit>('SD Avicenna');
  const [newPhone, setNewPhone] = useState<string>('');

  const handleStartEdit = (teacher: TeacherStaff) => {
    setEditingId(teacher.id);
    setEditName(teacher.name);
    setEditPhone(teacher.phoneNumber);
    setEditUnit(teacher.unit);
    setEditRole(teacher.role);
  };

  const handleSaveEdit = (teacher: TeacherStaff) => {
    onUpdateTeacher({
      ...teacher,
      name: editName.trim() || teacher.name,
      phoneNumber: normalizeWhatsAppNumber(editPhone) || teacher.phoneNumber,
      unit: editUnit,
      role: editRole.trim() || teacher.role,
    });
    setEditingId(null);
  };

  const handleCreateNewTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newTeacher: TeacherStaff = {
      id: `tch-${Date.now()}`,
      name: newName.trim(),
      nip: newNip.trim() || `AV-2026-${Math.floor(100 + Math.random() * 900)}`,
      role: newRole.trim() || 'Tenaga Pendidik',
      unit: newUnit,
      phoneNumber: normalizeWhatsAppNumber(newPhone),
      email: `${newName.toLowerCase().replace(/[^a-z]/g, '')}@avicenna.sch.id`,
      days: {
        Senin: { day: 'Senin', date: '2026-11-09', isFilled: false },
        Selasa: { day: 'Selasa', date: '2026-11-10', isFilled: false },
        Rabu: { day: 'Rabu', date: '2026-11-11', isFilled: false },
        Kamis: { day: 'Kamis', date: '2026-11-12', isFilled: false },
        Jumat: { day: 'Jumat', date: '2026-11-13', isFilled: false },
      },
    };

    onAddTeacher(newTeacher);
    setIsAdding(false);
    setNewName('');
    setNewNip('');
    setNewRole('');
    setNewPhone('');
  };

  const handleTestWhatsApp = (phone: string, name: string) => {
    const testMsg = `Halo Bapak/Ibu ${name}, ini adalah pesan uji koneksi nomor WhatsApp dari sistem Daily Log Avicenna Way. Sistem terhubung dengan baik!`;
    const url = createWhatsAppUrl(phone, testMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Daftar Kontak &amp; No. WhatsApp Guru
              </h2>
              <p className="text-xs text-slate-500">
                Kelola nomor WhatsApp guru dan tenaga kependidikan untuk sinkronisasi reminder
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
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Total terdaftar: <strong className="text-slate-800 font-mono">{teachers.length}</strong> orang
            </span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Tutup Form' : 'Tambah Guru / Staf'}</span>
            </button>
          </div>

          {/* Add Form */}
          {isAdding && (
            <form onSubmit={handleCreateNewTeacher} className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-emerald-900">
                Pendaftaran Guru / Staf Baru:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Lengkap &amp; Gelar:</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Muhammad Ilham, S.Pd."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nomor WhatsApp (Aktif):</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx / 628xxxxxxxx"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Unit Sekolah:</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as SchoolUnit)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="SD Avicenna">SD Avicenna</option>
                    <option value="SMP Avicenna">SMP Avicenna</option>
                    <option value="SMA Avicenna">SMA Avicenna</option>
                    <option value="Staf &amp; Operasional">Staf &amp; Operasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Jabatan / Mata Pelajaran:</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Contoh: Guru Matematika"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          )}

          {/* Directory Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Nama &amp; Unit</th>
                  <th className="py-2.5 px-3">Nomor WhatsApp</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((teacher) => {
                  const isEditing = editingId === teacher.id;

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3">
                        {isEditing ? (
                          <div className="space-y-1 max-w-xs">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full text-xs p-1 border rounded"
                            />
                            <div className="flex gap-1">
                              <select
                                value={editUnit}
                                onChange={(e) => setEditUnit(e.target.value as SchoolUnit)}
                                className="text-[11px] p-1 border rounded"
                              >
                                <option value="SD Avicenna">SD Avicenna</option>
                                <option value="SMP Avicenna">SMP Avicenna</option>
                                <option value="SMA Avicenna">SMA Avicenna</option>
                                <option value="Staf &amp; Operasional">Staf &amp; Operasional</option>
                              </select>
                              <input
                                type="text"
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="w-full text-[11px] p-1 border rounded"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-slate-900">{teacher.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {teacher.role} · {teacher.unit} · NIP: {teacher.nip}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="text-xs p-1 border rounded font-mono w-36"
                          />
                        ) : (
                          <div className="font-mono text-emerald-800 font-medium">
                            {formatDisplayPhoneNumber(teacher.phoneNumber)}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(teacher)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                              title="Simpan"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleTestWhatsApp(teacher.phoneNumber, teacher.name)}
                              className="p-1.5 text-[#25D366] hover:bg-emerald-50 rounded"
                              title="Tes Hubungi via WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(teacher)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                              title="Edit Nomor"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTeacher(teacher.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronRight, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { TeacherStaff } from '../types';
import {
  createWhatsAppUrl,
  formatDisplayPhoneNumber,
  generatePersonalReminderMessage,
  getCompletionStats,
  getMissedDays,
} from '../utils/whatsapp';

interface BatchReminderModalProps {
  teachers: TeacherStaff[];
  onClose: () => void;
  onReminderSent: (teacherId: string) => void;
  coordinatorName: string;
}

export const BatchReminderModal: React.FC<BatchReminderModalProps> = ({
  teachers,
  onClose,
  onReminderSent,
  coordinatorName,
}) => {
  const incompleteTeachers = teachers.filter((t) => !getCompletionStats(t).is100Percent);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  const sentCount = Object.keys(sentMap).length;
  const totalIncomplete = incompleteTeachers.length;

  const handleSendSingle = (teacher: TeacherStaff) => {
    const msg = generatePersonalReminderMessage(teacher, coordinatorName, 'friendly');
    const url = createWhatsAppUrl(teacher.phoneNumber, msg);
    onReminderSent(teacher.id);
    setSentMap((prev) => ({ ...prev, [teacher.id]: true }));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendNextUnsent = () => {
    const next = incompleteTeachers.find((t) => !sentMap[t.id]);
    if (next) {
      handleSendSingle(next);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Asisten Reminder Massal WhatsApp
              </h2>
              <p className="text-xs text-slate-500">
                Kirim pengingat personal satu per satu ke semua guru yang belum 100%
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

        {/* Progress Strip */}
        <div className="px-6 py-3.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span>Progres Pengiriman Antrean:</span>
            <span className="font-mono font-bold text-emerald-700">
              {sentCount} / {totalIncomplete} Guru
            </span>
          </div>

          {sentCount < totalIncomplete && (
            <button
              onClick={handleSendNextUnsent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Kirim Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* List of Incomplete Teachers */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {incompleteTeachers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">Luar Biasa! Semua Sudah 100%</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tidak ada guru atau staf yang membutuhkan pengingat saat ini.
              </p>
            </div>
          ) : (
            incompleteTeachers.map((teacher) => {
              const stats = getCompletionStats(teacher);
              const missed = getMissedDays(teacher);
              const isSent = sentMap[teacher.id] || !!teacher.lastReminderSentAt;

              return (
                <div
                  key={teacher.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSent
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{teacher.name}</span>
                      <span className="text-[11px] text-slate-500">· {teacher.unit}</span>
                      {isSent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          <CheckCircle className="w-3 h-3" /> Terkirim
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>{formatDisplayPhoneNumber(teacher.phoneNumber)}</span>
                      <span>·</span>
                      <span className="text-amber-700 font-semibold font-sans">
                        {stats.percentage}% ({stats.filledCount}/5 hari)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1">
                      <span className="text-slate-400">Belum isi:</span>
                      <span className="font-semibold text-amber-800">
                        {missed.join(', ')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendSingle(teacher)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSent
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSent ? 'Kirim Ulang' : 'Kirim WA'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Sistem merangkai pesan personal otomatis dengan menyebutkan nama &amp; rincian hari yang belum diisi.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

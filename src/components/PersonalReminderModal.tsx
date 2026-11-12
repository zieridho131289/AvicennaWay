import React, { useState } from 'react';
import { AlertCircle, Calendar, Check, Copy, ExternalLink, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { ReminderTone, TeacherStaff } from '../types';
import {
  createWhatsAppUrl,
  formatDisplayPhoneNumber,
  generatePersonalReminderMessage,
  getCompletionStats,
  getMissedDays,
} from '../utils/whatsapp';

interface PersonalReminderModalProps {
  teacher: TeacherStaff | null;
  onClose: () => void;
  onReminderSent: (teacherId: string) => void;
  coordinatorName: string;
}

export const PersonalReminderModal: React.FC<PersonalReminderModalProps> = ({
  teacher,
  onClose,
  onReminderSent,
  coordinatorName,
}) => {
  const [tone, setTone] = useState<ReminderTone>('friendly');
  const [customNote, setCustomNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!teacher) return null;

  const stats = getCompletionStats(teacher);
  const missedDays = getMissedDays(teacher);

  const messageText = generatePersonalReminderMessage(
    teacher,
    coordinatorName,
    tone,
    customNote
  );

  const waUrl = createWhatsAppUrl(teacher.phoneNumber, messageText);

  const handleSendViaWhatsApp = () => {
    onReminderSent(teacher.id);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Kirim Reminder Personal WhatsApp
              </h2>
              <p className="text-xs text-slate-500">
                Otomatisasi pesan personal pengisian Daily Log Avicenna Way
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Recipient Profile Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{teacher.name}</h3>
              <p className="text-xs text-slate-500">
                {teacher.role} · {teacher.unit} · NIP: {teacher.nip}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Nomor WhatsApp</span>
              <span className="font-mono text-xs font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                {formatDisplayPhoneNumber(teacher.phoneNumber)}
              </span>
            </div>
          </div>

          {/* Missing Days Summary */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Progres: {stats.percentage}% ({stats.filledCount} dari 5 hari)</span>
              </div>
              <span className="text-amber-800 font-medium">
                {missedDays.length} hari belum diisi
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Hari yang memerlukan pengisian:</span>
              <div className="flex items-center gap-1 font-semibold text-amber-900">
                {missedDays.map((day) => (
                  <span
                    key={day}
                    className="bg-white border border-amber-300 px-2 py-0.5 rounded text-[11px]"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Gaya Bahasa Pesan WhatsApp:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTone('friendly')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  tone === 'friendly'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Bersahabat &amp; Ramah
              </button>
              <button
                type="button"
                onClick={() => setTone('formal')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  tone === 'formal'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Resmi / Kedinasan
              </button>
              <button
                type="button"
                onClick={() => setTone('encouraging')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  tone === 'encouraging'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Inspiratif &amp; Motivasi
              </button>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Khusus Tambahan (Opsional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Contoh: Ditunggu ya bu sebelum jam 17.00 WIB untuk rekap mingguan..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Realtime Message Preview */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Pratinjau Pesan Personal WhatsApp:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin!' : 'Salin Pesan'}
              </button>
            </div>
            <div className="bg-[#eef2eb] border border-[#d2dec9] rounded-xl p-3.5 font-sans text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
              {messageText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSendViaWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Pengingat ke WhatsApp</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
};

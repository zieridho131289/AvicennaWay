import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  X,
} from 'lucide-react';
import { getAccessToken, googleSignIn } from '../services/firebaseAuth';
import { createAvicennaGoogleSheet, syncAllLogsToSheet } from '../services/googleSheets';
import { GoogleSheetsConfig, TeacherStaff } from '../types';

interface GoogleSheetsModalProps {
  config: GoogleSheetsConfig;
  teachers: TeacherStaff[];
  onSaveConfig: (newConfig: GoogleSheetsConfig) => void;
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  config,
  teachers,
  onSaveConfig,
  onClose,
}) => {
  const [spreadsheetId, setSpreadsheetId] = useState(config.spreadsheetId);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(config.spreadsheetUrl);
  const [autoSync, setAutoSync] = useState(config.autoSyncOnSubmit);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUrlChange = (val: string) => {
    setSpreadsheetUrl(val);
    // Auto-extract ID if full URL is pasted
    const match = val.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      setSpreadsheetId(match[1]);
    } else if (!val.includes('/')) {
      setSpreadsheetId(val);
    }
  };

  const handleSaveSettings = () => {
    const updated: GoogleSheetsConfig = {
      ...config,
      spreadsheetId: spreadsheetId.trim(),
      spreadsheetUrl:
        spreadsheetUrl.trim() ||
        `https://docs.google.com/spreadsheets/d/${spreadsheetId.trim()}/edit`,
      autoSyncOnSubmit: autoSync,
      connected: !!spreadsheetId.trim(),
    };
    onSaveConfig(updated);
    setIsSuccess(true);
    setStatusMessage('Konfigurasi Google Spreadsheet berhasil disimpan!');
    setTimeout(() => {
      setIsSuccess(false);
    }, 2500);
  };

  const handleCreateNewSheet = async () => {
    setIsLoading(true);
    setStatusMessage('Sedang membuat Google Spreadsheet di Google Drive Anda...');
    try {
      const res = await createAvicennaGoogleSheet();
      if (res.success && res.spreadsheetId) {
        setSpreadsheetId(res.spreadsheetId);
        setSpreadsheetUrl(res.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${res.spreadsheetId}/edit`);
        const updated: GoogleSheetsConfig = {
          ...config,
          spreadsheetId: res.spreadsheetId,
          spreadsheetUrl: res.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${res.spreadsheetId}/edit`,
          connected: true,
        };
        onSaveConfig(updated);
        setStatusMessage('Spreadsheet baru berhasil dibuat dan otomatis terhubung!');
      } else {
        setStatusMessage(res.message);
      }
    } catch (e: any) {
      setStatusMessage(e.message || 'Gagal membuat spreadsheet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncNow = async () => {
    if (!spreadsheetId.trim()) {
      setStatusMessage('Silakan masukkan ID atau buat spreadsheet terlebih dahulu.');
      return;
    }
    setIsLoading(true);
    setStatusMessage('Sedang menyinkronkan data ke Google Sheets...');
    try {
      const res = await syncAllLogsToSheet(spreadsheetId.trim(), teachers);
      setStatusMessage(res.message);
      if (res.success) {
        const updated: GoogleSheetsConfig = {
          ...config,
          lastSyncedAt: new Date().toLocaleTimeString('id-ID'),
          connected: true,
        };
        onSaveConfig(updated);
      }
    } catch (e: any) {
      setStatusMessage(e.message || 'Gagal menyinkronkan data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'ID_Guru',
      'Nama_Guru',
      'NIP',
      'Unit',
      'No_WhatsApp',
      'Hari',
      'Tanggal',
      'Nilai_Utama_Avicenna',
      'Nilai_7_Habits',
      'Refleksi',
      'Catatan',
    ];

    const rows: string[][] = [headers];
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;

    teachers.forEach((t) => {
      days.forEach((d) => {
        const log = t.days[d];
        if (log && log.isFilled) {
          rows.push([
            `"${log.filledAt || ''}"`,
            `"${t.id}"`,
            `"${t.name}"`,
            `"${t.nip}"`,
            `"${t.unit}"`,
            `"${t.phoneNumber}"`,
            `"${log.day}"`,
            `"${log.date}"`,
            `"${log.characterValue || ''}"`,
            `"${log.habitValue || ''}"`,
            `"${(log.reflection || '').replace(/"/g, '""')}"`,
            `"${(log.notes || '').replace(/"/g, '""')}"`,
          ]);
        }
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DailyLog_AvicennaWay_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage('File CSV siap dibuka di Google Spreadsheet atau Microsoft Excel!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Integrasi Database Google Spreadsheet
              </h2>
              <p className="text-xs text-slate-500">
                Hubungkan pengisian Daily Log Avicenna Way langsung ke Google Sheets (Cloud Hosting)
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Cloud hosting status banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <Cloud className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <div className="font-bold text-emerald-950 flex items-center gap-2">
                <span>Tersimpan di Cloud Google (Hosting Cloud Run &amp; Google Drive)</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-mono">
                  Aktif
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Setiap baris data pengisian logbook dapat disinkronkan secara real-time ke Google Spreadsheet resmi sekolah Anda. Data tersimpan aman dan dapat dibuka kapan saja melalui browser atau Google Drive.
              </p>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Spreadsheet Connector Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link URL atau ID Google Spreadsheet:
              </label>
              <input
                type="text"
                value={spreadsheetUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                ID Terdeteksi: <span className="font-mono text-slate-700 font-bold">{spreadsheetId || '-'}</span>
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleCreateNewSheet}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Spreadsheet Baru Otomatis</span>
              </button>

              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Sinkronkan Semua Data Sekarang</span>
              </button>
            </div>

            {/* Open link if url exists */}
            {spreadsheetUrl && (
              <div className="pt-1 flex items-center justify-between text-xs">
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Google Spreadsheet di Tab Baru</span>
                </a>

                {config.lastSyncedAt && (
                  <span className="text-[11px] text-slate-500">
                    Terakhir disinkronkan: {config.lastSyncedAt}
                  </span>
                )}
              </div>
            )}

            {/* Auto-Sync Toggle */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Sinkronisasi Otomatis saat Guru Mengisi Log
                </h4>
                <p className="text-[11px] text-slate-500">
                  Menambahkan baris baru ke Google Sheet secara langsung setiap tombol simpan ditekan
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* CSV Backup Export */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Unduh Format Spreadsheet (.CSV)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Dapat di-import langsung ke Google Drive / Spreadsheet secara offline
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Konfigurasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

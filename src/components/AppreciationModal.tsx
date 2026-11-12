import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Check, Download, MessageCircle, Play, RotateCcw, Share2, Volume2, X } from 'lucide-react';
import { SchoolIdentity, TeacherStaff } from '../types';
import { celebrationAudio } from '../utils/audioCelebration';
import { createWhatsAppUrl, formatDisplayPhoneNumber, generateAppreciationMessage } from '../utils/whatsapp';

interface AppreciationModalProps {
  teacher: TeacherStaff | null;
  onClose: () => void;
  onAppreciationSent?: (teacherId: string) => void;
  schoolIdentity?: SchoolIdentity;
}

export const AppreciationModal: React.FC<AppreciationModalProps> = ({
  teacher,
  onClose,
  onAppreciationSent,
  schoolIdentity,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'certificate' | 'whatsapp'>('video');
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Trigger celebration effects on mount
  useEffect(() => {
    if (teacher) {
      celebrationAudio.playVictoryChime();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#047857', '#d97706', '#10b981', '#fbbf24', '#065f46'],
        });
      } catch (e) {
        // Confetti fallback
      }
    }
    return () => {
      celebrationAudio.stopSpeech();
    };
  }, [teacher]);

  if (!teacher) return null;

  const waMessage = generateAppreciationMessage(teacher);
  const waUrl = createWhatsAppUrl(teacher.phoneNumber, waMessage);

  const handleReplayVideo = () => {
    setIsPlayingAnimation(false);
    celebrationAudio.playVictoryChime();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#d97706', '#10b981', '#fbbf24'],
      });
    } catch (e) {
      // Confetti fallback
    }
    setTimeout(() => {
      setIsPlayingAnimation(true);
    }, 50);
  };

  const handleVoiceNarration = () => {
    celebrationAudio.speakAppreciation(teacher.name, teacher.unit);
  };

  const handleSendWhatsApp = () => {
    if (onAppreciationSent) {
      onAppreciationSent(teacher.id);
    }
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(waMessage);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadCertificateImage = () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw elegant certificate on canvas
      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      bgGrad.addColorStop(0, '#fbfcf8');
      bgGrad.addColorStop(1, '#f1f5f2');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // Border outer & inner
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.strokeRect(46, 46, 1108, 708);

      // Header School
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((schoolIdentity?.name || 'SEKOLAH AVICENNA LEADERSHIP').toUpperCase(), 600, 110);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText((schoolIdentity?.tagline || 'LEMBAGA PENGEMBANGAN KARAKTER & KEPEMIMPINAN SISWA').toUpperCase(), 600, 140);

      // Certificate Title
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SERTIFIKAT PENGHARGAAN', 600, 220);

      ctx.fillStyle = '#0f172a';
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('BINTANG TELADAN AVICENNA WAY (100% KELENGKAPAN)', 600, 260);

      ctx.fillStyle = '#475569';
      ctx.font = '18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Diberikan dengan penuh rasa bangga dan apresiasi kepada:', 600, 330);

      // Teacher Name
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(teacher.name, 600, 390);

      ctx.fillStyle = '#334155';
      ctx.font = '18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${teacher.role} · ${teacher.unit} · NIP: ${teacher.nip}`, 600, 425);

      // Citations
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'Atas keteladanan, kedisiplinan, dan konsistensi penuh (100%) dalam pencatatan',
        600,
        485
      );
      ctx.fillText(
        'refleksi harian pengamalan 7 Nilai Karakter Avicenna Way & 7 Habits pekan ini.',
        600,
        515
      );

      // Bottom Signatures
      const now = new Date();
      const dateStr = `Jakarta, ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      ctx.fillStyle = '#64748b';
      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(dateStr, 900, 580);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(schoolIdentity?.principalName || 'Dr. Irwan Syahputra, M.Pd.', 900, 670);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(schoolIdentity?.principalTitle || 'Koordinator Avicenna Way', 900, 695);

      // Stamp / QR representation
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.arc(300, 640, 50, 0, Math.PI * 2);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('AVICENNA', 300, 635);
      ctx.fillText('VERIFIED 100%', 300, 652);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Sertifikat_AvicennaWay_${teacher.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Failed to export certificate image', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Penghargaan Apresiasi 100% Avicenna Way
              </h2>
              <p className="text-xs text-slate-500">
                {teacher.name} · {teacher.unit}
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

        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-white">
          <button
            onClick={() => setActiveTab('video')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'video'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Video Ucapan &amp; Animasi Apresiasi
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'certificate'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Sertifikat / Gambar Digital
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Kirim ke WhatsApp Guru
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: VIDEO / CINEMATIC APPRECIATION ANIMATION */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-900 text-white p-8 text-center shadow-inner flex flex-col items-center justify-center min-h-[380px]">
                {/* Visual badge */}
                <div
                  className={`transition-all duration-700 ease-out transform ${
                    isPlayingAnimation ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 -rotate-12'
                  }`}
                >
                  <div className="relative mb-4">
                    <img
                      src="/src/assets/images/avicenna_award_badge_1794464191623.jpg"
                      alt="Lencana Emas Avicenna Way"
                      className="w-32 h-32 mx-auto rounded-full object-cover shadow-2xl border-4 border-amber-400 ring-4 ring-emerald-500/40"
                    />
                    <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                      Bintang Teladan
                    </div>
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-2 mt-1">
                  <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                    Apresiasi Kepatuhan 100% Sempurna
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {teacher.role} · {teacher.unit}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed pt-2">
                    &ldquo;Terima kasih atas keteladanan dan dedikasi penuh Bapak/Ibu dalam mengamalkan dan mencatat refleksi 7 Nilai Karakter Avicenna Way setiap hari tanpa terlewat minggu ini.&rdquo;
                  </p>
                </div>

                {/* Bottom media controls */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-800/50 w-full justify-center">
                  <button
                    onClick={handleReplayVideo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-xs font-medium text-emerald-100 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Putar Ulang
                  </button>
                  <button
                    onClick={handleVoiceNarration}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-colors shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Dengarkan Narasi Suara
                  </button>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Kirim WA
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Rekor pengisian: <strong>5 dari 5 hari</strong> tuntas terisi dengan catatan refleksi berbobot.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className="font-semibold text-emerald-700 hover:underline shrink-0"
                >
                  Buka Sertifikat &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATE IMAGE & DOWNLOAD */}
          {activeTab === 'certificate' && (
            <div className="space-y-4">
              <div
                ref={certificateRef}
                className="relative bg-[#fcfdfa] border-4 border-emerald-900 p-8 rounded-xl text-center shadow-md overflow-hidden"
              >
                {/* Inner border */}
                <div className="absolute inset-2 border-2 border-amber-600/60 rounded pointer-events-none" />

                <div className="relative z-10 space-y-3">
                  <div className="text-emerald-900 font-extrabold tracking-wider text-base uppercase">
                    {schoolIdentity?.name || 'Sekolah Avicenna Leadership'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {schoolIdentity?.tagline || 'Lembaga Pendidikan Teladan Nilai Karakter & Kepemimpinan'}
                  </div>

                  <div className="py-2">
                    <span className="text-xs font-bold text-amber-700 tracking-widest uppercase">
                      Piagam Penghargaan Mingguan
                    </span>
                    <h3 className="text-2xl font-extrabold text-emerald-950 mt-1">
                      BINTANG AVICENNA WAY
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    Dianugerahkan dengan penuh hormat kepada:
                  </p>

                  <div className="py-1">
                    <h4 className="text-xl font-bold text-slate-900">
                      {teacher.name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      NIP: {teacher.nip} · {teacher.role} · {teacher.unit}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
                    Atas konsistensi dan integritas mencapai <strong>100% kelengkapan Daily Log Avicenna Way &amp; 7 Habits</strong> minggu ini, menunjukkan keteladanan nyata dalam pengamalan nilai karakter.
                  </p>

                  {/* Signatures & Seal */}
                  <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between text-left text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full border-2 border-amber-500 bg-amber-50 flex flex-col items-center justify-center text-center p-1">
                        <span className="text-[8px] font-bold text-amber-800">{schoolIdentity?.logoInitial || 'AVICENNA'}</span>
                        <span className="text-[9px] font-extrabold text-emerald-800">100%</span>
                        <span className="text-[7px] text-slate-500">TERVERIFIKASI</span>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Status Validasi</div>
                        <div className="font-semibold text-emerald-800">Sah &amp; Tuntas</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-500">Jakarta, November 2026</div>
                      <div className="font-bold text-slate-900 mt-4">{schoolIdentity?.principalName || 'Dr. Irwan Syahputra, M.Pd.'}</div>
                      <div className="text-[11px] text-slate-600">{schoolIdentity?.principalTitle || 'Koordinator Avicenna Way'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleDownloadCertificateImage}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Menyimpan Gambar...' : 'Unduh Sertifikat (PNG Gambar)'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan ke WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP APPRECIATION DISPATCH */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500">Nomor WhatsApp Penerima:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {formatDisplayPhoneNumber(teacher.phoneNumber)}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Pesan apresiasi resmi di bawah ini akan dibuka otomatis di aplikasi WhatsApp Bapak/Ibu <strong>{teacher.name}</strong>.
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Pratinjau Pesan WhatsApp</span>
                  <button
                    onClick={handleCopyMessage}
                    className="text-emerald-700 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : null}
                    {isCopied ? 'Tersalin!' : 'Salin Teks'}
                  </button>
                </div>
                <div className="bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed shadow-sm">
                  {waMessage}
                </div>
              </div>

              {/* Send Button */}
              <div className="pt-2">
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Kirim Apresiasi Resmi via WhatsApp</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Membuka WhatsApp Web / Aplikasi WhatsApp langsung ke nomor {formatDisplayPhoneNumber(teacher.phoneNumber)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

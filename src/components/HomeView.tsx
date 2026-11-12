import React from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileSpreadsheet,
  Heart,
  Plus,
  School,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { AvicennaValueItem, HabitItem, SchoolIdentity, TeacherStaff } from '../types';
import { getCompletionStats } from '../utils/whatsapp';

interface HomeViewProps {
  schoolIdentity: SchoolIdentity;
  teachers: TeacherStaff[];
  avicennaValues: AvicennaValueItem[];
  habits: HabitItem[];
  isAdmin: boolean;
  onNavigateTab: (tab: 'resume' | 'input' | 'personal' | 'identity' | 'sheets' | 'values') => void;
  onOpenQuickLog: () => void;
  onOpenAdminLogin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  schoolIdentity,
  teachers,
  avicennaValues,
  habits,
  isAdmin,
  onNavigateTab,
  onOpenQuickLog,
  onOpenAdminLogin,
}) => {
  const total = teachers.length;
  const completed100 = teachers.filter((t) => getCompletionStats(t).is100Percent).length;
  const incomplete = total - completed100;
  const totalPossible = total * 5;
  const totalFilled = teachers.reduce(
    (acc, t) => acc + getCompletionStats(t).filledCount,
    0
  );
  const complianceRate = totalPossible > 0 ? Math.round((totalFilled / totalPossible) * 100) : 0;

  const heroImage =
    schoolIdentity.heroImageUrl ||
    '/src/assets/images/avicenna_school_campus_1794464193346.jpg';

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card - Modern & Clean */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-xs group">
        <div className="relative h-60 sm:h-72 w-full overflow-hidden">
          <img
            src={heroImage}
            alt={schoolIdentity.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-emerald-950/20" />

          {/* Admin quick change photo button */}
          {isAdmin && (
            <button
              onClick={() => onNavigateTab('identity')}
              className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-semibold border border-white/20 transition-all shadow-md active:scale-95"
              title="Ganti Foto Gedung Sekolah"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-300" />
              <span>Ganti Foto Sekolah</span>
            </button>
          )}

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                {schoolIdentity.academicYear || 'Tahun Ajaran 2026/2027'}
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">·</span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                {schoolIdentity.tagline}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {schoolIdentity.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mt-1 leading-relaxed">
              Portal pencatatan Daily Log nilai karakter Avicenna Way dan pembiasaan 7 Habits terhubung langsung ke WhatsApp dan Google Spreadsheet.
            </p>

            {/* Quick Hero Actions */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button
                onClick={onOpenQuickLog}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>Isi Daily Log Hari Ini</span>
              </button>

              <button
                onClick={() => onNavigateTab('personal')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs font-bold transition-all"
              >
                <User className="w-4 h-4" />
                <span>Cek Progress Pengisian Saya</span>
              </button>

              <button
                onClick={() => onNavigateTab('resume')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 rounded-xl text-xs font-medium transition-all"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Lihat Resume Mingguan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status Cards for Teachers & School */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Kepatuhan Sekolah</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
              {complianceRate}%
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{totalFilled} dari {totalPossible} log terisi</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Tuntas 100% (Apresiasi)</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-0.5">
              {completed100}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-500" />
              <span>Berhak Piagam &amp; Video</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Perlu Pengingat WA</div>
            <div className="text-2xl font-extrabold font-mono text-amber-600 mt-0.5">
              {incomplete}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              <span>Pengingat personal otomatis</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Batas Pengisian</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Jumat, 17.00 WIB
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              <span>Rekapitulasi otomatis</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2-Column Split: Panduan Pengisian Guru & Nilai Karakter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Alur Praktis Pengisian Guru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Alur Praktis Pengisian bagi Guru
              </h2>
              <p className="text-xs text-slate-500">
                Langkah cepat menyelesaikan Daily Log Avicenna Way setiap hari
              </p>
            </div>
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">Buka Menu &ldquo;Isi Logbook&rdquo;</div>
                <p className="text-slate-600">
                  Pilih nama Anda, tentukan hari yang ingin diisi (Senin s/d Jumat).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">Pilih Nilai Karakter &amp; 7 Habits</div>
                <p className="text-slate-600">
                  Tentukan nilai karakter utama Avicenna Way dan pembiasaan 7 Habits yang relevan hari ini.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">Tuliskan Refleksi Aksi Nyata</div>
                <p className="text-slate-600">
                  Ceritakan singkat capaian, tantangan, atau keteladanan yang diterapkan di kelas bersama murid.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                ★
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-emerald-950">Raih Apresiasi 100% di Akhir Pekan</div>
                <p className="text-emerald-800">
                  Jika 5 hari terisi penuh, Piagam Bintang Avicenna Way dan video selebrasi otomatis diterbitkan!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inti 7 Karakter Avicenna & 7 Habits */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Pilar Nilai Avicenna Way &amp; 7 Habits
              </h2>
              <p className="text-xs text-slate-500">
                Landasan keteladanan pendidik di {schoolIdentity.name}
              </p>
            </div>
            <Compass className="w-4 h-4 text-amber-600" />
          </div>

          <div className="space-y-2">
            {avicennaValues.slice(0, 4).map((val) => (
              <div
                key={val.id}
                className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/50 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{val.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Dilengkapi dengan {habits.length} pembiasaan The 7 Habits
            </span>
            {isAdmin ? (
              <button
                onClick={() => onNavigateTab('values')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Kelola Nilai</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Admin Panel Access Banner (if not logged in) */}
      {!isAdmin && (
        <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Shield className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              Anda sedang dalam <strong>Tampilan User Guru</strong>. Untuk mengakses pengaturan identitas sekolah, Google Sheets, dan kelola nilai, silakan masuk ke akun Admin.
            </span>
          </div>
          <button
            onClick={onOpenAdminLogin}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap self-start sm:self-auto"
          >
            Login Admin Utama
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Award,
  BellRing,
  BookOpen,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  Home,
  Lock,
  LogOut,
  School,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { AdminSession, SchoolIdentity } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'resume' | 'input' | 'personal' | 'staff' | 'schedule' | 'values' | 'sheets' | 'identity';
  setActiveTab: (tab: 'home' | 'resume' | 'input' | 'personal' | 'staff' | 'schedule' | 'values' | 'sheets' | 'identity') => void;
  onOpenBatchReminder: () => void;
  onOpenAdminModal: () => void;
  adminSession: AdminSession;
  schoolIdentity: SchoolIdentity;
  incompleteCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBatchReminder,
  onOpenAdminModal,
  adminSession,
  schoolIdentity,
  incompleteCount,
}) => {
  const isAdmin = adminSession.isLoggedIn;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark & School Branding */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              {schoolIdentity.logoInitial || 'AW'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-tight">
                {schoolIdentity.name || 'Avicenna Way'}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline truncate max-w-[220px]">
                Daily Log &amp; 7 Habits Reminder
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean Single-Line Controls) */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600">
            {/* GURU & PUBLIC USER TABS */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Halaman Utama</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'resume'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Resume Mingguan</span>
            </button>

            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'input'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Isi Logbook</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'personal'
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Progress Pengisian Guru</span>
            </button>

            {/* ADMIN-ONLY EXCLUSIVE TABS */}
            {isAdmin && (
              <>
                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                  onClick={() => setActiveTab('identity')}
                  className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'identity'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                  title="Setting Identitas Sekolah (Khusus Admin)"
                >
                  <School className="w-3.5 h-3.5 text-amber-600" />
                  <span>Identitas Sekolah</span>
                </button>

                <button
                  onClick={() => setActiveTab('values')}
                  className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'values'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                  title="Kelola Nilai Utama & 7 Habits (Khusus Admin)"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span>Nilai &amp; Habits</span>
                </button>

                <button
                  onClick={() => setActiveTab('sheets')}
                  className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'sheets'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                  title="Integrasi Google Sheets (Khusus Admin)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Spreadsheet</span>
                </button>

                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'staff'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                  title="Kelola Kontak Guru & WA (Khusus Admin)"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kontak WA</span>
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Role Switcher & Action CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Admin Badge or Login Button */}
            <button
              type="button"
              onClick={onOpenAdminModal}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">Admin Utama</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-mono">
                    Full Akses
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Login Admin</span>
                  <span className="sm:hidden">Admin</span>
                </>
              )}
            </button>

            {/* Admin-only Reminder Massal Action */}
            {isAdmin && (
              <button
                onClick={onOpenBatchReminder}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Reminder WA</span>
                {incompleteCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-emerald-900/60 rounded text-[10px] font-mono tabular-nums">
                    {incompleteCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar with role filtering */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 whitespace-nowrap rounded ${activeTab === 'home' ? 'text-emerald-700 font-bold bg-white' : ''}`}
        >
          Beranda
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`px-2 py-1 whitespace-nowrap rounded ${activeTab === 'resume' ? 'text-emerald-700 font-bold bg-white' : ''}`}
        >
          Resume
        </button>
        <button
          onClick={() => setActiveTab('input')}
          className={`px-2 py-1 whitespace-nowrap rounded ${activeTab === 'input' ? 'text-emerald-700 font-bold bg-white' : ''}`}
        >
          Isi Log
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-2 py-1 whitespace-nowrap rounded ${activeTab === 'personal' ? 'text-emerald-700 font-bold bg-white' : ''}`}
        >
          Progress Guru
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('identity')}
              className={`px-2 py-1 whitespace-nowrap rounded text-amber-800 ${activeTab === 'identity' ? 'font-bold bg-white' : ''}`}
            >
              Identitas
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-2 py-1 whitespace-nowrap rounded text-amber-800 ${activeTab === 'values' ? 'font-bold bg-white' : ''}`}
            >
              Nilai &amp; Habits
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-2 py-1 whitespace-nowrap rounded text-amber-800 ${activeTab === 'sheets' ? 'font-bold bg-white' : ''}`}
            >
              Sheets
            </button>
          </>
        )}
      </div>
    </header>
  );
};

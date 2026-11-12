import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Award,
  BellRing,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Cloud,
  FileSpreadsheet,
  Home,
  Lock,
  Plus,
  RefreshCw,
  School,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AppreciationModal } from './components/AppreciationModal';
import { BatchReminderModal } from './components/BatchReminderModal';
import { DailyLogInputModal } from './components/DailyLogInputModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { HomeView } from './components/HomeView';
import { ManageValuesAndHabitsModal } from './components/ManageValuesAndHabitsModal';
import { Navbar } from './components/Navbar';
import { PersonalReminderModal } from './components/PersonalReminderModal';
import { ReminderScheduleSettingsModal } from './components/ReminderScheduleSettingsModal';
import { SchoolIdentitySettingsModal } from './components/SchoolIdentitySettingsModal';
import { StaffDirectoryModal } from './components/StaffDirectoryModal';
import { StatsOverview } from './components/StatsOverview';
import { TeacherPersonalProgressView } from './components/TeacherPersonalProgressView';
import { WeeklyResumeView } from './components/WeeklyResumeView';
import { appendLogToGoogleSheet } from './services/googleSheets';
import {
  getStoredAdminSession,
  getStoredAvicennaValues,
  getStoredHabits,
  getStoredSchoolIdentity,
  getStoredSettings,
  getStoredSheetsConfig,
  getStoredTeachers,
  recordAppreciationSent,
  recordReminderSent,
  resetToDefaultData,
  saveAdminSession,
  saveAvicennaValues,
  saveHabits,
  saveSchoolIdentity,
  saveSettings,
  saveSheetsConfig,
  saveTeachers,
  submitDailyLog,
} from './services/storage';
import {
  AdminSession,
  AvicennaValueItem,
  DayOfWeek,
  GoogleSheetsConfig,
  HabitItem,
  ReminderScheduleSettings,
  SchoolIdentity,
  TeacherStaff,
} from './types';
import { getCompletionStats } from './utils/whatsapp';

export default function App() {
  const [teachers, setTeachers] = useState<TeacherStaff[]>([]);
  const [settings, setSettings] = useState<ReminderScheduleSettings>(getStoredSettings());
  const [schoolIdentity, setSchoolIdentity] = useState<SchoolIdentity>(getStoredSchoolIdentity());
  const [avicennaValues, setAvicennaValues] = useState<AvicennaValueItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(getStoredSheetsConfig());
  const [adminSession, setAdminSession] = useState<AdminSession>(getStoredAdminSession());

  // Active view
  const [activeTab, setActiveTab] = useState<
    'home' | 'resume' | 'input' | 'personal' | 'staff' | 'schedule' | 'values' | 'sheets' | 'identity'
  >('home');

  // Selected teacher for personal view
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  // Modals state
  const [appreciationTeacher, setAppreciationTeacher] = useState<TeacherStaff | null>(null);
  const [personalReminderTeacher, setPersonalReminderTeacher] = useState<TeacherStaff | null>(null);
  const [batchReminderOpen, setBatchReminderOpen] = useState<boolean>(false);
  const [dailyLogOpen, setDailyLogOpen] = useState<boolean>(false);
  const [quickLogTeacherId, setQuickLogTeacherId] = useState<string | undefined>(undefined);
  const [staffModalOpen, setStaffModalOpen] = useState<boolean>(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [valuesModalOpen, setValuesModalOpen] = useState<boolean>(false);
  const [sheetsModalOpen, setSheetsModalOpen] = useState<boolean>(false);
  const [identityModalOpen, setIdentityModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial load
  useEffect(() => {
    const loadedTeachers = getStoredTeachers();
    setTeachers(loadedTeachers);
    if (loadedTeachers.length > 0) {
      setSelectedTeacherId(loadedTeachers[0].id);
    }
    setSettings(getStoredSettings());
    setSchoolIdentity(getStoredSchoolIdentity());
    setAvicennaValues(getStoredAvicennaValues());
    setHabits(getStoredHabits());
    setSheetsConfig(getStoredSheetsConfig());
    setAdminSession(getStoredAdminSession());
  }, []);

  const isAdmin = adminSession.isLoggedIn;

  // Compute incomplete count
  const incompleteCount = teachers.filter((t) => !getCompletionStats(t).is100Percent).length;

  const handleReminderSent = (teacherId: string) => {
    const updated = recordReminderSent(teacherId);
    setTeachers(updated);
    showToast('Tautan WhatsApp berhasil dibuat & status reminder diperbarui');
  };

  const handleAppreciationSent = (teacherId: string) => {
    const updated = recordAppreciationSent(teacherId);
    setTeachers(updated);
    showToast('Pesan apresiasi resmi dikirim ke WhatsApp guru');
  };

  const handleSubmitDailyLog = async (
    teacherId: string,
    day: DayOfWeek,
    characterValue: string,
    habitValue: string,
    reflection: string,
    notes?: string
  ) => {
    const updated = submitDailyLog(
      teacherId,
      day,
      characterValue,
      habitValue,
      reflection,
      notes
    );
    setTeachers(updated);
    setDailyLogOpen(false);

    // Auto-sync to Google Sheet if configured
    const currentTeacher = updated.find((t) => t.id === teacherId);
    if (currentTeacher && sheetsConfig.connected && sheetsConfig.autoSyncOnSubmit) {
      appendLogToGoogleSheet(sheetsConfig.spreadsheetId, currentTeacher, currentTeacher.days[day]);
    }

    // Check if teacher now reached 100%
    if (currentTeacher && getCompletionStats(currentTeacher).is100Percent) {
      showToast(`Luar biasa! ${currentTeacher.name} telah mencapai 100% Daily Log! 🎉`);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#047857', '#d97706', '#10b981', '#fbbf24'],
        });
      } catch (e) {
        // fallback
      }
      setTimeout(() => {
        setAppreciationTeacher(currentTeacher);
      }, 500);
    } else {
      showToast('Daily log & 7 Habits berhasil disimpan!');
    }
  };

  const handleUpdateTeacher = (updated: TeacherStaff) => {
    const newTeachers = teachers.map((t) => (t.id === updated.id ? updated : t));
    setTeachers(newTeachers);
    saveTeachers(newTeachers);
    showToast(`Data kontak ${updated.name} berhasil diperbarui`);
  };

  const handleAddTeacher = (newTeacher: TeacherStaff) => {
    const newTeachers = [newTeacher, ...teachers];
    setTeachers(newTeachers);
    saveTeachers(newTeachers);
    showToast(`Guru baru ${newTeacher.name} berhasil didaftarkan`);
  };

  const handleDeleteTeacher = (id: string) => {
    const newTeachers = teachers.filter((t) => t.id !== id);
    setTeachers(newTeachers);
    saveTeachers(newTeachers);
    showToast('Data berhasil dihapus');
  };

  const handleSaveSettings = (newSettings: ReminderScheduleSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast('Pengaturan jadwal & koordinator berhasil disimpan');
  };

  const handleSaveSchoolIdentity = (newIdentity: SchoolIdentity) => {
    setSchoolIdentity(newIdentity);
    saveSchoolIdentity(newIdentity);
    showToast('Identitas sekolah berhasil diperbarui di seluruh sistem!');
  };

  const handleUpdateValues = (newValues: AvicennaValueItem[]) => {
    setAvicennaValues(newValues);
    saveAvicennaValues(newValues);
    showToast('Daftar Nilai Utama Avicenna Way berhasil diperbarui');
  };

  const handleUpdateHabits = (newHabits: HabitItem[]) => {
    setHabits(newHabits);
    saveHabits(newHabits);
    showToast('Daftar Nilai 7 Habits berhasil diperbarui');
  };

  const handleSaveSheetsConfig = (newConfig: GoogleSheetsConfig) => {
    setSheetsConfig(newConfig);
    saveSheetsConfig(newConfig);
    showToast('Pengaturan Google Spreadsheet tersimpan');
  };

  const handleLoginSuccess = (session: AdminSession) => {
    setAdminSession(session);
    saveAdminSession(session);
    showToast(`Selamat datang, ${session.adminName}! Mode Admin Utama aktif.`);
  };

  const handleLogout = () => {
    const empty: AdminSession = {
      isLoggedIn: false,
      adminName: '',
      adminEmail: '',
      authMethod: 'pin',
    };
    setAdminSession(empty);
    saveAdminSession(empty);
    showToast('Kembali ke Tampilan Guru biasa.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset data ke sampel sekolah awal?')) {
      const initial = resetToDefaultData();
      setTeachers(initial);
      setSettings(getStoredSettings());
      setSchoolIdentity(getStoredSchoolIdentity());
      setAvicennaValues(getStoredAvicennaValues());
      setHabits(getStoredHabits());
      setSheetsConfig(getStoredSheetsConfig());
      showToast('Data disetel ulang ke sampel awal');
    }
  };

  const handleOpenQuickLog = (teacherId?: string) => {
    setQuickLogTeacherId(teacherId || selectedTeacherId || teachers[0]?.id);
    setDailyLogOpen(true);
  };

  const handleTabNavigation = (
    tab: 'home' | 'resume' | 'input' | 'personal' | 'staff' | 'schedule' | 'values' | 'sheets' | 'identity'
  ) => {
    if (tab === 'input') {
      handleOpenQuickLog();
    } else if (tab === 'identity') {
      if (isAdmin) {
        setIdentityModalOpen(true);
      } else {
        setAdminModalOpen(true);
      }
    } else if (tab === 'values') {
      if (isAdmin) {
        setValuesModalOpen(true);
      } else {
        setAdminModalOpen(true);
      }
    } else if (tab === 'sheets') {
      if (isAdmin) {
        setSheetsModalOpen(true);
      } else {
        setAdminModalOpen(true);
      }
    } else if (tab === 'staff') {
      if (isAdmin) {
        setStaffModalOpen(true);
      } else {
        setAdminModalOpen(true);
      }
    } else if (tab === 'schedule') {
      if (isAdmin) {
        setScheduleModalOpen(true);
      } else {
        setAdminModalOpen(true);
      }
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabNavigation}
        onOpenBatchReminder={() => setBatchReminderOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        adminSession={adminSession}
        schoolIdentity={schoolIdentity}
        incompleteCount={incompleteCount}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Admin Quick Action Strip (Only visible to Admin) */}
        {isAdmin && (
          <div className="mb-5 bg-white border border-amber-200/80 rounded-2xl p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>Panel Kontrol Admin Utama: {schoolIdentity.name}</span>
                  <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-300 px-1.5 py-0.2 rounded font-mono font-semibold">
                    Akses Penuh
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Anda memiliki otoritas penuh mengubah Identitas Sekolah, Nilai Utama &amp; 7 Habits, serta Sinkronisasi Spreadsheet.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIdentityModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <School className="w-3.5 h-3.5 text-amber-700" />
                <span>Identitas Sekolah</span>
              </button>

              <button
                onClick={() => setValuesModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>Nilai &amp; Habits</span>
              </button>

              <button
                onClick={() => setSheetsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Spreadsheet</span>
              </button>

              <button
                onClick={() => setStaffModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span>Kontak WA</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: HALAMAN UTAMA */}
        {activeTab === 'home' && (
          <HomeView
            schoolIdentity={schoolIdentity}
            teachers={teachers}
            avicennaValues={avicennaValues}
            habits={habits}
            isAdmin={isAdmin}
            onNavigateTab={(tab) => {
              if (tab === 'input') handleOpenQuickLog();
              else setActiveTab(tab);
            }}
            onOpenQuickLog={() => handleOpenQuickLog()}
            onOpenAdminLogin={() => setAdminModalOpen(true)}
          />
        )}

        {/* VIEW 2: RESUME MINGGUAN */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <StatsOverview teachers={teachers} />
            <WeeklyResumeView
              teachers={teachers}
              onOpenAppreciation={(t) => setAppreciationTeacher(t)}
              onOpenPersonalReminder={(t) => setPersonalReminderTeacher(t)}
              onOpenQuickLog={(tId) => handleOpenQuickLog(tId)}
              onReminderSent={handleReminderSent}
              coordinatorName={schoolIdentity.principalName}
              schoolIdentity={schoolIdentity}
              isAdmin={isAdmin}
              onOpenEditIdentity={() => setIdentityModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: PROGRESS PENGISIAN MASING-MASING USER GURU */}
        {activeTab === 'personal' && (
          <TeacherPersonalProgressView
            teachers={teachers}
            selectedTeacherId={selectedTeacherId}
            onSelectTeacherId={(id) => setSelectedTeacherId(id)}
            onOpenQuickLog={(tId) => handleOpenQuickLog(tId)}
            onOpenAppreciation={(t) => setAppreciationTeacher(t)}
            schoolName={schoolIdentity.name}
          />
        )}
      </main>

      {/* Footer with Mandatory Copyright @zieridho13 */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-900">{schoolIdentity.name}</span>
            <span className="hidden sm:inline">·</span>
            <span>{schoolIdentity.tagline}</span>
            <span className="hidden sm:inline">·</span>
            {/* Copyright @zieridho13 */}
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              © 2026 Developed by @zieridho13
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-slate-800 transition-colors"
            >
              Halaman Utama
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('resume')}
              className="hover:text-slate-800 transition-colors"
            >
              Resume
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('personal')}
              className="hover:text-slate-800 transition-colors"
            >
              Progress Guru
            </button>
            <span>·</span>
            {isAdmin ? (
              <>
                <button
                  onClick={() => setIdentityModalOpen(true)}
                  className="hover:text-slate-800 transition-colors font-medium text-amber-800"
                >
                  Setting Identitas
                </button>
                <span>·</span>
              </>
            ) : null}
            <button
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-slate-800 transition-colors"
            >
              {isAdmin ? 'Keluar Admin' : 'Login Admin'}
            </button>
            <span>·</span>
            <button
              onClick={handleResetData}
              className="hover:text-amber-700 transition-colors flex items-center gap-1"
              title="Reset ke data sampel"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. 100% Appreciation Modal (Video & Gambar) */}
      {appreciationTeacher && (
        <AppreciationModal
          teacher={appreciationTeacher}
          onClose={() => setAppreciationTeacher(null)}
          onAppreciationSent={handleAppreciationSent}
          schoolIdentity={schoolIdentity}
        />
      )}

      {/* 2. Personal Reminder Modal */}
      {personalReminderTeacher && (
        <PersonalReminderModal
          teacher={personalReminderTeacher}
          onClose={() => setPersonalReminderTeacher(null)}
          onReminderSent={handleReminderSent}
          coordinatorName={schoolIdentity.principalName}
        />
      )}

      {/* 3. Batch Reminder Modal */}
      {batchReminderOpen && (
        <BatchReminderModal
          teachers={teachers}
          onClose={() => setBatchReminderOpen(false)}
          onReminderSent={handleReminderSent}
          coordinatorName={schoolIdentity.principalName}
        />
      )}

      {/* 4. Daily Log Input Modal */}
      {dailyLogOpen && (
        <DailyLogInputModal
          teachers={teachers}
          avicennaValues={avicennaValues}
          habits={habits}
          onClose={() => setDailyLogOpen(false)}
          onSubmitLog={handleSubmitDailyLog}
          initialTeacherId={quickLogTeacherId}
        />
      )}

      {/* 5. Setting Pengaturan Identitas Sekolah Modal */}
      {identityModalOpen && (
        <SchoolIdentitySettingsModal
          identity={schoolIdentity}
          onSave={handleSaveSchoolIdentity}
          onClose={() => setIdentityModalOpen(false)}
        />
      )}

      {/* 6. Staff Directory Modal */}
      {staffModalOpen && (
        <StaffDirectoryModal
          teachers={teachers}
          onClose={() => setStaffModalOpen(false)}
          onUpdateTeacher={handleUpdateTeacher}
          onAddTeacher={handleAddTeacher}
          onDeleteTeacher={handleDeleteTeacher}
        />
      )}

      {/* 7. Scheduler Settings Modal */}
      {scheduleModalOpen && (
        <ReminderScheduleSettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setScheduleModalOpen(false)}
        />
      )}

      {/* 8. Manage Nilai Utama Avicenna & 7 Habits Modal */}
      {valuesModalOpen && (
        <ManageValuesAndHabitsModal
          avicennaValues={avicennaValues}
          habits={habits}
          onUpdateValues={handleUpdateValues}
          onUpdateHabits={handleUpdateHabits}
          onClose={() => setValuesModalOpen(false)}
        />
      )}

      {/* 9. Google Sheets & Cloud Hosting Modal */}
      {sheetsModalOpen && (
        <GoogleSheetsModal
          config={sheetsConfig}
          teachers={teachers}
          onSaveConfig={handleSaveSheetsConfig}
          onClose={() => setSheetsModalOpen(false)}
        />
      )}

      {/* 10. Admin Utama Login Modal */}
      {adminModalOpen && (
        <AdminLoginModal
          adminSession={adminSession}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onClose={() => setAdminModalOpen(false)}
        />
      )}
    </div>
  );
}

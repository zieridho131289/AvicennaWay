export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';

export interface DailyLogDayStatus {
  day: DayOfWeek;
  date: string; // YYYY-MM-DD
  isFilled: boolean;
  filledAt?: string;
  characterValue?: string;
  habitValue?: string; // 7 Habits
  reflection?: string;
  notes?: string;
}

export type SchoolUnit = 'SD Avicenna' | 'SMP Avicenna' | 'SMA Avicenna' | 'Staf & Operasional';

export interface TeacherStaff {
  id: string;
  name: string;
  nip: string;
  role: string; // e.g. "Guru Matematika", "Wali Kelas 8A", "Guru IPA", "Staf TU"
  unit: SchoolUnit;
  phoneNumber: string; // WhatsApp number
  email: string;
  avatarUrl?: string;
  days: Record<DayOfWeek, DailyLogDayStatus>;
  lastReminderSentAt?: string;
  lastAppreciationSentAt?: string;
}

export interface WeeklyResumeStats {
  totalStaff: number;
  completed100Count: number;
  incompleteCount: number;
  complianceRate: number; // percentage e.g. 78.5%
  unitBreakdown: Record<SchoolUnit, { total: number; completed100: number; rate: number }>;
}

export interface ReminderScheduleSettings {
  autoReminderDaily: boolean;
  dailyReminderTime: string; // e.g. "16:00"
  autoWeeklyResume: boolean;
  weeklyResumeDay: 'Jumat' | 'Sabtu';
  weeklyResumeTime: string; // e.g. "15:00"
  schoolName: string;
  schoolCoordinatorName: string;
  coordinatorContact: string;
}

export interface SchoolIdentity {
  name: string;
  tagline: string;
  logoInitial: string;
  academicYear: string;
  address: string;
  phone: string;
  website: string;
  principalName: string;
  principalNip: string;
  principalTitle: string;
  heroImageUrl?: string;
}

export interface AvicennaValueItem {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface HabitItem {
  id: string;
  name: string;
  habitNumber: number;
  description: string;
}

export interface GoogleSheetsConfig {
  connected: boolean;
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetName: string;
  lastSyncedAt?: string;
  autoSyncOnSubmit: boolean;
}

export interface AdminSession {
  isLoggedIn: boolean;
  adminName: string;
  adminEmail: string;
  authMethod: 'google' | 'pin';
  loginTimestamp?: string;
}

export type UserRole = 'teacher' | 'admin';

export type ReminderTone = 'formal' | 'friendly' | 'encouraging';

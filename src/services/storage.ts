import {
  DEFAULT_7_HABITS,
  DEFAULT_AVICENNA_VALUES,
  DEFAULT_SCHOOL_IDENTITY,
  DEFAULT_SHEETS_CONFIG,
  INITIAL_SCHEDULE_SETTINGS,
  INITIAL_TEACHERS,
} from '../data/mockData';
import {
  AdminSession,
  AvicennaValueItem,
  DayOfWeek,
  GoogleSheetsConfig,
  HabitItem,
  ReminderScheduleSettings,
  SchoolIdentity,
  TeacherStaff,
} from '../types';

const TEACHERS_STORAGE_KEY = 'avicenna_way_teachers_v2';
const SETTINGS_STORAGE_KEY = 'avicenna_way_settings_v2';
const VALUES_STORAGE_KEY = 'avicenna_core_values_v1';
const HABITS_STORAGE_KEY = 'avicenna_7_habits_v1';
const SHEETS_CONFIG_KEY = 'avicenna_sheets_config_v1';
const ADMIN_SESSION_KEY = 'avicenna_admin_session_v1';
const SCHOOL_IDENTITY_KEY = 'avicenna_school_identity_v1';

// SCHOOL IDENTITY
export function getStoredSchoolIdentity(): SchoolIdentity {
  try {
    const raw = localStorage.getItem(SCHOOL_IDENTITY_KEY);
    if (!raw) {
      localStorage.setItem(SCHOOL_IDENTITY_KEY, JSON.stringify(DEFAULT_SCHOOL_IDENTITY));
      return DEFAULT_SCHOOL_IDENTITY;
    }
    return JSON.parse(raw) as SchoolIdentity;
  } catch (e) {
    return DEFAULT_SCHOOL_IDENTITY;
  }
}

export function saveSchoolIdentity(identity: SchoolIdentity): void {
  try {
    localStorage.setItem(SCHOOL_IDENTITY_KEY, JSON.stringify(identity));
  } catch (e) {
    console.error(e);
  }
}

// TEACHERS
export function getStoredTeachers(): TeacherStaff[] {
  try {
    const raw = localStorage.getItem(TEACHERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    return JSON.parse(raw) as TeacherStaff[];
  } catch (e) {
    console.error('Failed to load teachers from storage', e);
    return INITIAL_TEACHERS;
  }
}

export function saveTeachers(teachers: TeacherStaff[]): void {
  try {
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
  } catch (e) {
    console.error('Failed to save teachers to storage', e);
  }
}

// AVICENNA VALUES CRUD (Tambah / Kurangi secara manual)
export function getStoredAvicennaValues(): AvicennaValueItem[] {
  try {
    const raw = localStorage.getItem(VALUES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VALUES_STORAGE_KEY, JSON.stringify(DEFAULT_AVICENNA_VALUES));
      return DEFAULT_AVICENNA_VALUES;
    }
    return JSON.parse(raw) as AvicennaValueItem[];
  } catch (e) {
    return DEFAULT_AVICENNA_VALUES;
  }
}

export function saveAvicennaValues(values: AvicennaValueItem[]): void {
  try {
    localStorage.setItem(VALUES_STORAGE_KEY, JSON.stringify(values));
  } catch (e) {
    console.error(e);
  }
}

export function addAvicennaValue(name: string, description: string, color: string = 'emerald'): AvicennaValueItem[] {
  const current = getStoredAvicennaValues();
  const newItem: AvicennaValueItem = {
    id: `val-${Date.now()}`,
    name,
    description,
    color,
  };
  const updated = [...current, newItem];
  saveAvicennaValues(updated);
  return updated;
}

export function updateAvicennaValue(updatedItem: AvicennaValueItem): AvicennaValueItem[] {
  const current = getStoredAvicennaValues();
  const updated = current.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  saveAvicennaValues(updated);
  return updated;
}

export function deleteAvicennaValue(id: string): AvicennaValueItem[] {
  const current = getStoredAvicennaValues();
  const updated = current.filter((item) => item.id !== id);
  saveAvicennaValues(updated);
  return updated;
}

// 7 HABITS CRUD (Tambah / Kurangi secara manual)
export function getStoredHabits(): HabitItem[] {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(DEFAULT_7_HABITS));
      return DEFAULT_7_HABITS;
    }
    return JSON.parse(raw) as HabitItem[];
  } catch (e) {
    return DEFAULT_7_HABITS;
  }
}

export function saveHabits(habits: HabitItem[]): void {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error(e);
  }
}

export function addHabit(name: string, description: string): HabitItem[] {
  const current = getStoredHabits();
  const newItem: HabitItem = {
    id: `hbt-${Date.now()}`,
    habitNumber: current.length + 1,
    name,
    description,
  };
  const updated = [...current, newItem];
  saveHabits(updated);
  return updated;
}

export function updateHabit(updatedItem: HabitItem): HabitItem[] {
  const current = getStoredHabits();
  const updated = current.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  saveHabits(updated);
  return updated;
}

export function deleteHabit(id: string): HabitItem[] {
  const current = getStoredHabits();
  const updated = current.filter((item) => item.id !== id);
  saveHabits(updated);
  return updated;
}

// GOOGLE SHEETS CONFIG
export function getStoredSheetsConfig(): GoogleSheetsConfig {
  try {
    const raw = localStorage.getItem(SHEETS_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(SHEETS_CONFIG_KEY, JSON.stringify(DEFAULT_SHEETS_CONFIG));
      return DEFAULT_SHEETS_CONFIG;
    }
    return JSON.parse(raw) as GoogleSheetsConfig;
  } catch (e) {
    return DEFAULT_SHEETS_CONFIG;
  }
}

export function saveSheetsConfig(config: GoogleSheetsConfig): void {
  try {
    localStorage.setItem(SHEETS_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error(e);
  }
}

// ADMIN SESSION
export function getStoredAdminSession(): AdminSession {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      return {
        isLoggedIn: false,
        adminName: '',
        adminEmail: '',
        authMethod: 'pin',
      };
    }
    return JSON.parse(raw) as AdminSession;
  } catch (e) {
    return {
      isLoggedIn: false,
      adminName: '',
      adminEmail: '',
      authMethod: 'pin',
    };
  }
}

export function saveAdminSession(session: AdminSession): void {
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error(e);
  }
}

// SETTINGS
export function getStoredSettings(): ReminderScheduleSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SCHEDULE_SETTINGS));
      return INITIAL_SCHEDULE_SETTINGS;
    }
    return JSON.parse(raw) as ReminderScheduleSettings;
  } catch (e) {
    return INITIAL_SCHEDULE_SETTINGS;
  }
}

export function saveSettings(settings: ReminderScheduleSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

// SUBMIT DAILY LOG (Includes 7 Habits)
export function submitDailyLog(
  teacherId: string,
  day: DayOfWeek,
  characterValue: string,
  habitValue: string,
  reflection: string,
  notes?: string
): TeacherStaff[] {
  const current = getStoredTeachers();
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const updated = current.map((t) => {
    if (t.id === teacherId) {
      return {
        ...t,
        days: {
          ...t.days,
          [day]: {
            day,
            date: now.toISOString().split('T')[0],
            isFilled: true,
            filledAt: timeStr,
            characterValue,
            habitValue,
            reflection,
            notes,
          },
        },
      };
    }
    return t;
  });

  saveTeachers(updated);
  return updated;
}

export function recordReminderSent(teacherId: string): TeacherStaff[] {
  const current = getStoredTeachers();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const updated = current.map((t) => {
    if (t.id === teacherId) {
      return {
        ...t,
        lastReminderSentAt: `Hari ini ${timeStr}`,
      };
    }
    return t;
  });
  saveTeachers(updated);
  return updated;
}

export function recordAppreciationSent(teacherId: string): TeacherStaff[] {
  const current = getStoredTeachers();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const updated = current.map((t) => {
    if (t.id === teacherId) {
      return {
        ...t,
        lastAppreciationSentAt: `Hari ini ${timeStr}`,
      };
    }
    return t;
  });
  saveTeachers(updated);
  return updated;
}

export function resetToDefaultData(): TeacherStaff[] {
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(INITIAL_TEACHERS));
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SCHEDULE_SETTINGS));
  localStorage.setItem(VALUES_STORAGE_KEY, JSON.stringify(DEFAULT_AVICENNA_VALUES));
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(DEFAULT_7_HABITS));
  localStorage.setItem(SHEETS_CONFIG_KEY, JSON.stringify(DEFAULT_SHEETS_CONFIG));
  localStorage.setItem(SCHOOL_IDENTITY_KEY, JSON.stringify(DEFAULT_SCHOOL_IDENTITY));
  return INITIAL_TEACHERS;
}

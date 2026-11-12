import { DayOfWeek, ReminderTone, TeacherStaff } from '../types';

/**
 * Normalizes phone number into international WhatsApp standard (e.g. 628123456789)
 */
export function normalizeWhatsAppNumber(rawNumber: string): string {
  if (!rawNumber) return '';
  // Remove non-digit characters except leading +
  let cleaned = rawNumber.replace(/[^0-9]/g, '');

  if (cleaned.startsWith('0')) {
    // 08123456789 -> 628123456789
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    // 8123456789 -> 628123456789
    cleaned = '62' + cleaned;
  }

  return cleaned;
}

/**
 * Formats WhatsApp number for pretty display (e.g. +62 812-3456-7890)
 */
export function formatDisplayPhoneNumber(rawNumber: string): string {
  const normalized = normalizeWhatsAppNumber(rawNumber);
  if (!normalized) return '-';
  if (normalized.startsWith('62')) {
    const rest = normalized.slice(2);
    if (rest.length >= 8) {
      return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
    }
    return `+62 ${rest}`;
  }
  return rawNumber;
}

/**
 * Lists the days of the week that the teacher hasn't filled yet
 */
export function getMissedDays(teacher: TeacherStaff): DayOfWeek[] {
  const weekDays: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  return weekDays.filter((day) => !teacher.days[day]?.isFilled);
}

/**
 * Calculates filling percentage
 */
export function getCompletionStats(teacher: TeacherStaff): {
  filledCount: number;
  totalDays: number;
  percentage: number;
  is100Percent: boolean;
  missedDays: DayOfWeek[];
} {
  const weekDays: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const filledCount = weekDays.filter((day) => teacher.days[day]?.isFilled).length;
  const totalDays = weekDays.length;
  const percentage = Math.round((filledCount / totalDays) * 100);
  const missedDays = getMissedDays(teacher);

  return {
    filledCount,
    totalDays,
    percentage,
    is100Percent: percentage === 100,
    missedDays,
  };
}

/**
 * Generates personal reminder text for WhatsApp
 */
export function generatePersonalReminderMessage(
  teacher: TeacherStaff,
  coordinatorName: string = 'Tim Kurikulum Avicenna',
  tone: ReminderTone = 'friendly',
  customNote?: string
): string {
  const missedDays = getMissedDays(teacher);
  const missedDaysStr = missedDays.length > 0 ? missedDays.join(', ') : 'beberapa hari';
  const { percentage, filledCount } = getCompletionStats(teacher);

  if (tone === 'formal') {
    return `*Pemberitahuan Resume Mingguan Daily Log Avicenna Way*

Yth. Bapak/Ibu *${teacher.name}*
${teacher.role} - ${teacher.unit}

Berdasarkan hasil rekapitulasi sistem Daily Log Avicenna Way minggu ini:
• Progres Pengisian: *${percentage}%* (${filledCount} dari 5 hari)
• Hari yang belum terisi: *${missedDaysStr}*

Mohon kesediaan Bapak/Ibu untuk melengkapi pengisian daily log sebelum penutupan sistem pada hari Jumat pukul 17.00 WIB melalui portal:
🔗 https://avicenna.sch.id/daily-log

${customNote ? `\n_Catatan Tambahan:_ ${customNote}\n` : ''}
Atas perhatian dan dedikasi Bapak/Ibu dalam menginternalisasi nilai-nilai Avicenna Way, kami ucapkan terima kasih.

Salam hormat,
*${coordinatorName}*
Sekolah Avicenna Leadership`;
  }

  if (tone === 'encouraging') {
    return `✨ *Semangat Menginspirasi, Bapak/Ibu ${teacher.name}!* ✨

Halo Bapak/Ibu ${teacher.name} (${teacher.unit}),
Refleksi dan pembiasaan nilai Avicenna Way Bapak/Ibu sangat berarti bagi perkembangan karakter peserta didik kita.

Catatan pengisian minggu ini:
📊 Progres Anda: *${percentage}%*
📝 Yuk lengkapi hari: *${missedDaysStr}*

Sedikit lagi mencapai 100% dan meraih Penghargaan Bintang Avicenna Way Mingguan! 🌟
Silakan isi di sini:
🔗 https://avicenna.sch.id/daily-log

${customNote ? `\n💡 _Pesan:_ ${customNote}\n` : ''}
Semoga senantiasa dilimpahkan kelancaran dalam bertugas.

Salam hangat,
*${coordinatorName}*`;
  }

  // Friendly (default)
  return `Halo Bapak/Ibu *${teacher.name}* (${teacher.unit}) 👋

Semoga harinya menyenangkan! Mengingatkan kembali untuk kelengkapan *Daily Log Avicenna Way* minggu ini:

Saat ini progres Bapak/Ibu berada di *${percentage}%* (${filledCount}/5 hari).
👉 Belum terisi untuk hari: *${missedDaysStr}*

Yuk sempatkan 2 menit untuk mengisi refleksi harian hari ini:
🔗 https://avicenna.sch.id/daily-log

${customNote ? `\n📌 _Catatan:_ ${customNote}\n` : ''}
Terima kasih banyak atas keteladanan Bapak/Ibu dalam menerapkan nilai-nilai luhur Avicenna Way! 🙏✨

Salam,
*${coordinatorName}*`;
}

/**
 * Generates WhatsApp appreciation message for 100% completion
 */
export function generateAppreciationMessage(
  teacher: TeacherStaff,
  coordinatorName: string = 'Manajemen Sekolah Avicenna'
): string {
  return `🎉 *SELAMAT! APRESIASI RESMI BINTANG AVICENNA WAY* 🌟

Yth. Bapak/Ibu *${teacher.name}*
${teacher.role} - ${teacher.unit}

Selamat! Bapak/Ibu telah mencapai *100% KELENGKAPAN DAILY LOG AVICENNA WAY* minggu ini secara konsisten dan berintegritas.

Komitmen Bapak/Ibu dalam mencatat refleksi harian serta mengamalkan 7 Karakter Avicenna Way merupakan keteladanan luar biasa bagi seluruh keluarga besar Sekolah Avicenna.

🏆 *Lencana & Sertifikat Apresiasi Digital* Bapak/Ibu telah terbit dan dapat dilihat di:
🔗 https://avicenna.sch.id/apresiasi/bintang-avicenna?id=${teacher.id}

Terima kasih atas dedikasi dan inspirasi yang selalu Bapak/Ibu berikan setiap hari! ✨

Salam hormat & bangga,
*${coordinatorName}*
Sekolah Avicenna Leadership`;
}

/**
 * Creates direct WhatsApp deep link
 */
export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(phoneNumber);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encodedMsg}`;
}

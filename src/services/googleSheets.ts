import { DailyLogDayStatus, GoogleSheetsConfig, TeacherStaff } from '../types';
import { getAccessToken } from './firebaseAuth';

/**
 * Appends a single daily log row to Google Sheets
 */
export async function appendLogToGoogleSheet(
  spreadsheetId: string,
  teacher: TeacherStaff,
  log: DailyLogDayStatus
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: 'Belum login ke Akun Google. Silakan klik Login Google Admin terlebih dahulu.',
      };
    }

    const range = 'Sheet1!A:K';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const row = [
      new Date().toISOString(),
      teacher.id,
      teacher.name,
      teacher.nip,
      teacher.unit,
      teacher.phoneNumber,
      log.day,
      log.date,
      log.characterValue || '-',
      log.habitValue || '-',
      log.reflection || '-',
      log.notes || '-',
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Gagal mengirim data ke Google Sheets');
    }

    return {
      success: true,
      message: 'Berhasil tersinkronisasi ke Google Spreadsheet!',
    };
  } catch (error: any) {
    console.warn('Google Sheets sync notice:', error.message);
    return {
      success: false,
      message: error.message || 'Gagal sinkron ke Google Sheets',
    };
  }
}

/**
 * Creates a brand new Google Spreadsheet for Avicenna Way in the user's Google Drive
 */
export async function createAvicennaGoogleSheet(): Promise<{
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  message: string;
}> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Silakan Sign in with Google terlebih dahulu.');
    }

    const title = `Database Daily Log Avicenna Way - ${new Date().getFullYear()}`;
    const url = 'https://sheets.googleapis.com/v4/spreadsheets';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title,
        },
        sheets: [
          {
            properties: {
              title: 'DailyLog_AvicennaWay',
              gridProperties: {
                rowCount: 1000,
                columnCount: 15,
                frozenRowCount: 1,
              },
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Timestamp' } },
                      { userEnteredValue: { stringValue: 'ID Guru' } },
                      { userEnteredValue: { stringValue: 'Nama Guru / Staf' } },
                      { userEnteredValue: { stringValue: 'NIP' } },
                      { userEnteredValue: { stringValue: 'Unit Sekolah' } },
                      { userEnteredValue: { stringValue: 'No. WhatsApp' } },
                      { userEnteredValue: { stringValue: 'Hari' } },
                      { userEnteredValue: { stringValue: 'Tanggal' } },
                      { userEnteredValue: { stringValue: 'Nilai Utama Avicenna Way' } },
                      { userEnteredValue: { stringValue: 'Nilai 7 Habits' } },
                      { userEnteredValue: { stringValue: 'Catatan Refleksi' } },
                      { userEnteredValue: { stringValue: 'Dokumentasi / Catatan' } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Gagal membuat spreadsheet baru');
    }

    const data = await response.json();
    return {
      success: true,
      spreadsheetId: data.spreadsheetId,
      spreadsheetUrl: data.spreadsheetUrl,
      message: 'Berhasil membuat Google Spreadsheet baru di Google Drive Anda!',
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || 'Gagal membuat spreadsheet',
    };
  }
}

/**
 * Syncs all current teachers weekly log entries to the Google Spreadsheet
 */
export async function syncAllLogsToSheet(
  spreadsheetId: string,
  teachers: TeacherStaff[]
): Promise<{ success: boolean; rowCount: number; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Silakan Sign in with Google terlebih dahulu untuk sinkronisasi.');
    }

    const rows: (string | number)[][] = [];
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;

    teachers.forEach((teacher) => {
      days.forEach((d) => {
        const log = teacher.days[d];
        if (log && log.isFilled) {
          rows.push([
            log.filledAt || new Date().toISOString(),
            teacher.id,
            teacher.name,
            teacher.nip,
            teacher.unit,
            teacher.phoneNumber,
            log.day,
            log.date,
            log.characterValue || '-',
            log.habitValue || '-',
            log.reflection || '-',
            log.notes || '-',
          ]);
        }
      });
    });

    if (rows.length === 0) {
      return {
        success: true,
        rowCount: 0,
        message: 'Tidak ada data logbook terisi untuk disinkronkan.',
      };
    }

    const range = 'DailyLog_AvicennaWay!A2:L';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    });

    if (!response.ok) {
      // Try default Sheet1
      const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:L:append?valueInputOption=USER_ENTERED`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: rows,
        }),
      });

      if (!fallbackRes.ok) {
        const err = await fallbackRes.json();
        throw new Error(err.error?.message || 'Gagal menyinkronkan data ke Google Sheet.');
      }
    }

    return {
      success: true,
      rowCount: rows.length,
      message: `Berhasil mengekspor & menyinkronkan ${rows.length} baris ke Google Spreadsheet!`,
    };
  } catch (e: any) {
    return {
      success: false,
      rowCount: 0,
      message: e.message || 'Gagal sinkron ke Google Sheet',
    };
  }
}

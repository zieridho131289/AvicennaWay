import React, { useRef, useState } from 'react';
import {
  Building2,
  Camera,
  Check,
  Globe,
  Image as ImageIcon,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  School,
  Sparkles,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import { DEFAULT_SCHOOL_IDENTITY } from '../data/mockData';
import { SchoolIdentity } from '../types';

interface SchoolIdentitySettingsModalProps {
  identity: SchoolIdentity;
  onSave: (newIdentity: SchoolIdentity) => void;
  onClose: () => void;
}

export const SchoolIdentitySettingsModal: React.FC<SchoolIdentitySettingsModalProps> = ({
  identity,
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState<SchoolIdentity>(identity);
  const [isSaved, setIsSaved] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan ke identitas default Sekolah Avicenna?')) {
      setForm(DEFAULT_SCHOOL_IDENTITY);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file berupa gambar (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5 MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setForm((prev) => ({ ...prev, heroImageUrl: base64Url }));
      }
    };
    reader.readAsDataURL(file);
  };

  const currentHero =
    form.heroImageUrl ||
    '/src/assets/images/avicenna_school_campus_1794464193346.jpg';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Pengaturan Identitas &amp; Foto Sekolah
              </h2>
              <p className="text-xs text-slate-500">
                Ubah foto gedung sekolah, nama lembaga, logo inisial, dan pejabat sertifikat
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* SECTION 1: FOTO SEKOLAH (BERANDA & RESUME) */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Foto Gedung Sekolah (Tampil di Beranda &amp; Resume)</span>
              </h4>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                Dapat Diedit Admin
              </span>
            </div>

            {/* Current Image Preview */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner group">
              <img
                src={currentHero}
                alt={form.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] text-white font-medium drop-shadow">
                  Pratinjau Banner Foto Sekolah Aktif
                </span>
              </div>
            </div>

            {uploadError && (
              <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {uploadError}
              </div>
            )}

            {/* Upload & URL Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Foto dari Komputer</span>
                </button>
                <p className="text-[10px] text-slate-400 mt-1 text-center">
                  Mendukung file JPG, PNG, WebP (maks 5 MB)
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      heroImageUrl:
                        '/src/assets/images/avicenna_school_campus_1794464193346.jpg',
                    }))
                  }
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Gunakan Foto Kampus Default</span>
                </button>
                <p className="text-[10px] text-slate-400 mt-1 text-center">
                  Foto gedung kampus Avicenna asli
                </p>
              </div>
            </div>

            {/* Manual URL field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Atau Tempelkan Link URL Foto Eksternal:
              </label>
              <input
                type="text"
                value={form.heroImageUrl || ''}
                onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
                placeholder="https://contoh.sch.id/gedung-sekolah.jpg"
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg font-mono bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* SECTION 2: PROFIL LEMBAGA */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Profil Lembaga &amp; Lembaga Pendidikan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Resmi Sekolah / Lembaga:
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Sekolah Avicenna Leadership"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Inisial Logo (1-4 Karakter):
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={form.logoInitial}
                  onChange={(e) =>
                    setForm({ ...form, logoInitial: e.target.value.toUpperCase() })
                  }
                  placeholder="AW"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Visi Karakter / Tagline Sekolah:
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Contoh: Membangun Karakter Unggul & Jiwa Kepemimpinan Berintegritas"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tahun Ajaran Aktif:
                </label>
                <input
                  type="text"
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  placeholder="Contoh: Tahun Ajaran 2026/2027"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Website / Portal Sekolah:
                </label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://avicenna.sch.id"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah:
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Jl. Raya Fatmawati, Cilandak, Jakarta Selatan"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nomor Telepon / Kontak Resmi:
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="021-75908899"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PEJABAT PENGESAH */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1">
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Pejabat Penandatangan Piagam &amp; Sertifikat 100%</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar:
                </label>
                <input
                  type="text"
                  required
                  value={form.principalName}
                  onChange={(e) =>
                    setForm({ ...form, principalName: e.target.value })
                  }
                  placeholder="Dr. Irwan Syahputra, M.Pd."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  NIP / NIY:
                </label>
                <input
                  type="text"
                  value={form.principalNip}
                  onChange={(e) =>
                    setForm({ ...form, principalNip: e.target.value })
                  }
                  placeholder="19780512 200212 1 003"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Jabatan Pengesah Resmi:
              </label>
              <input
                type="text"
                value={form.principalTitle}
                onChange={(e) =>
                  setForm({ ...form, principalTitle: e.target.value })
                }
                placeholder="Koordinator Avicenna Way & Kepala Lembaga"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Footer Save & Reset */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Kembalikan Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaved}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

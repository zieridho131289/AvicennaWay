import React, { useState } from 'react';
import { CheckCircle2, Lock, LogOut, Shield, ShieldAlert, Sparkles, X } from 'lucide-react';
import { googleSignIn, logoutGoogle } from '../services/firebaseAuth';
import { AdminSession } from '../types';

interface AdminLoginModalProps {
  adminSession: AdminSession;
  onLoginSuccess: (session: AdminSession) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  adminSession,
  onLoginSuccess,
  onLogout,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [adminNameInput, setAdminNameInput] = useState('Koordinator Avicenna Way');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        const session: AdminSession = {
          isLoggedIn: true,
          adminName: result.user.displayName || 'Admin Utama Google',
          adminEmail: result.user.email || 'admin@avicenna.sch.id',
          authMethod: 'google',
          loginTimestamp: new Date().toLocaleTimeString('id-ID'),
        };
        onLoginSuccess(session);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal login via Akun Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    // Standard secure pin / admin password
    if (pin.trim() === 'admin123' || pin.trim() === 'avicenna' || pin.trim() === '123456') {
      const session: AdminSession = {
        isLoggedIn: true,
        adminName: adminNameInput.trim() || 'Admin Utama Avicenna',
        adminEmail: 'admin.avicenna@sch.id',
        authMethod: 'pin',
        loginTimestamp: new Date().toLocaleTimeString('id-ID'),
      };
      onLoginSuccess(session);
      onClose();
    } else {
      setErrorMsg('Password / PIN Admin salah. (Gunakan kata sandi: admin123)');
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
    } catch (e) {
      // fallback
    }
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Login Admin Utama
              </h2>
              <p className="text-xs text-slate-500">
                Akses manajemen penuh Daily Log Avicenna Way
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
        <div className="p-6 space-y-5">
          {adminSession.isLoggedIn ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sedang Masuk sebagai Admin Utama</span>
                </div>
                <div className="text-xs text-slate-700">
                  Nama: <strong>{adminSession.adminName}</strong>
                </div>
                <div className="text-xs text-slate-700">
                  Email: <span className="font-mono text-slate-600">{adminSession.adminEmail}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Metode: {adminSession.authMethod === 'google' ? 'Google Workspace SSO' : 'PIN Kredensial'} · Waktu: {adminSession.loginTimestamp}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Anda memiliki hak akses untuk mengelola Nilai Utama Avicenna Way, mengedit 7 Habits, menghubungkan Google Spreadsheet, serta mengirim reminder massal.
              </p>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Sesi Admin</span>
              </button>
            </div>
          ) : (
            /* Not logged in: options */
            <div className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Official Google Sign-In Button */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Pilihan 1: Masuk dengan Akun Google (Rekomendasi untuk Sinkron Spreadsheet)
                </label>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs text-xs font-semibold text-slate-700 transition-all hover:border-slate-400 active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isGoogleLoading ? 'Menghubungkan Akun Google...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] text-slate-400 font-medium">atau gunakan PIN</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Password / PIN Login */}
              <form onSubmit={handlePinLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Admin Utama:
                  </label>
                  <input
                    type="text"
                    required
                    value={adminNameInput}
                    onChange={(e) => setAdminNameInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi / PIN Admin:
                  </label>
                  <input
                    type="password"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan admin123"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Default PIN: <code className="text-emerald-700 font-bold">admin123</code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Masuk sebagai Admin Utama</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

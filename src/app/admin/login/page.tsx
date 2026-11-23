'use client';

import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Mode Offline / Demo
    if (!isSupabaseConfigured()) {
      if (email.trim().toLowerCase() === 'admin@pasarlama.id' && password === 'admin123') {
        document.cookie = 'kuliner_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax';
        window.location.href = '/admin/dashboard';
        return;
      } else {
        setErrorMsg('Kredensial demo: admin@pasarlama.id / admin123 (atau konfigurasi Supabase di .env.local).');
        setIsLoading(false);
        return;
      }
    }

    try {
      // 1. Sign In via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(error.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        // 2. Set backup verified cookie agar middleware & server components langsung sinkron tanpa race condition
        document.cookie = 'kuliner_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax';

        // 3. Hard navigation untuk memuat sesi baru secara bersih
        window.location.href = '/admin/dashboard';
      } else {
        setErrorMsg('Sesi login tidak terbentuk. Pastikan akun email Anda sudah dikonfirmasi di Supabase.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kendala saat menghubungkan ke server autentikasi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF8F5] dark:bg-[#12100E] text-[#1C1917] dark:text-[#F5F5F4] transition-colors">
      <div className="w-full max-w-sm">
        
        {/* Brand Icon Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#D9531E] text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-[family-name:var(--font-heading)]">
            Admin Direktori Kuliner
          </h1>
          <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1">
            Portal Khusus Pengelola Pasar Lama Tangerang
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#1C1917] rounded-3xl border border-[#EAE5DC] dark:border-[#2C2623] p-6 shadow-sm">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                Email Pengelola
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pasarlama.id"
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E] transition min-h-[44px] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E] transition min-h-[44px] disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#D9531E] hover:bg-[#C04312] text-white flex items-center justify-center gap-2 transition min-h-[44px] shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {!isSupabaseConfigured() && (
            <div className="mt-4 pt-4 border-t border-[#EAE5DC] dark:border-[#2C2623] text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mode Offline: Gunakan admin@pasarlama.id / admin123</span>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-[#78716C] dark:text-[#A8A29E] hover:text-[#D9531E] transition"
          >
            &larr; Kembali ke Halaman Direktori Pengunjung
          </a>
        </div>

      </div>
    </div>
  );
}

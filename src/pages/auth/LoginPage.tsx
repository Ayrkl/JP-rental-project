import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Mail, Lock, ArrowRight, Building2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simüle edilmiş giriş akışı
    const role = email.includes('admin') ? 'admin' : 'tenant';
    login(
      {
        id: '12345',
        email,
        name: role === 'admin' ? 'Sistem Yöneticisi' : 'Test Kiracısı',
        role,
      },
      'mock_jwt_token_123'
    );

    // Role göre yönlendirme
    navigate(role === 'admin' ? '/admin' : '/tenant');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0a0a0a] overflow-hidden selection:bg-brand/30">
      {/* Background Gradients (Premium) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-3/4 right-0 w-[30rem] h-[30rem] bg-violet-600/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-md p-8 relative z-10 m-4">
        {/* Glassmorphism Card */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl" />
        
        <div className="relative">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner overflow-hidden p-2">
              <img src="/edusama_icon.webp" alt="Edusama Icon" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-white tracking-tight mb-2">
              Hoş Geldiniz
            </h1>
            <p className="text-white/60 font-light">
              Hesabınıza giriş yapmak için bilgilerinizi girin.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="E-posta adresiniz (admin@... admin girişi yapar)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors duration-300">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Şifreniz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 transition-colors" />
                <span className="text-sm font-light text-white/60">Beni hatırla</span>
              </label>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-light">
                Şifremi unuttum
              </a>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center items-center py-3.5 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all overflow-hidden"
            >
              <span>Giriş Yap</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm font-light">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-white hover:text-indigo-400 transition-colors font-medium">
                Hemen oluşturun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

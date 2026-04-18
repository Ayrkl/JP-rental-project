import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Mail, Lock, ArrowRight, Building2, UserCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tenant' | 'admin'>('tenant');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simüle edilmiş kayıt ve otomatik giriş
    login(
      {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
      },
      'mock_jwt_token_456'
    );

    navigate(role === 'admin' ? '/admin' : '/tenant');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0a0a0a] overflow-hidden selection:bg-brand/30">
      {/* Background Gradients (Premium) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[60%] w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[20%] right-[60%] w-[35rem] h-[35rem] bg-rose-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-md p-8 relative z-10 m-4 mt-12 mb-12">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl" />
        
        <div className="relative">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner overflow-hidden p-2">
              <img src="/edusama_icon.webp" alt="Edusama Icon" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-white tracking-tight mb-2">
              Kayıt Ol
            </h1>
            <p className="text-white/60 font-light">
              Yeni bir platform hesabı oluşturun.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors duration-300">
                  <UserCircle className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Adınız Soyadınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="E-posta adresiniz"
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
                  placeholder="Belirlediğiniz Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-4 mt-2">
              <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${role === 'tenant' ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <input type="radio" name="role" value="tenant" className="sr-only" checked={role === 'tenant'} onChange={() => setRole('tenant')} />
                <span className={`font-medium ${role === 'tenant' ? 'text-indigo-300' : 'text-white/60'}`}>Kiracı</span>
              </label>
              <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${role === 'admin' ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <input type="radio" name="role" value="admin" className="sr-only" checked={role === 'admin'} onChange={() => setRole('admin')} />
                <span className={`font-medium ${role === 'admin' ? 'text-indigo-300' : 'text-white/60'}`}>Yönetici</span>
              </label>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center items-center py-3.5 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all overflow-hidden"
            >
              <span>Hesap Oluştur</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm font-light">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-white hover:text-indigo-400 transition-colors font-medium">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

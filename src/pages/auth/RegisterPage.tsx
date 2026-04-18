import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe, Moon, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tenant' | 'admin'>('tenant');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="min-h-screen w-full flex bg-[#09090B] text-white">
      {/* Sol Panel: İllüstrasyon (Mobilde Gizli) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-center relative bg-[#18181A] px-12 py-10 border-r border-white/5">
        <div className="absolute top-10 left-12">
          <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-8 object-contain" />
        </div>

        <div className="w-full flex items-center justify-center mt-8">
          <img
            src="/edusama_login-Bit-zCiy.png"
            alt="Login Illustration"
            className="w-full max-w-[900px] object-contain drop-shadow-2xl scale-110"
          />
        </div>
      </div>

      {/* Sağ Panel: Form */}
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-center p-8 lg:p-16 xl:p-24 relative bg-black">
        {/* Sağ Üst İkonlar: Global (Dil) ve Temalar */}
        <div className="absolute top-10 right-10 flex items-center space-x-6 text-white/60">
          <button className="hover:text-white transition-colors">
            <Globe className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition-colors">
            <Moon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Alanı container */}
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center flex flex-col items-center">
            <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-16 mb-8 object-contain" />
            <h1 className="text-2xl font-semibold text-white w-full text-left tracking-tight mb-2">
              Kayıt Ol
            </h1>
            <p className="text-sm text-gray-400 w-full text-left font-light tracking-wide">
              Yeni bir hesap açarak platformumuza katılın
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* İsim Girişi */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-200">
                Adınız Soyadınız
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-[15px]"
              />
            </div>

            {/* Email Girişi */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-200">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-[15px]"
              />
            </div>

            {/* Şifre Girişi */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-200">
                Şifre
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-[15px] pr-12"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rol Seçimi */}
            <div className="flex gap-4 mt-6">
              <label className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg border cursor-pointer transition-all ${role === 'tenant' ? 'bg-white border-white text-black font-semibold' : 'bg-transparent border-gray-600 text-gray-400 font-medium hover:border-gray-400'}`}>
                <input type="radio" name="role" value="tenant" className="sr-only" checked={role === 'tenant'} onChange={() => setRole('tenant')} />
                <span>Kiracı</span>
              </label>
              <label className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg border cursor-pointer transition-all ${role === 'admin' ? 'bg-white border-white text-black font-semibold' : 'bg-transparent border-gray-600 text-gray-400 font-medium hover:border-gray-400'}`}>
                <input type="radio" name="role" value="admin" className="sr-only" checked={role === 'admin'} onChange={() => setRole('admin')} />
                <span>Yönetici</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/50 transition-all"
            >
              Hesap Oluştur
            </button>
          </form>

          <div className="mt-8 text-center px-4">
            <p className="text-[13px] text-gray-400">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-white font-medium hover:underline">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe, Moon, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
    navigate(role === 'admin' ? '/admin' : '/tenant');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090B] text-white">
      {/* Sol Panel: İllüstrasyon (Mobilde Gizli) */}
      <div className="hidden lg:flex lg:w-[%] xl:w-[50%] flex-col justify-center relative bg-[#18181A] px-12 py-10 border-r border-white/5">
        {/* Üstteki Logo (Opsiyonel / Resimle Uyumluluk İçin) */}
        <div className="absolute top-10 left-12">
          <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-8 object-contain" />
        </div>

        {/* Merkezdeki Büyük İllüstrasyon */}
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
          {/* Form Üstü Logonun ve Metinlerin Ortalanması */}
          <div className="mb-10 text-center flex flex-col items-center">
            <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-16 mb-8 object-contain" />
            <h1 className="text-2xl font-semibold text-white w-full text-left tracking-tight mb-2">
              Giriş Yap
            </h1>
            <p className="text-sm text-gray-400 w-full text-left font-light tracking-wide">
              Hesabınıza giriş yapmak için lütfen bilgilerinizi giriniz
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                autoComplete="email"
              />
            </div>

            {/* Şifre Girişi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-medium text-gray-200">
                  Şifre
                </label>
                <a href="#" className="text-[12px] text-gray-400 hover:text-white transition-colors">
                  Şifremi unuttum
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-[15px] pr-12"
                  autoComplete="current-password"
                />
                {/* Göz İkonu */}
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Giriş Yap Butonu */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/50 transition-all"
            >
              Giriş Yap
            </button>
          </form>

          {/* Sözleşme & Bilgilendirme */}
          <div className="mt-8 text-center px-4">
            <p className="text-[12px] leading-relaxed text-gray-500 font-light">
              Giriş yaparak, hizmet şartlarını ve <a href="#" className="underline hover:text-gray-300">gizlilik politikasını</a> kabul etmiş olursunuz.<br />
              Yardıma mı ihtiyacınız var? Rehberler ve SSS için <a href="#" className="underline hover:text-gray-300">Yardım Merkezi</a>'ne bakın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

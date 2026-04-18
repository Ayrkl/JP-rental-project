import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe, Moon, EyeOff, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="h-screen w-full flex bg-background text-foreground dark overflow-hidden">
      {/* Sol Panel: İllüstrasyon (Mobilde Gizli) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-center relative bg-zinc-950 px-12 py-10 border-r border-border/50">
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
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-center p-6 lg:p-10 xl:p-14 relative bg-[#09090b]">
        {/* Sağ Üst İkonlar: Global (Dil) ve Temalar */}
        <div className="absolute top-10 right-10 flex items-center space-x-4 text-muted-foreground">
          <button className="hover:text-foreground transition-colors">
            <Globe className="w-4 h-4" />
          </button>
          <button className="hover:text-foreground transition-colors">
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Form Alanı container */}
        <div className="w-full max-w-[380px] mx-auto">
          {/* Form Üstü Logonun ve Metinlerin Sola Yaslanması */}
          <div className="mb-8 w-full flex flex-col items-start">
            <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-[72px] mb-8 object-contain" />
            <h1 className="text-2xl font-semibold tracking-tight mb-2 text-zinc-100">
              Giriş Yap
            </h1>
            <p className="text-sm text-muted-foreground">
              Hesabınıza giriş yapmak için lütfen bilgilerinizi giriniz
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Girişi */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@sirket.com"
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                autoComplete="email"
              />
            </div>

            {/* Şifre Girişi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">Şifre</Label>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Şifremi unuttum
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700 pr-10"
                  autoComplete="current-password"
                />
                {/* Göz İkonu */}
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Giriş Yap Butonu */}
            <Button
              type="submit"
              className="w-full mt-6 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              Giriş Yap
            </Button>
            
            {/* Geçiş Linki */}
            <div className="mt-4 text-center">
              <span className="text-sm text-zinc-400">Hesabınız yok mu? </span>
              <Link to="/register" className="text-sm text-zinc-100 font-medium hover:underline transition-colors">
                Kayıt Ol
              </Link>
            </div>
          </form>

          {/* Sözleşme & Bilgilendirme */}
          <div className="mt-8 text-center px-2">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Giriş yaparak,{' '}
              <Link to="/terms" className="underline hover:text-foreground transition-colors">hizmet şartlarını</Link>
              {' '}ve <Link to="/privacy" className="underline hover:text-foreground transition-colors">gizlilik politikasını</Link> kabul etmiş olursunuz.<br />
              Yardıma mı ihtiyacınız var? Rehberler ve SSS için <a href="#" className="underline hover:text-foreground transition-colors">Yardım Merkezi</a>'ne bakın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { EyeOff, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { trpc } from '../../utils/trpc';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      // Backend'den dönen gerçek kullanıcı ve token verisi store'a yazılıyor
      loginStore(data.user as any, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/tenant');
    },
    onError: (error) => {
      // Hata zaten mutation nesnesindeki error state'inden okunacak, alert kaldırıldı.
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password, role: 'tenant' });
  };

  return (
    <div className="h-screen w-full flex bg-background text-foreground dark overflow-hidden">
      {/* Sol Panel: İllüstrasyon (Mobilde Gizli) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-center relative bg-zinc-950 px-12 py-10 border-r border-border/50">
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
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-center p-6 lg:p-10 xl:p-14 relative bg-[#09090b]">
        {/* Sağ Üst İkonlar: Global (Dil) ve Temalar */}
        <div className="absolute top-10 right-10 flex items-center space-x-4 z-50">
          <LanguageSwitcher />
        </div>

        {/* Form Alanı container */}
        <div className="w-full max-w-[380px] mx-auto z-10">
          <div className="mb-8 w-full flex flex-col items-start">
            <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-[72px] mb-8 object-contain" />
            <h1 className="text-2xl font-semibold tracking-tight mb-2 text-zinc-100">
              {t('register.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('register.subtitle')}
            </p>
          </div>

          {/* Hata Mesajı Alanı */}
          {registerMutation.error && (
            <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-medium animate-in fade-in zoom-in duration-200">
              {registerMutation.error.message.startsWith('[') 
                ? JSON.parse(registerMutation.error.message)[0].message 
                : registerMutation.error.message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* İsim Girişi */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">{t('register.nameLabel')}</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('register.namePlaceholder')}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
              />
            </div>

            {/* Email Girişi */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">{t('register.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('register.emailPlaceholder')}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
              />
            </div>

            {/* Şifre Girişi */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">{t('register.passwordLabel')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700 pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                   {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              disabled={registerMutation.isLoading}
            >
              {registerMutation.isLoading ? "..." : t('register.registerButton')}
            </Button>

            {/* Geçiş Linki */}
            <div className="mt-4 text-center">
              <span className="text-sm text-zinc-400">{t('register.hasAccount')} </span>
              <Link to="/login" className="text-sm text-zinc-100 font-medium hover:underline transition-colors">
                {t('register.loginLink')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

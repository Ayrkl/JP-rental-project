import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe, Moon, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

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
    <div className="min-h-screen w-full flex bg-background text-foreground dark">
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
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-center p-8 lg:p-16 xl:p-24 relative bg-[#09090b]">
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
          <div className="mb-8 w-full flex flex-col items-start">
            <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-[72px] mb-8 object-contain" />
            <h1 className="text-2xl font-semibold tracking-tight mb-2 text-zinc-100">
              Kayıt Ol
            </h1>
            <p className="text-sm text-muted-foreground">
              Yeni bir hesap açarak platformumuza katılın
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* İsim Girişi */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Adınız Soyadınız</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ali Yılmaz"
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
              />
            </div>

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
              />
            </div>

            {/* Şifre Girişi */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700 pr-10"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                   <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rol Seçimi */}
            <div className="flex gap-4 pt-2">
              <label className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md border cursor-pointer transition-all ${role === 'tenant' ? 'bg-zinc-100 border-zinc-100 text-zinc-900 font-medium' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                <input type="radio" name="role" value="tenant" className="sr-only" checked={role === 'tenant'} onChange={() => setRole('tenant')} />
                <span className="text-sm">Kiracı</span>
              </label>
              <label className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md border cursor-pointer transition-all ${role === 'admin' ? 'bg-zinc-100 border-zinc-100 text-zinc-900 font-medium' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                <input type="radio" name="role" value="admin" className="sr-only" checked={role === 'admin'} onChange={() => setRole('admin')} />
                <span className="text-sm">Yönetici</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              Hesap Oluştur
            </Button>
          </form>

          <div className="mt-8 text-center px-4">
             <p className="text-xs text-muted-foreground">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-zinc-200 font-medium hover:underline">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

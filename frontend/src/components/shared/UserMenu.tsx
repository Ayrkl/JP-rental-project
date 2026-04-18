"use client"

import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, ShieldCheck } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';

export const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Kullanıcı isminin baş harflerini al
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400 cursor-pointer hover:bg-indigo-500/20 transition-colors">
          {initials}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-zinc-100">{user.name}</span>
          <span className="text-[11px] font-normal text-zinc-500 lowercase">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="gap-2">
          <User size={14} className="text-zinc-500" />
          Profil Ayarları
        </DropdownMenuItem>
        
        {user.role === 'admin' && (
          <DropdownMenuItem className="gap-2">
            <ShieldCheck size={14} className="text-zinc-500" />
            Sistem Paneli
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem className="gap-2">
          <Settings size={14} className="text-zinc-500" />
          Genel Ayarlar
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="gap-2 text-red-400 focus:text-red-400 focus:bg-red-400/10"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

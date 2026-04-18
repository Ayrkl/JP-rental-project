import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { NotificationSheet } from '@/components/shared/NotificationSheet';
import { UserMenu } from '@/components/shared/UserMenu';
import { useTranslation } from 'react-i18next';

export const PortalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t: tRaw } = useTranslation('navigation');
  const t = tRaw as unknown as (key: string) => string;

  const navItems = [
    { path: '/portal', label: t('listings'), exact: true },
    { path: '/portal/map', label: t('mapSearch') },
    { path: '/portal/apply', label: t('apply') },
  ];

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const currentLabel = navItems.find(i => isActive(i.path, i.exact))?.label ?? 'İlan Portalı';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground dark flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#1e1e1e] bg-[#0a0a0a] h-[72px] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-[36px] h-[36px] bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/edusama_icon.webp" alt="Edusama" className="w-full h-full object-contain" />
            </div>
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2.5 text-[14px] font-medium text-zinc-400 ml-2">
              <Home size={16} />
              <ChevronRight size={14} className="opacity-40" />
              <span className="text-zinc-100">{currentLabel}</span>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-[#2a2a2a]" />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-[13.5px] transition-all duration-200 ${
                    active
                      ? 'bg-[#1e1e1e] text-zinc-100 font-medium'
                      : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NotificationSheet />
          <LanguageSwitcher />
          <div className="h-6 w-px bg-[#1e1e1e] mx-1" />
          <UserMenu />
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

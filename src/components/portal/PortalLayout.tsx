import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground dark flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#2a1f00] bg-[#0d0900] h-[64px] flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/edusama_icon.webp" alt="Edusama" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-amber-100 text-sm">İlan Portalı</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-amber-900/30 text-amber-300 font-medium'
                      : 'text-amber-700 hover:bg-amber-900/20 hover:text-amber-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-600 hover:text-amber-300 hover:bg-amber-900/20 gap-1.5"
            onClick={() => navigate('/select')}
          >
            <ArrowLeft size={15} />
            <span className="text-xs hidden sm:inline">{t('backToSelect')}</span>
          </Button>
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

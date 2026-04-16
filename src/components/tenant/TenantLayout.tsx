import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, FileText, Bell, PanelLeft, Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const TenantLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t: tRaw } = useTranslation('navigation');
  const t = tRaw as unknown as (key: string) => string;

  const navItems = [
    { path: '/tenant', icon: <LayoutDashboard size={18} />, label: t('tenantHome'), exact: true },
    { path: '/tenant/payments', icon: <CreditCard size={18} />, label: t('payments') },
    { path: '/tenant/documents', icon: <FileText size={18} />, label: t('myDocuments') },
    { path: '/tenant/notices', icon: <Bell size={18} />, label: t('notices') },
  ];

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div
      className="flex min-h-screen bg-background text-foreground dark"
      style={{ '--sidebar-width': collapsed ? '80px' : '230px' } as React.CSSProperties}
    >
      {/* SIDEBAR */}
      <aside
        className={`${collapsed ? 'w-20' : 'w-[220px]'} flex-shrink-0 border-r border-[#1a2e1a] bg-[#0d1a0d] transition-all duration-300 flex flex-col z-[60] relative`}
      >
        {/* Logo */}
        <div className="h-[50px] flex items-center px-3 pt-2">
          {!collapsed ? (
            <div className="flex items-center gap-2 w-full">
              <div className="w-[36px] h-[36px] bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                <img src="/edusama_icon.webp" alt="Edusama" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14px] truncate text-emerald-100">Edusama Rental</span>
                <span className="text-[11px] text-emerald-600 truncate">Kiracı Paneli</span>
              </div>
            </div>
          ) : (
            <div className="w-[38px] h-[38px] mx-auto bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/edusama_icon.webp" alt="Edusama" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 mt-4">
          <nav className="space-y-1 px-3 pb-8">
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-emerald-900/40 text-emerald-300 font-medium'
                      : 'text-emerald-700 hover:bg-emerald-900/20 hover:text-emerald-400'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="shrink-0 opacity-80">{item.icon}</div>
                  {!collapsed && <span className="text-[13.5px] tracking-tight">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        <header className="h-[72px] border-b border-[#1a2e1a] bg-[#0a0a0a] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex h-9 w-9 bg-[#0d1a0d] border-[#1a2e1a] text-emerald-600 hover:text-emerald-300 hover:bg-emerald-900/20 rounded-lg"
              onClick={() => setCollapsed(!collapsed)}
            >
              <PanelLeft size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-emerald-600"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20} />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 hover:text-emerald-300 hover:bg-emerald-900/20 gap-1.5"
              onClick={() => navigate('/select')}
            >
              <ArrowLeft size={15} />
              {!collapsed && <span className="text-xs">{t('backToSelect')}</span>}
            </Button>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-xs text-emerald-400 cursor-pointer">
              KR
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

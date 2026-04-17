import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Home, Users, FileText,
  ChevronRight, Menu, Search,
  Megaphone, PanelLeft, Map, FolderOpen, BarChart3, ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { NotificationSheet } from '@/components/shared/NotificationSheet';
import { useTranslation } from 'react-i18next';

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t: tRaw } = useTranslation('navigation');
  const t = tRaw as unknown as (key: string) => string;

  const navCategories = [
    {
      title: null,
      items: [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
        { path: '/admin/properties/new', icon: <Home size={18} />, label: t('properties') },
        { path: '/admin/map', icon: <Map size={18} />, label: t('map') },
        { path: '/admin/contracts', icon: <FileText size={18} />, label: t('contracts') },
      ]
    },
    {
      title: t('management'),
      items: [
        { path: '/admin/users',     icon: <Users size={18} />,      label: t('users') },
        { path: '/admin/documents', icon: <FolderOpen size={18} />, label: t('documents') },
        { path: '/admin/accounting',    icon: <BarChart3 size={18} />,      label: 'Muhasebe' },
        { path: '/admin/applications',  icon: <ClipboardList size={18} />,  label: 'Başvurular' },
        { path: '#',                icon: <Megaphone size={18} />,  label: t('announcements') },
      ]
    }
  ];

  const currentPageLabel = navCategories.flatMap(c => c.items).find(item =>
    location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path.replace('#', 'NO_MATCH')))
  )?.label || t('centerManagement');

  return (
    <div className="flex min-h-screen bg-background text-foreground dark" style={{ '--sidebar-width': collapsed ? '80px' : '230px' } as React.CSSProperties}>
      {/* SIDEBAR */}
      <aside className={`${collapsed ? 'w-20' : 'w-[220px]'} flex-shrink-0 border-r border-[#1e1e1e] bg-[#121212] transition-all duration-300 flex flex-col z-[60] relative`}>
        {/* Header / Logo Zone */}
        <div className="h-[50px] flex items-center px-3 pt-2">
          {!collapsed ? (
            <div className="flex items-center gap-2 w-full">
              <div className="w-[36px] h-[36px] bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-[0px]">
                <img src="/edusama_icon.webp" alt="Edusama Icon" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14.5px] truncate text-zinc-100">Edusama Rental</span>
                <span className="text-[11.5px] text-zinc-400 truncate">It Super Admin</span>
              </div>
            </div>
          ) : (
            <div className="w-[38px] h-[38px] mx-auto bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden p-[5px]">
              <img src="/edusama_icon.webp" alt="Edusama Icon" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 mt-1 mb-3">
            <div className="relative group">
              <Search className="absolute left-2.5 top-[9px] h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <input
                type="text"
                placeholder={t('search')}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-7 pr-10 py-1.5 text-[12px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
              />
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <nav className="space-y-6 px-3 pb-8">
            {navCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                {!collapsed && cat.title && (
                  <div className="px-3 mb-1.5 mt-2 text-[11px] font-semibold text-zinc-500/80 capitalize tracking-wide">
                    {cat.title}
                  </div>
                )}
                {cat.items.map(item => {
                  const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-[#1e1e1e] text-zinc-100 font-medium'
                        : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-zinc-200'
                        } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="shrink-0 opacity-80">
                        {item.icon}
                      </div>
                      {!collapsed && <span className="text-[13.5px] tracking-tight">{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        {/* Header Navbar */}
        <header className="h-[72px] border-b border-[#1e1e1e] bg-[#0a0a0a] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex h-9 w-9 bg-[#121212] border-[#2a2a2a] text-zinc-400 hover:text-white hover:bg-[#1e1e1e] transition-colors rounded-lg"
              onClick={() => setCollapsed(!collapsed)}
            >
              <PanelLeft size={18} />
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden text-zinc-400" onClick={() => setCollapsed(!collapsed)}>
              <Menu size={20} />
            </Button>

            {/* SEPARATOR */}
            <div className="hidden md:block h-6 w-px bg-[#2a2a2a]"></div>

            {/* BREADCRUMB */}
            <div className="flex items-center gap-2.5 text-[14px] font-medium text-zinc-400">
              <Home size={16} className="text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors" />
              <ChevronRight size={14} className="opacity-40" />
              <span className="text-zinc-100">{currentPageLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationSheet />
            <LanguageSwitcher />
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400 cursor-pointer">
              AD
            </div>
          </div>
        </header>

        {/* Router Outlet for Dashboard / Property Form */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

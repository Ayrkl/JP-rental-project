import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Home, Users, FileText, Settings, Bell,
  ChevronLeft, ChevronRight, Menu, Search, Command,
  BookOpen, Video, Megaphone, Box, Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // The user wanted the sidebar to look like Edusama UI.
  const navCategories = [
    {
      title: null,
      items: [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Panoya Dön' },
        { path: '/admin/properties/new', icon: <Home size={18} />, label: 'Mülk Yönetimi' },
        { path: '#', icon: <FileText size={18} />, label: 'Sözleşmeler' },
      ]
    },
    {
      title: 'Yönetim',
      items: [
        { path: '#', icon: <Users size={18} />, label: 'Kullanıcılar ve Roller' },
        { path: '#', icon: <Megaphone size={18} />, label: 'Duyurular' },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground dark">
      {/* SIDEBAR */}
      <aside className={`${collapsed ? 'w-20' : 'w-[260px]'} flex-shrink-0 border-r border-[#1e1e1e] bg-[#121212] transition-all duration-300 flex flex-col z-20 relative`}>
        {/* Header / Logo Zone */}
        <div className="h-[72px] flex items-center px-4 pt-2">
          {!collapsed ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-[38px] h-[38px] bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-[5px]">
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

        <Button
          variant="outline" size="icon"
          className="absolute -right-3 top-[26px] rounded-full h-6 w-6 z-50 bg-[#121212] border-[#2a2a2a] text-zinc-400 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </Button>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 mt-1 mb-3">
            <div className="relative group">
              <Search className="absolute left-2.5 top-[9px] h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <input
                type="text"
                placeholder="Ara..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-8 pr-10 py-1.5 text-[13.5px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
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
        <header className="h-[72px] border-b border-[#1e1e1e] bg-[#0a0a0a] flex items-center justify-between px-8">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2 text-zinc-400" onClick={() => setCollapsed(!collapsed)}>
              <Menu size={20} />
            </Button>
            <h2 className="text-[15px] font-medium text-zinc-300 tracking-tight">Merkez Yönetim</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400 cursor-pointer">
              AD
            </div>
          </div>
        </header>

        {/* Router Outlet for Dashboard / Property Form */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

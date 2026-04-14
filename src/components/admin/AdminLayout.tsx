import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LayoutDashboard, Home, Users, FileText, Settings, Bell, ChevronDown, AlignLeft } from 'lucide-react';
import './AdminLayout.css';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-container dark-theme">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-glass">
             <div className="logo-orb"></div>
             {!collapsed && <span className="logo-text">JP Rental</span>}
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
             <AlignLeft size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            {!collapsed && <span>Dashboard</span>}
          </a>
          <a href="#" className="nav-item">
            <Home size={20} />
            {!collapsed && <span>Mülkler</span>}
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            {!collapsed && <span>Kiracılar</span>}
          </a>
          <a href="#" className="nav-item">
            <FileText size={20} />
            {!collapsed && <span>Sözleşmeler</span>}
          </a>
          <div className="nav-divider"></div>
          <a href="#" className="nav-item">
            <Settings size={20} />
            {!collapsed && <span>Ayarlar</span>}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar glass-effect">
           <div className="topbar-search">
              <input type="text" placeholder="Mülk veya kiracı ara..." className="search-input" />
           </div>
           
           <div className="topbar-actions">
              <button className="icon-btn">
                 <Bell size={20} />
                 <span className="badge">3</span>
              </button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="user-profile-btn">
                     <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="avatar" />
                     <div className="user-info">
                       <span className="user-name">Mülk Yöneticisi</span>
                       <span className="user-role">Super Admin</span>
                     </div>
                     <ChevronDown size={16} />
                  </button>
                </DropdownMenu.Trigger>
                
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="dropdown-glass" sideOffset={8}>
                    <DropdownMenu.Item className="dropdown-item">Profilim</DropdownMenu.Item>
                    <DropdownMenu.Item className="dropdown-item">Hesap Ayarları</DropdownMenu.Item>
                    <DropdownMenu.Separator className="dropdown-separator" />
                    <DropdownMenu.Item className="dropdown-item danger">Çıkış Yap</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
           </div>
        </header>

        {/* Page Content */}
        <div className="admin-content-area">
           {children}
        </div>
      </main>
    </div>
  );
};

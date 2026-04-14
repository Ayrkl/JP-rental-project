import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, Users, FileText, Settings, Bell, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/properties/new', icon: <Home size={20} />, label: 'Mülk Yönetimi' },
        { path: '#', icon: <Users size={20} />, label: 'Kiracılar' },
        { path: '#', icon: <FileText size={20} />, label: 'Sözleşmeler' },
        { path: '#', icon: <Settings size={20} />, label: 'Ayarlar' },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground dark">
            {/* SIDEBAR */}
            <aside className={`${collapsed ? 'w-20' : 'w-72'} flex-shrink-0 border-r border-border bg-card transition-all duration-300 flex flex-col z-20 relative`}>
                <div className="h-16 flex items-center px-4 border-b border-border text-card-foreground">
                    {!collapsed && <div className="font-bold text-xl flex items-center gap-2 tracking-tight">JP <span className="text-primary">Rental</span></div>}
                    {collapsed && <div className="font-bold text-xl mx-auto text-primary">JP</div>}
                </div>
                
                <Button 
                    variant="outline" size="icon"
                    className="absolute -right-4 top-4 rounded-full h-8 w-8 z-50 bg-background"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14} />}
                </Button>

                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-2 px-3">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <Link key={item.label} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground font-medium'} ${collapsed ? 'justify-center' : ''}`}>
                                    {item.icon}
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </Link>
                            )
                        })}
                    </nav>
                </ScrollArea>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Navbar */}
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="md:hidden mr-2">
                           <Menu size={20} />
                        </Button>
                        <h2 className="text-lg font-semibold tracking-tight">Admin Console</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="relative rounded-full">
                           <Bell size={18} className="text-muted-foreground" />
                           <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary ring-1 ring-border cursor-pointer">
                            AD
                        </div>
                    </div>
                </header>
                
                {/* Router Outlet for Dashboard / Property Form */}
                <main className="flex-1 overflow-auto bg-muted/40 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, Globe } from 'lucide-react';

const cards = [
  {
    icon: LayoutDashboard,
    title: 'Admin Paneli',
    subtitle: 'Mülk yöneticisi / ev sahibi arayüzü',
    badges: ['Mülk Yönetimi', 'Raporlama', 'Muhasebe'],
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.3)',
    glow: 'rgba(99,102,241,0.4)',
    badgeColor: 'rgba(99,102,241,0.15)',
    badgeText: '#a5b4fc',
    path: '/admin',
  },
  {
    icon: Home,
    title: 'Kiracı Paneli',
    subtitle: 'Kiracı self-servis arayüzü',
    badges: ['Ödeme Takibi', 'Borç Görüntüleme', 'Bildirimler'],
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    glow: 'rgba(16,185,129,0.4)',
    badgeColor: 'rgba(16,185,129,0.15)',
    badgeText: '#6ee7b7',
    path: '/tenant',
  },
  {
    icon: Globe,
    title: 'İlan Portalı',
    subtitle: 'Halka açık ev kiralama arayüzü',
    badges: ['Filtreleme', 'Harita Arama', 'Ön Başvuru'],
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    glow: 'rgba(245,158,11,0.4)',
    badgeColor: 'rgba(245,158,11,0.15)',
    badgeText: '#fcd34d',
    path: '/portal',
  },
];

export const RoleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Logo + Başlık */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden mb-4">
          <img src="/edusama_icon.webp" alt="Edusama" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edusama Rental</h1>
        <p className="text-zinc-500 text-sm mt-1">Panel seçimi yaparak devam edin</p>
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.03] focus:outline-none"
              style={{
                backgroundColor: card.bg,
                border: `1px solid ${card.border}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${card.glow}`;
                (e.currentTarget as HTMLElement).style.borderColor = card.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = card.border;
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <Icon size={24} style={{ color: card.color }} />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">{card.title}</h2>
              <p className="text-zinc-400 text-sm mb-4">{card.subtitle}</p>
              <div className="flex flex-wrap gap-2">
                {card.badges.map((badge) => (
                  <span
                    key={badge}
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: card.badgeColor, color: card.badgeText }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-zinc-600 text-xs">
        Geliştirme modu — kimlik doğrulaması devre dışı
      </p>
    </div>
  );
};

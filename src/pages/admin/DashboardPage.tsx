import React from 'react';
import { ArrowUpRight, ArrowDownRight, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
    return (
        <div className="fade-in">
            <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Genel Durum Özeti</h2>
                    <p>Güncel işletme, tahsilat ve mülk istatistikleri</p>
                </div>
                <Link to="/admin/properties/new" className="btn-save" style={{ textDecoration: 'none' }}>
                    + Yeni Mülk Ekle
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '24px', background: 'rgba(25,28,41,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Toplam Mülk</p>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>142</h3>
                    <p style={{ color: '#4ade80', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                        <ArrowUpRight size={14}/> +3 (Bu ay)
                    </p>
                </div>
                
                <div style={{ padding: '24px', background: 'rgba(25,28,41,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Boş Mülkler</p>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>12</h3>
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                        <ArrowDownRight size={14}/> Kritik seviye
                    </p>
                </div>
                
                <div style={{ padding: '24px', background: 'rgba(25,28,41,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Aktif Kiracılar</p>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>128</h3>
                    <p style={{ color: '#4ade80', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                        <ArrowUpRight size={14}/> %98 Doluluk
                    </p>
                </div>
                
                <div style={{ padding: '24px', background: 'rgba(25,28,41,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Tahsilat Durumu</p>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>%94</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                        ¥12.4M tahsil edildi
                    </p>
                </div>
            </div>

            <div className="empty-state-glass" style={{ padding: '40px' }}>
                <Map size={48} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
                <h3>Japonya Haritası ve Pinler</h3>
                <p>Yakında buraya prefectural (eyalet) bazlı doluluk oranlarını gösteren Japonya interaktif haritası entegre edilecek.</p>
            </div>
        </div>
    );
};

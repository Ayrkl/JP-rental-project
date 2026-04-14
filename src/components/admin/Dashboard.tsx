import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Map, Home, Building2, Calendar, MapPin, Pencil, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { usePropertyStore } from '../../store/usePropertyStore';
import { PropertyForm } from './PropertyForm';

export const Dashboard = () => {
    const properties = usePropertyStore(state => state.properties);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

    return (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '16px', color: 'var(--accent-primary)' }}>
                            <Home size={24} />
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <ArrowUpRight size={16} /> 0%
                        </span>
                    </div>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--text-main)' }}>{properties.length}</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Toplam Mülk</p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '16px', color: '#10b981' }}>
                            <Building2 size={24} />
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <ArrowUpRight size={16} /> 0%
                        </span>
                    </div>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--text-main)' }}>0</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Aktif Kiracı</p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '16px', color: '#ef4444' }}>
                            <Calendar size={24} />
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <ArrowDownRight size={16} /> 0%
                        </span>
                    </div>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--text-main)' }}>0</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Boşta Ev</p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Map size={32} style={{ margin: '0 auto 12px' }} opacity={0.5} />
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>Harita Modülü<br/>Hazırlanıyor</p>
                    </div>
                </div>
            </div>

            <div>
                 <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     Son Eklenen Mülkler
                 </h2>
                 {properties.length === 0 ? (
                     <div className="empty-state-glass">
                         <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '50%', marginBottom: '16px' }}>
                             <Home size={32} color="var(--text-muted)" />
                         </div>
                         <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>Sistemde Mülk Yok</h3>
                         <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Henüz portföye bir mülk eklenmemiş. Hemen sağ üstteki butondan yeni mülk yaratabilirsiniz.</p>
                         <Link to="/admin/properties/new" className="btn-save" style={{ textDecoration: 'none', display: 'inline-block' }}>
                             Yeni Mülk Tanımla
                         </Link>
                     </div>
                 ) : (
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                         {properties.map(p => (
                             <div 
                               key={p.id} 
                               className="property-card"
                               style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', cursor: 'pointer' }}
                               onClick={() => setSelectedPropertyId(p.id)}
                             >
                                 <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                                     {p.images && p.images.length > 0 ? (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img src={p.images[0]} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                     ) : (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px dashed var(--border-glass)' }}>
                                            <Home size={24} color="var(--text-muted)" />
                                        </div>
                                     )}

                                     <div>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                             <Building2 size={18} color="var(--accent-primary)" />
                                             <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Mülk #{p.id.toUpperCase()}</h4>
                                         </div>
                                         <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                             <MapPin size={14} color="var(--text-muted)"/> {p.address}
                                         </p>
                                         <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                             <Calendar size={14} /> Yapım: {p.buildYear} • Net: {p.area}m² {p.images && p.images.length > 1 && `• +${p.images.length - 1} Fotoğraf`}
                                         </p>
                                     </div>
                                 </div>
                                 
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                     <div style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', padding: '10px 20px', borderRadius: '30px', fontWeight: '800', border: '1px solid rgba(99,102,241,0.3)', fontSize: '1.1rem' }}>
                                         {p.roomType}
                                     </div>
                                     <div onClick={(e) => { e.stopPropagation(); setSelectedPropertyId(p.id); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)', cursor: 'pointer' }}>
                                         <Pencil size={18} />
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
            </div>

            <Dialog.Root open={!!selectedPropertyId} onOpenChange={(open) => !open && setSelectedPropertyId(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay" />
                    <Dialog.Content className="dialog-content">
                        <Dialog.Close asChild>
                            <button className="dialog-close" aria-label="Kapat"><X size={18} /></button>
                        </Dialog.Close>
                        <PropertyForm propertyId={selectedPropertyId || undefined} onComplete={() => setSelectedPropertyId(null)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
};

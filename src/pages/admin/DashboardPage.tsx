import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Map, Home, Building2, Calendar, MapPin, Pencil, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { usePropertyStore } from '../../store/usePropertyStore';
import { PropertyForm } from '../../components/admin/PropertyForm';

export const DashboardPage = () => {
    // Zustand'dan global verilerimizi Canlı Dinliyoruz
    const properties = usePropertyStore(state => state.properties);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

    return (
        <div className="fade-in">
            <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Genel Durum Özeti</h2>
                    <p>Mülk Ekleme formundan "Zustand Global Store"a kaydettiğiniz güncel değerler paneli.</p>
                </div>
                <Link to="/admin/properties/new" className="btn-save" style={{ textDecoration: 'none' }}>
                    + Yeni Mülk Ekle
                </Link>
            </div>

            {/* Dinamik İlk Satır Skorları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '24px', background: 'rgba(25,28,41,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Sistemdeki Evler (Canlı)</p>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--accent-primary)' }}>{properties.length}</h3>
                    <p style={{ color: '#4ade80', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                        Zustand Global Store Aktif
                    </p>
                </div>
                
                <div style={{ padding: '24px', background: 'rgba(25,28,41,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Toplam Görünen Alan</p>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>{properties.reduce((acc, p) => acc + p.area, 0)} m²</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                        Kayıtlı evlerin toplamı
                    </p>
                </div>
                
                <div style={{ padding: '24px', background: 'rgba(25,28,41,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>1LDK Sayısı</p>
                    <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>{properties.filter(p => p.roomType === '1LDK').length}</h3>
                    <p style={{ color: '#4ade80', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                        Şehirdeki popüler plan
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

            {/* FRONTEND VERİLERİNİN DÖKÜLECEĞİ DİNAMİK ALAN */}
            <div style={{ marginTop: '40px' }}>
                 <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Portföyünüz: Eklenen Tüm Mülkler</h3>
                 
                 {properties.length === 0 ? (
                     <div className="empty-state-glass" style={{ padding: '40px' }}>
                        <Home size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                        <h3>Henüz hiç mülk eklenmedi</h3>
                        <p>Sağ üstten veya sol menüden "+ Yeni Mülk Ekle" diyerek ilk varlığınızı ekleyin.<br/>Eklediğiniz anda veriler veritabanı gibi buraya düşecek.</p>
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
                                     {/* Fotoğraf Thumbnail (Küçük Resim) Alanı */}
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

            {/* RADIX MODAL (POPUP) DÜZENLEME EKRANI */}
            <Dialog.Root open={!!selectedPropertyId} onOpenChange={(open) => !open && setSelectedPropertyId(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay" />
                    <Dialog.Content className="dialog-content">
                        <Dialog.Close asChild>
                            <button className="dialog-close" aria-label="Kapat"><X size={18} /></button>
                        </Dialog.Close>
                        {/* Popup içerisinde Düzenleme Formu Çağırılır */}
                        <PropertyForm propertyId={selectedPropertyId || undefined} onComplete={() => setSelectedPropertyId(null)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
};

import { useState, useEffect, useMemo } from 'react';
import { Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud, Layout, Trash2 } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { usePropertyStore, type InventoryItem } from '../../store/usePropertyStore';
import { useNavigate, useParams } from 'react-router-dom';

export const PropertyForm = ({ propertyId, onComplete }: { propertyId?: string; onComplete?: () => void }) => {
    const { addProperty, updateProperty, properties } = usePropertyStore();
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const id = propertyId || routeId;

    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [buildYear, setBuildYear] = useState('');
    const [quakeStandard, setQuakeStandard] = useState('new');
    const [rooms, setRooms] = useState<{ id: string; type: 'Room' | 'Living' | 'Dining' | 'Kitchen' }[]>([]);
    const [images, setImages] = useState<string[]>([]);
    
    // YENİ: Mimariye Göre İmkanlar ve Demirbaşlar
    const [features, setFeatures] = useState<string[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (id) {
            const existingProp = properties.find(p => p.id === id);
            if (existingProp) {
                setAddress(existingProp.address);
                setArea(existingProp.area.toString());
                setBuildYear(existingProp.buildYear.toString());
                setQuakeStandard(existingProp.quakeStandard);
                setRooms(existingProp.rooms);
                setImages(existingProp.images || []);
                setFeatures(existingProp.features || []);
                setInventory(existingProp.inventory || []);
            }
        }
    }, [id, properties]);

    // Resim Yönetimi
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Oda Yönetimi
    const addRoom = (type: 'Room' | 'Living' | 'Dining' | 'Kitchen') => {
        setRooms([...rooms, { id: Math.random().toString(36).substr(2, 9), type }]);
    };

    // Imkanlar & Özellikler Yönetimi (Toggle Switch)
    const toggleFeature = (featId: string) => {
        setFeatures(prev => prev.includes(featId) ? prev.filter(f => f !== featId) : [...prev, featId]);
    };

    // Demirbaş (Envanter) Yönetimi
    const addInventoryItem = () => {
        setInventory([...inventory, { id: Math.random().toString(), name: '', brandModel: '', condition: 'Yeni' }]);
    };
    const updateInventoryItem = (itemId: string, field: keyof InventoryItem, value: string) => {
        setInventory(inventory.map(item => item.id === itemId ? { ...item, [field]: value } : item));
    };
    const removeInventoryItem = (itemId: string) => {
        setInventory(inventory.filter(item => item.id !== itemId));
    };

    const layoutString = useMemo(() => {
        const roomCount = rooms.filter(r => r.type === 'Room').length;
        const hasL = rooms.some(r => r.type === 'Living');
        const hasD = rooms.some(r => r.type === 'Dining');
        const hasK = rooms.some(r => r.type === 'Kitchen');
        
        let prefix = roomCount > 0 ? roomCount.toString() : (rooms.length > 0 ? '0' : '1');
        let suffix = `${hasL?'L':''}${hasD?'D':''}${hasK?'K':''}`;
        return prefix === '0' ? suffix : (prefix === '1' && suffix === '' ? '1R' : prefix + suffix);
    }, [rooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            address,
            area: Number(area),
            buildYear: Number(buildYear),
            quakeStandard,
            rooms, 
            roomType: layoutString,
            images,
            features,
            inventory
        };

        if (id) updateProperty(id, payload);
        else addProperty(payload);

        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            if (onComplete) onComplete();
            else navigate('/admin');
        }, 1200);
    };

    return (
        <div className="property-form-container glass-effect fade-in">
            <div className="form-header">
                <h2>{id ? 'Mülkü Düzenle (Edit)' : 'Yeni Mülk Tanımlama'}</h2>
                <p>Eşya envanteri dahil tüm mülk detaylarını ve sözleşme öncesi altyapısını kurun.</p>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    
                    <div className="input-group full-width">
                        <label><MapPin size={16}/> Açık Adres (住所)</label>
                        <input type="text" placeholder="Örn: Tokyo-to, Shibuya-ku..." value={address} onChange={e => setAddress(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label><Ruler size={16}/> Net Alan (m²)</label>
                        <input type="number" placeholder="Örn: 45" value={area} onChange={e => e.target.value !== '0' && setArea(e.target.value)} min="1" step="any" required />
                    </div>

                    <div className="input-group">
                        <label><Calendar size={16}/> Yapım Yılı</label>
                        <input type="number" placeholder="Örn: 2018" min="1950" max="2026" value={buildYear} onChange={e => (!e.target.value.startsWith('0') && e.target.value !== '0') && setBuildYear(e.target.value)} required />
                    </div>

                    <div className="input-group full-width">
                        <label><ShieldCheck size={16}/> Deprem Sertifikası (耐震基準)</label>
                        <div className="custom-select-wrapper">
                            <select value={quakeStandard} onChange={e => setQuakeStandard(e.target.value)}>
                                <option value="old">Eski Standart (旧耐震 - 1981 Öncesi)</option>
                                <option value="new">Yeni Standart (新耐震 - 1981 Sonrası)</option>
                                <option value="grade2">Grade 2 (耐震等級2)</option>
                                <option value="grade3">Grade 3 (耐震等級3 - Üst Düzen)</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group full-width" style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <label style={{ margin: 0 }}><Layout size={16}/> Dinamik Oda & Plan Oluşturucu</label>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>
                                Plan: {layoutString}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            <button type="button" onClick={() => addRoom('Room')} className="secondary-btn" style={{ borderColor: 'rgba(99,102,241,0.5)' }}>+ Yatak Odası (R)</button>
                            <button type="button" onClick={() => addRoom('Living')} className="secondary-btn" style={{ borderColor: 'rgba(168,85,247,0.5)' }}>+ Salon (L)</button>
                            <button type="button" onClick={() => addRoom('Dining')} className="secondary-btn" style={{ borderColor: 'rgba(236,72,153,0.5)' }}>+ Yemek Alanı (D)</button>
                            <button type="button" onClick={() => addRoom('Kitchen')} className="secondary-btn" style={{ borderColor: 'rgba(234,179,8,0.5)' }}>+ Mutfak (K)</button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '34px' }}>
                            {rooms.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Oda seçilmedi.</span>}
                            {rooms.map(room => (
                                <div key={room.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{room.type === 'Room' ? '🛏️ Yatak Odası' : room.type === 'Living' ? '🛋️ Salon (L)' : room.type === 'Dining' ? '🍽️ Yemek (D)' : '🍳 Mutfak (K)'}</span>
                                    <button type="button" onClick={() => setRooms(rooms.filter(r => r.id !== room.id))} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FİZİKSEL ÖZELLİKLER (Radix Switch) */}
                    <div className="input-group full-width" style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '1.05rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginBottom: '16px' }}>Mülk İmkanları (Fiziksel)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {[
                                { id: 'internet', label: 'Fiber İnternet (Dahil)' },
                                { id: 'elevator', label: 'Asansör' },
                                { id: 'autolock', label: 'Akıllı/Otomatik Kilit' },
                                { id: 'parking', label: 'Otopark Alanı' },
                                { id: 'pets', label: 'Evcil Hayvan İzni' },
                                { id: 'balcony', label: 'Balkon' },
                            ].map(feat => (
                                <div key={feat.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Switch.Root className="SwitchRoot" checked={features.includes(feat.id)} onCheckedChange={() => toggleFeature(feat.id)}>
                                        <Switch.Thumb className="SwitchThumb" />
                                    </Switch.Root>
                                    <span style={{ fontSize: '0.9rem', color: features.includes(feat.id) ? 'white' : 'var(--text-muted)' }}>{feat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DEMİRBAŞ & ENVANTER LİSTESİ */}
                    <div className="input-group full-width" style={{ marginTop: '8px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <label style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)' }}>Eşya & Demirbaş Envanteri</label>
                                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Kiracı tesliminden önce markaları ve durumları belgeleyin.</span>
                            </div>
                            <button type="button" onClick={addInventoryItem} className="secondary-btn" style={{ borderColor: 'var(--accent-primary)', fontSize: '0.9rem' }}>+ Eşya Ekle</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {inventory.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Mülkte bırakılan hiç eşya kaydı yok. Mülk boş kabul edilecektir.</span>}
                            {inventory.map((item, idx) => (
                                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>#{idx+1}</span>
                                    <input type="text" placeholder="Eşya: Klima, TV..." style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }} value={item.name} onChange={e => updateInventoryItem(item.id, 'name', e.target.value)} required />
                                    <div style={{ width: '1px', height: '20px', background: 'var(--border-glass)' }}></div>
                                    <input type="text" placeholder="Marka/Model" style={{ flex: 1.5, background: 'transparent', border: 'none', color: 'white', outline: 'none' }} value={item.brandModel} onChange={e => updateInventoryItem(item.id, 'brandModel', e.target.value)} />
                                    <div style={{ width: '1px', height: '20px', background: 'var(--border-glass)' }}></div>
                                    <select style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', outline: 'none', width: '120px' }} value={item.condition} onChange={e => updateInventoryItem(item.id, 'condition', e.target.value)}>
                                        <option value="Yeni">Yeni</option>
                                        <option value="Kullanılmış">Kullanılmış</option>
                                        <option value="Hasarlı">Hasarlı/Eski</option>
                                    </select>
                                    <button type="button" onClick={() => removeInventoryItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="upload-zone" style={{ position: 'relative' }}>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    <UploadCloud size={40} className="upload-icon" />
                    <h4>Ev Fotoğraflarını Yükleyin</h4>
                    <p>Sürükleyip bırakın veya tarayıcıdan dosyaları seçin.</p>
                </div>

                {images.length > 0 && (
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                        {images.map((img, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/admin')}>İptal</button>
                    <button type="submit" className="btn-save">
                        {isSubmitted ? <><CheckCircle2 size={18}/> {id ? 'Güncellendi' : 'Kaydedildi'}</> : (id ? 'Mülkü Güncelle' : 'Ağa Global Olarak Kaydet')}
                    </button>
                </div>
            </form>
        </div>
    );
};

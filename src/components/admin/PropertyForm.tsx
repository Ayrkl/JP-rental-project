import React, { useState, useMemo } from 'react';
import { Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud, Layout, Trash2 } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useNavigate } from 'react-router-dom';

export const PropertyForm = () => {
    // Zustand'dan global 'Ekleme' fonksiyonumuzu alıyoruz
    const addProperty = usePropertyStore(state => state.addProperty);
    const navigate = useNavigate();

    // Temel Form Verileri
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [buildYear, setBuildYear] = useState('');
    const [quakeStandard, setQuakeStandard] = useState('new');
    
    // YENİ: Dinamik Oda Builder (Arayüz)
    const [rooms, setRooms] = useState<{ id: string; type: 'Room' | 'Living' | 'Dining' | 'Kitchen' }[]>([]);

    const [isSubmitted, setIsSubmitted] = useState(false);

    // Odayı Array'e ekleme fonksiyonu
    const addRoom = (type: 'Room' | 'Living' | 'Dining' | 'Kitchen') => {
        setRooms([...rooms, { id: Math.random().toString(36).substr(2, 9), type }]);
    };

    // İstenmeyen odayı Array'den çıkarma
    const removeRoom = (id: string) => {
        setRooms(rooms.filter(r => r.id !== id));
    };

    // Dinamik "Final Oda Tipi" Hesaplayıcısı (Örn: 2LDK)
    const layoutString = useMemo(() => {
        const roomCount = rooms.filter(r => r.type === 'Room').length;
        const hasLiving = rooms.some(r => r.type === 'Living');
        const hasDining = rooms.some(r => r.type === 'Dining');
        const hasKitchen = rooms.some(r => r.type === 'Kitchen');
        
        let prefix = roomCount > 0 ? roomCount.toString() : (rooms.length > 0 ? '0' : '1');
        let suffix = '';
        if (hasLiving) suffix += 'L';
        if (hasDining) suffix += 'D';
        if (hasKitchen) suffix += 'K';

        if (prefix === '1' && suffix === '') return '1R'; // Default Studio
        if (prefix === '0' && suffix === '') return '1R'; 
        return prefix === '0' ? suffix : prefix + suffix;
    }, [rooms]);

    // Sunucu/Store'a Gönderim
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Zustand store'a Frontend Verisini Kalıcı Yazdırıyoruz
        addProperty({
            address,
            area: Number(area),
            buildYear: Number(buildYear),
            quakeStandard,
            rooms, // detaylı oda yapısı JSON formatında da saklanır
            roomType: layoutString // Final "1LDK" gibi hesaplanmış değer
        });

        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            navigate('/admin'); // Başarılı olunca Dashboard'a dön
        }, 1200);
    };

    return (
        <div className="property-form-container glass-effect fade-in">
            <div className="form-header">
                <h2>Yeni Mülk Tanımlama</h2>
                <p>Oda bileşenlerini detaylı olarak seçin ve mülkü oluşturun.</p>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    
                    <div className="input-group full-width">
                        <label><MapPin size={16}/> Açık Adres (住所)</label>
                        <input 
                            type="text" 
                            placeholder="Örn: Tokyo-to, Shibuya-ku, Dogenzaka 2-chome..." 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    {/* YENİ: DİNAMİK ODA OLUŞTURUCU */}
                    <div className="input-group full-width" style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <label style={{ margin: 0 }}><Layout size={16}/> Dinamik Oda & Plan Oluşturucu (Madori)</label>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>
                                Sonuç Plan: {layoutString}
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            <button type="button" onClick={() => addRoom('Room')} className="secondary-btn" style={{ borderColor: 'rgba(99,102,241,0.5)' }}>+ Yatak Odası (R)</button>
                            <button type="button" onClick={() => addRoom('Living')} className="secondary-btn" style={{ borderColor: 'rgba(168,85,247,0.5)' }}>+ Salon (L)</button>
                            <button type="button" onClick={() => addRoom('Dining')} className="secondary-btn" style={{ borderColor: 'rgba(236,72,153,0.5)' }}>+ Yemek Alanı (D)</button>
                            <button type="button" onClick={() => addRoom('Kitchen')} className="secondary-btn" style={{ borderColor: 'rgba(234,179,8,0.5)' }}>+ Mutfak (K)</button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '34px' }}>
                            {rooms.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Henüz oda eklemediniz. Final planı hesaplamak için oda seçin.</span>}
                            {rooms.map((room) => (
                                <div key={room.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>
                                        {room.type === 'Room' ? '🛏️ Yatak Odası' : 
                                         room.type === 'Living' ? '🛋️ Salon (L)' : 
                                         room.type === 'Dining' ? '🍽️ Yemek (D)' : 
                                         '🍳 Mutfak (K)'}
                                    </span>
                                    <button type="button" onClick={() => removeRoom(room.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Diğer Teknik Bilgiler */}
                    <div className="input-group">
                        <label><Ruler size={16}/> Net Alan (m²)</label>
                        <input 
                            type="number" 
                            placeholder="Örn: 45" 
                            value={area}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '0') return; // '0' değerini yok say
                                setArea(val);
                            }}
                            min="1"
                            step="any"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label><Calendar size={16}/> Yapım Yılı</label>
                        <input 
                            type="number" 
                            placeholder="Örn: 2018" 
                            min="1950" max="2026"
                            value={buildYear}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '0' || val.startsWith('0')) return; // '0' veya '0 ile başlayan' veriyi engeller
                                setBuildYear(val);
                            }}
                            required
                        />
                    </div>

                    <div className="input-group full-width">
                        <label><ShieldCheck size={16}/> Deprem Sertifikası (耐震基準)</label>
                        <div className="custom-select-wrapper">
                            <select 
                                value={quakeStandard}
                                onChange={(e) => setQuakeStandard(e.target.value)}
                            >
                                <option value="old">Eski Standart (旧耐震 - 1981 Öncesi)</option>
                                <option value="new">Yeni Standart (新耐震 - 1981 Sonrası)</option>
                                <option value="grade2">Grade 2 (耐震等級2)</option>
                                <option value="grade3">Grade 3 (耐震等級3 - Üst Düzen)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/admin')}>İptal</button>
                    <button type="submit" className="btn-save">
                        {isSubmitted ? <><CheckCircle2 size={18}/> Kaydedildi</> : 'Ağa Global Olarak Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

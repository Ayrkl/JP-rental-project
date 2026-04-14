import React, { useState } from 'react';
import { Building2, Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud } from 'lucide-react';

export const PropertyForm = () => {
    // Sadece Front-end'de veriyi tutmak için state'ler. 
    // İleride Backend yazıldığında buradaki veriler "POST" edilecek.
    const [formData, setFormData] = useState({
        roomType: '1LDK',
        area: '',
        buildYear: '',
        quakeStandard: 'new',
        address: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Geçici Frontend aksiyonu
        console.log("Mock Submit (Backend yokken):", formData);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="property-form-container glass-effect fade-in">
            <div className="form-header">
                <h2>Yeni Mülk Tanımlama</h2>
                <p>Japonya standartlarında gayrimenkul veri kaydı (Property & Asset Creation)</p>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    
                    {/* Alan 1: Adres */}
                    <div className="input-group full-width">
                        <label><MapPin size={16}/> Açık Adres (住所)</label>
                        <input 
                            type="text" 
                            placeholder="Örn: Tokyo-to, Shibuya-ku, Dogenzaka 2-chome..." 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            required
                        />
                    </div>

                    {/* Alan 2: Oda Tipi */}
                    <div className="input-group">
                        <label><Building2 size={16}/> Oda Tipi</label>
                        <div className="custom-select-wrapper">
                            <select 
                                value={formData.roomType}
                                onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                            >
                                <option value="1R">1R (Tek Oda)</option>
                                <option value="1K">1K (Oda + Mutfak)</option>
                                <option value="1DK">1DK (Oda + Yemek Alanı)</option>
                                <option value="1LDK">1LDK (Oda + Salon + Yemek Alanı)</option>
                                <option value="2LDK">2LDK</option>
                                <option value="3LDK">3LDK+</option>
                            </select>
                        </div>
                    </div>

                    {/* Alan 3: Net m2 */}
                    <div className="input-group">
                        <label><Ruler size={16}/> Net Alan (m²)</label>
                        <input 
                            type="number" 
                            placeholder="Örn: 45" 
                            value={formData.area}
                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                            required
                        />
                    </div>

                    {/* Alan 4: Yapım Yılı */}
                    <div className="input-group">
                        <label><Calendar size={16}/> Yapım Yılı</label>
                        <input 
                            type="number" 
                            placeholder="Örn: 2018" 
                            min="1950" max="2026"
                            value={formData.buildYear}
                            onChange={(e) => setFormData({...formData, buildYear: e.target.value})}
                            required
                        />
                    </div>

                    {/* Alan 5: Deprem Sertifikası */}
                    <div className="input-group">
                        <label><ShieldCheck size={16}/> Deprem Sertifikası (耐震基準)</label>
                        <div className="custom-select-wrapper">
                            <select 
                                value={formData.quakeStandard}
                                onChange={(e) => setFormData({...formData, quakeStandard: e.target.value})}
                            >
                                <option value="old">Eski Standart (旧耐震 - 1981 Öncesi)</option>
                                <option value="new">Yeni Standart (新耐震 - 1981 Sonrası)</option>
                                <option value="grade2">Grade 2 (耐震等級2)</option>
                                <option value="grade3">Grade 3 (耐震等級3 - Üst Düzen)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="upload-zone">
                    <UploadCloud size={40} className="upload-icon" />
                    <h4>Tapu veya Mülk Fotoğraflarını Yükleyin</h4>
                    <p>Sürükleyip bırakın veya dosyaları seçin (Maks. 5MB)</p>
                    <button type="button" className="secondary-btn">Dosya Seç</button>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-cancel">Tümünü Temizle</button>
                    <button type="submit" className="btn-save">
                        {isSubmitted ? <><CheckCircle2 size={18}/> Kaydedildi</> : 'Mülkü Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

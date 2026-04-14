import { useState, useEffect, useMemo } from 'react';
import { Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud, Trash2, Plus, Layout, X, Users } from 'lucide-react';
import { usePropertyStore, type InventoryItem } from '../../store/usePropertyStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PropertyForm = ({ propertyId, onComplete, isModal }: { propertyId?: string; onComplete?: () => void; isModal?: boolean }) => {
    const { addProperty, updateProperty, properties } = usePropertyStore();
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const id = propertyId || routeId;

    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [buildYear, setBuildYear] = useState('');
    const [quakeStandard, setQuakeStandard] = useState('new');
    const [tenantCapacity, setTenantCapacity] = useState('1');
    const [rooms, setRooms] = useState<{ id: string; type: 'Room' | 'Living' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Toilet' | 'Balcony' | 'Storage' }[]>([]);
    const [images, setImages] = useState<string[]>([]);
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
                if (existingProp.tenantCapacity) setTenantCapacity(existingProp.tenantCapacity.toString());
                setRooms(existingProp.rooms);
                setImages(existingProp.images || []);
                setFeatures(existingProp.features || []);
                setInventory(existingProp.inventory || []);
            }
        }
    }, [id, properties]);

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

    const addRoom = (type: 'Room' | 'Living' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Toilet' | 'Balcony' | 'Storage') => {
        setRooms([...rooms, { id: Math.random().toString(36).substring(2, 9), type }]);
    };

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
        const hasS = rooms.some(r => r.type === 'Storage');

        const prefix = roomCount > 0 ? roomCount.toString() : (rooms.length > 0 ? '0' : '1');
        const suffix = `${hasS ? 'S' : ''}${hasL ? 'L' : ''}${hasD ? 'D' : ''}${hasK ? 'K' : ''}`;
        return prefix === '0' ? suffix : (prefix === '1' && suffix === '' ? '1R' : prefix + suffix);
    }, [rooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { address, area: Number(area), buildYear: Number(buildYear), quakeStandard, tenantCapacity: Number(tenantCapacity), rooms, roomType: layoutString, images, features, inventory };
        if (id) updateProperty(id, payload);
        else addProperty(payload);

        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            if (onComplete) onComplete();
            else navigate('/admin');
        }, 1000);
    };

    const formContent = (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* TEMEL BİLGİLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">Temel Bilgiler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <Label className="flex items-center gap-2"><MapPin size={16} /> Açık Adres</Label>
                            <Input placeholder="Örn: Tokyo-to, Shibuya-ku..." value={address} onChange={e => setAddress(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Ruler size={16} /> Net Alan (m²)</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder="Örn: 45" value={area} onChange={e => e.target.value !== '0' && setArea(e.target.value)} min="1" step="any" required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Calendar size={16} /> Yapım Yılı</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder="Örn: 2018" min="1950" max="2026" value={buildYear} onChange={e => (!e.target.value.startsWith('0') && e.target.value !== '0') && setBuildYear(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Users size={16} /> Kişi Kapasitesi</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder="Örn: 2" min="1" max="15" value={tenantCapacity} onChange={e => e.target.value !== '0' && setTenantCapacity(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><ShieldCheck size={16} /> Deprem Sertifikası (耐震基準)</Label>
                            <Select value={quakeStandard} onValueChange={setQuakeStandard}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Bir standart seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="old">Eski Standart (旧耐震 - 1981 Öncesi)</SelectItem>
                                    <SelectItem value="new">Yeni Standart (新耐震 - 1981 Sonrası)</SelectItem>
                                    <SelectItem value="grade2">Grade 2 (耐震等級2)</SelectItem>
                                    <SelectItem value="grade3">Grade 3 (耐震等級3)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* PLAN VE ODALAR */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">Oda & Plan Çizicisi</h3>

                    <div className="rounded-xl border border-border bg-card overflow-hidden mt-2">
                        <div className="flex items-center justify-between bg-muted/20 p-4 border-b border-border">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium block">Kat Planı Oluşturucu</span>
                                <span className="text-xs text-muted-foreground">Oda bloklarını sırayla ekleyerek gayrimenkulün planını dizayn edin.</span>
                            </div>
                        </div>

                        <div className="p-5 flex flex-col gap-6">
                            <div className="flex flex-wrap gap-3">
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Room')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Yatak Odası (R)
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Living')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Salon (L)
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Dining')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Yemek Alanı (D)
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Kitchen')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Mutfak (K)
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Bathroom')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Banyo (B)
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Toilet')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Tuvalet (WC)
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Storage')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Depo/Kiler (S)
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Balcony')} className="bg-background shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4 mr-1.5 opacity-70" /> Balkon (BL)
                                </Button>
                            </div>

                            {/* Seçilen Odaların Görüntülendiği Pano (Pill şeklinde) */}
                            <div className="flex flex-wrap items-center gap-2.5 min-h-[50px] p-4 rounded-xl border border-dashed border-border/60 bg-muted/10">
                                {rooms.length === 0 ? (
                                    <span className="text-sm text-muted-foreground w-full text-center py-2 flex items-center justify-center gap-2">
                                        <Layout className="w-4 h-4 opacity-50" /> Henüz oda eklenmedi. Seçimlerinizi yukarıdan yapabilirsiniz.
                                    </span>
                                ) : (
                                    rooms.map((room, index) => (
                                        <div key={room.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background shadow-sm animate-in zoom-in-95 duration-200">
                                            <span className="text-xs font-semibold text-muted-foreground w-4 h-4 flex items-center justify-center rounded-full bg-muted/50">{index + 1}</span>
                                            <span className="text-sm font-medium">
                                                {room.type === 'Room' ? '🛏️ Yatak Odası' : 
                                                 room.type === 'Living' ? '🛋️ Salon' : 
                                                 room.type === 'Dining' ? '🍽️ Yemek Alanı' : 
                                                 room.type === 'Kitchen' ? '🍳 Mutfak' :
                                                 room.type === 'Bathroom' ? '🛁 Banyo' :
                                                 room.type === 'Toilet' ? '🚽 Tuvalet' :
                                                 room.type === 'Balcony' ? '🌅 Balkon' :
                                                 '📦 Depo/Kiler'}
                                            </span>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => setRooms(rooms.filter(r => r.id !== room.id))} className="h-5 w-5 ml-0.5 rounded-full text-muted-foreground hover:bg-destructive hover:text-destructive-foreground">
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Nihai Layout Formatı (Sonuç: 3LDK vb.) */}
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-sm font-medium text-foreground">Japonya Mülk Planı (マドリ):</span>
                                <Badge variant="default" className="text-sm px-4 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 font-bold shadow-none truncate transition-all">
                                    {layoutString === '0' ? 'Tanımsız' : layoutString}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ÖZELLİKLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">Fiziksel İmkanlar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {[
                            { id: 'internet', label: 'Fiber İnternet', desc: 'Yüksek hızlı gigabit altyapısı' },
                            { id: 'elevator', label: 'Asansör', desc: 'Bina içi yük/insan asansörü' },
                            { id: 'autolock', label: 'Otomatik Kilit', desc: 'Şifreli ve kameralı güvenli giriş' },
                            { id: 'parking', label: 'Otopark Alanı', desc: 'Binada araca özel tahsisli alan' },
                            { id: 'pets', label: 'Evcil Hayvan İzni', desc: 'Kedi ve köpek barındırılabilir' },
                            { id: 'balcony', label: 'Balkon', desc: 'Açık hava özel kullanım alanı' },
                        ].map(feat => {
                            const isChecked = Array.isArray(features) && features.includes(feat.id);
                            return (
                                <button
                                    key={feat.id}
                                    type="button"
                                    onClick={() => {
                                        setFeatures(prev => {
                                            const current = Array.isArray(prev) ? prev : [];
                                            return current.includes(feat.id) ? current.filter(f => f !== feat.id) : [...current, feat.id];
                                        });
                                    }}
                                    className={`flex flex-col items-start justify-center text-left rounded-xl border p-4 transition-all duration-200 w-full ${isChecked ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-muted/10 hover:bg-muted/30'}`}
                                >
                                    <span className={`text-sm font-semibold leading-none ${isChecked ? 'text-primary' : 'text-foreground'}`}>{feat.label}</span>
                                    <span className="text-xs text-muted-foreground/80 leading-snug mt-1.5">{feat.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ENVANTER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <div>
                            <h3 className="text-lg font-medium tracking-tight">Eşya & Demirbaş Envanteri</h3>
                            <p className="text-xs text-muted-foreground mt-1">Kiracının girişinde teslim edilecek demirbaşları işaretleyin.</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addInventoryItem}>
                            <Plus className="w-4 h-4 mr-1.5" /> Eşya Ekle
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        {inventory.length === 0 && <p className="text-sm text-muted-foreground">Sistemde kayıtlı ekstra demirbaş bulunmuyor.</p>}
                        {inventory.map((item, idx) => (
                            <div key={item.id} className="flex gap-3 items-center p-3 rounded-lg border border-border/50 bg-background/50">
                                <span className="font-mono text-muted-foreground text-xs font-semibold w-6">{idx + 1}.</span>
                                <Input className="h-9 flex-1 shadow-none" placeholder="Eşya (TV vs.)" value={item.name} onChange={e => updateInventoryItem(item.id, 'name', e.target.value)} required />
                                <Input className="h-9 flex-[1.5] shadow-none" placeholder="Marka / Model" value={item.brandModel} onChange={e => updateInventoryItem(item.id, 'brandModel', e.target.value)} />
                                <div className="w-[140px]">
                                    <Select value={item.condition} onValueChange={v => updateInventoryItem(item.id, 'condition', v)}>
                                        <SelectTrigger className="h-9 shadow-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Yeni">Yeni / Sıfır</SelectItem>
                                            <SelectItem value="Kullanılmış">İyi Durumda</SelectItem>
                                            <SelectItem value="Hasarlı">Eski / Hasarlı</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeInventoryItem(item.id)} className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0">
                                    <Trash2 className="w-4 h-4 ml-0.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GÖRSELLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">Mülk Görselleri</h3>
                    <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-10 text-center group bg-muted/10 cursor-pointer">
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <UploadCloud className="w-10 h-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium">Bırakarak veya Tıklayarak Yükleyin</p>
                        <p className="text-xs text-muted-foreground mt-1">Desteklenen: JPG, PNG, WEBP</p>
                    </div>

                    {images.length > 0 && (
                        <div className="flex gap-4 flex-wrap pt-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border group">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-destructive shadow-md">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8">
                {!isModal && <Button type="button" variant="outline" onClick={() => navigate('/admin')}>Geri Dön</Button>}
                <Button type="submit" className="min-w-[140px]">
                    {isSubmitted ? <><CheckCircle2 className="w-4 h-4 mr-2" /> {id ? 'Güncellendi' : 'Eklendi'}</> : (id ? 'Değişiklikleri Kaydet' : 'Yeni Mülkü Ekle')}
                </Button>
            </div>
        </form>
    );

    if (isModal) {
        return formContent;
    }

    return (
        <div className="w-full text-foreground animate-in fade-in-50 duration-500 pb-10">
            <div className="mb-6 border-none">
                <h1 className="text-2xl font-bold tracking-tight mb-1">{id ? 'Mülkü Düzenle' : 'Sisteme Yeni Mülk Ekle'}</h1>
                <p className="text-muted-foreground text-sm">Gerekli verileri doldurarak işlem aşamalarını kaydedin.</p>
            </div>
            <div className="bg-card border border-border shadow-sm rounded-xl p-8">
                {formContent}
            </div>
        </div>
    );
};

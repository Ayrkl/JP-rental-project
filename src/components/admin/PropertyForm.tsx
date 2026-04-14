import { useState, useEffect, useMemo } from 'react';
import { Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud, Trash2, Plus } from 'lucide-react';
import { usePropertyStore, type InventoryItem } from '../../store/usePropertyStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export const PropertyForm = ({ propertyId, onComplete, isModal }: { propertyId?: string; onComplete?: () => void; isModal?: boolean }) => {
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

    const addRoom = (type: 'Room' | 'Living' | 'Dining' | 'Kitchen') => {
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
        
        const prefix = roomCount > 0 ? roomCount.toString() : (rooms.length > 0 ? '0' : '1');
        const suffix = `${hasL?'L':''}${hasD?'D':''}${hasK?'K':''}`;
        return prefix === '0' ? suffix : (prefix === '1' && suffix === '' ? '1R' : prefix + suffix);
    }, [rooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { address, area: Number(area), buildYear: Number(buildYear), quakeStandard, rooms, roomType: layoutString, images, features, inventory };
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
                            <Label className="flex items-center gap-2"><MapPin size={16}/> Açık Adres</Label>
                            <Input placeholder="Örn: Tokyo-to, Shibuya-ku..." value={address} onChange={e => setAddress(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Ruler size={16}/> Net Alan (m²)</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder="Örn: 45" value={area} onChange={e => e.target.value !== '0' && setArea(e.target.value)} min="1" step="any" required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Calendar size={16}/> Yapım Yılı</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder="Örn: 2018" min="1950" max="2026" value={buildYear} onChange={e => (!e.target.value.startsWith('0') && e.target.value !== '0') && setBuildYear(e.target.value)} required />
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <Label className="flex items-center gap-2"><ShieldCheck size={16}/> Deprem Sertifikası (耐震基準)</Label>
                            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={quakeStandard} onChange={e => setQuakeStandard(e.target.value)}>
                                <option value="old">Eski Standart (旧耐震 - 1981 Öncesi)</option>
                                <option value="new">Yeni Standart (新耐震 - 1981 Sonrası)</option>
                                <option value="grade2">Grade 2 (耐震等級2)</option>
                                <option value="grade3">Grade 3 (耐震等級3 - Üst Düzen)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* PLAN VE ODALAR */}
                <div className="space-y-5 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <h3 className="text-lg font-medium tracking-tight">Oda & Plan Çizicisi</h3>
                        <Badge variant="secondary" className="px-3 py-1 font-mono text-sm">Plan: {layoutString}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Room')}>Oda Ekle (R)</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Living')}>Salon Ekle (L)</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Dining')}>Yemek Alanı (D)</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addRoom('Kitchen')}>Mutfak (K)</Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center min-h-[40px] pt-2">
                        {rooms.length === 0 && <span className="text-muted-foreground text-sm">Kat planı seçilmedi. (Stüdyo tipi olarak kaydedilecek)</span>}
                        {rooms.map(room => (
                            <Badge key={room.id} variant="secondary" className="pr-1.5 py-1 text-xs gap-1.5 bg-muted">
                                {room.type === 'Room' ? 'Yatak Odası' : room.type === 'Living' ? 'Salon' : room.type === 'Dining' ? 'Yemek Alanı' : 'Mutfak'}
                                <Button type="button" variant="ghost" size="icon" className="h-4 w-4 rounded-full text-muted-foreground hover:text-destructive hover:bg-transparent" onClick={() => setRooms(rooms.filter(r => r.id !== room.id))}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </Badge>
                        ))}
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
                                <div key={feat.id} className={`flex flex-row items-center justify-between rounded-xl border p-4 transition-all duration-200 ${isChecked ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-muted/10 hover:bg-muted/30'}`}>
                                    <div className="flex flex-col gap-1 pr-4">
                                        <Label htmlFor={`feat-${feat.id}`} className="text-sm font-semibold cursor-pointer leading-none">{feat.label}</Label>
                                        <span className="text-xs text-muted-foreground/80 leading-snug">{feat.desc}</span>
                                    </div>
                                    <div className="shrink-0">
                                        <Switch 
                                            id={`feat-${feat.id}`} 
                                            checked={isChecked} 
                                            onCheckedChange={(checked) => {
                                                setFeatures(prev => {
                                                    const current = Array.isArray(prev) ? prev : [];
                                                    return checked ? [...current, feat.id] : current.filter(f => f !== feat.id);
                                                });
                                            }} 
                                        />
                                    </div>
                                </div>
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
                            <div key={item.id} className="flex gap-3 items-center p-3 rounded-lg border bg-muted/20">
                                <span className="font-mono text-muted-foreground text-xs font-semibold w-6">{idx+1}.</span>
                                <Input className="h-8 flex-1 border-border/50 bg-background/50 shadow-none" placeholder="Eşya (TV vs.)" value={item.name} onChange={e => updateInventoryItem(item.id, 'name', e.target.value)} required />
                                <Input className="h-8 flex-[1.5] border-border/50 bg-background/50 shadow-none" placeholder="Marka / Model Belirt" value={item.brandModel} onChange={e => updateInventoryItem(item.id, 'brandModel', e.target.value)} />
                                <select className="h-8 rounded-md border border-input bg-background/50 px-2 text-sm" value={item.condition} onChange={e => updateInventoryItem(item.id, 'condition', e.target.value)}>
                                    <option value="Yeni">Yeni Sıfır</option>
                                    <option value="Kullanılmış">Kullanılmış</option>
                                    <option value="Hasarlı">Eski Hasarlı</option>
                                </select>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeInventoryItem(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                                    <Trash2 className="w-4 h-4" />
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
                    {isSubmitted ? <><CheckCircle2 className="w-4 h-4 mr-2"/> {id ? 'Güncellendi' : 'Eklendi'}</> : (id ? 'Değişiklikleri Kaydet' : 'Yeni Mülkü Ekle')}
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

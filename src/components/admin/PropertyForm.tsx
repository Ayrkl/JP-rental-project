import { useState, useEffect, useMemo } from 'react';
import { Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud, Layout, Trash2 } from 'lucide-react';
import { usePropertyStore, type InventoryItem } from '../../store/usePropertyStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

    const toggleFeature = (featId: string) => {
        setFeatures(prev => prev.includes(featId) ? prev.filter(f => f !== featId) : [...prev, featId]);
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

    return (
        <Card className="w-full max-w-4xl mx-auto border-border/50 bg-[#121212] text-zinc-200">
            <CardHeader className="border-b border-border/40 pb-6 mb-6">
                <CardTitle className="text-2xl font-bold">{id ? 'Mülkü Düzenle' : 'Yeni Mülk Tanımlama'}</CardTitle>
                <CardDescription className="text-zinc-500">Eşya envanteri dahil tüm mülk detaylarını ve sözleşme öncesi altyapısını kurun.</CardDescription>
            </CardHeader>

            <CardContent>
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label className="flex items-center gap-2 text-zinc-400"><MapPin size={16}/> Açık Adres</Label>
                        <Input className="bg-[#1e1e1e] border-border/40" placeholder="Örn: Tokyo-to, Shibuya-ku..." value={address} onChange={e => setAddress(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-zinc-400"><Ruler size={16}/> Net Alan (m²)</Label>
                        <Input className="bg-[#1e1e1e] border-border/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder="Örn: 45" value={area} onChange={e => e.target.value !== '0' && setArea(e.target.value)} min="1" step="any" required />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-zinc-400"><Calendar size={16}/> Yapım Yılı</Label>
                        <Input className="bg-[#1e1e1e] border-border/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder="Örn: 2018" min="1950" max="2026" value={buildYear} onChange={e => (!e.target.value.startsWith('0') && e.target.value !== '0') && setBuildYear(e.target.value)} required />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label className="flex items-center gap-2 text-zinc-400"><ShieldCheck size={16}/> Deprem Sertifikası (耐震基準)</Label>
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-border/40 bg-[#1e1e1e] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" value={quakeStandard} onChange={e => setQuakeStandard(e.target.value)}>
                            <option value="old">Eski Standart (旧耐震 - 1981 Öncesi)</option>
                            <option value="new">Yeni Standart (新耐震 - 1981 Sonrası)</option>
                            <option value="grade2">Grade 2 (耐震等級2)</option>
                            <option value="grade3">Grade 3 (耐震等級3 - Üst Düzen)</option>
                        </select>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-[#1a1a1a] p-6 rounded-xl border border-border/30">
                        <div className="flex justify-between items-center mb-4">
                            <Label className="flex items-center gap-2 text-zinc-300 text-base"><Layout size={18}/> Oda & Plan Çizicisi</Label>
                            <div className="text-xl font-bold text-indigo-400">Plan: {layoutString}</div>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <Button type="button" variant="outline" onClick={() => addRoom('Room')} className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400">+ Yatak Odası (R)</Button>
                            <Button type="button" variant="outline" onClick={() => addRoom('Living')} className="border-purple-500/30 hover:bg-purple-500/10 text-purple-400">+ Salon (L)</Button>
                            <Button type="button" variant="outline" onClick={() => addRoom('Dining')} className="border-pink-500/30 hover:bg-pink-500/10 text-pink-400">+ Yemek Alanı (D)</Button>
                            <Button type="button" variant="outline" onClick={() => addRoom('Kitchen')} className="border-amber-500/30 hover:bg-amber-500/10 text-amber-500">+ Mutfak (K)</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                            {rooms.length === 0 && <span className="text-zinc-600 text-sm">Hiç oda seçilmedi, stüdyo (1R) olarak tanımlanacaktır.</span>}
                            {rooms.map(room => (
                                <div key={room.id} className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1.5 rounded-full border border-border/40">
                                    <span className="text-sm text-zinc-300">{room.type === 'Room' ? '🛏️ Oda' : room.type === 'Living' ? '🛋️ Salon' : room.type === 'Dining' ? '🍽️ Yemek' : '🍳 Mutfak'}</span>
                                    <button type="button" onClick={() => setRooms(rooms.filter(r => r.id !== room.id))} className="text-rose-500 hover:text-rose-400"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-sm font-semibold text-zinc-400 border-b border-border/40 pb-3 mb-4">Mülk İmkanları (Fiziksel)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { id: 'internet', label: 'Fiber İnternet' },
                                { id: 'elevator', label: 'Asansör' },
                                { id: 'autolock', label: 'Otomatik Kilit' },
                                { id: 'parking', label: 'Otopark Alanı' },
                                { id: 'pets', label: 'Evcil Hayvan' },
                                { id: 'balcony', label: 'Balkon' },
                            ].map(feat => (
                                <div key={feat.id} className="flex items-center space-x-3">
                                    <Switch checked={features.includes(feat.id)} onCheckedChange={() => toggleFeature(feat.id)} id={`feat-${feat.id}`} />
                                    <Label htmlFor={`feat-${feat.id}`} className={features.includes(feat.id) ? 'text-zinc-200 cursor-pointer' : 'text-zinc-500 cursor-pointer'}>{feat.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-[#1a1a1a] p-6 rounded-xl border border-border/30">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <Label className="text-base text-zinc-300">Eşya & Demirbaş Envanteri</Label>
                                <p className="text-xs text-zinc-500 mt-1">Kiracı giriş öncesi markaları tutanaklayın.</p>
                            </div>
                            <Button type="button" variant="outline" onClick={addInventoryItem} className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 border-dashed">+ Eşya Ekle</Button>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {inventory.length === 0 && <p className="text-sm text-zinc-600">Demirbaş kaydı yok.</p>}
                            {inventory.map((item, idx) => (
                                <div key={item.id} className="flex gap-3 items-center bg-[#242424] p-3 rounded-xl border border-border/40 transition-colors focus-within:border-indigo-500/50">
                                    <span className="text-indigo-400 font-bold text-xs w-6 text-center">#{idx+1}</span>
                                    <Input className="bg-transparent border-none h-8 flex-1 focus-visible:ring-0 shadow-none px-2" placeholder="Eşya (TV, Klima)" value={item.name} onChange={e => updateInventoryItem(item.id, 'name', e.target.value)} required />
                                    <div className="w-px h-6 bg-border/50"></div>
                                    <Input className="bg-transparent border-none h-8 flex-[1.5] focus-visible:ring-0 shadow-none px-2" placeholder="Marka/Model" value={item.brandModel} onChange={e => updateInventoryItem(item.id, 'brandModel', e.target.value)} />
                                    <div className="w-px h-6 bg-border/50"></div>
                                    <select className="bg-transparent border-none text-zinc-400 text-sm outline-none w-[120px] focus:text-zinc-200 cursor-pointer" value={item.condition} onChange={e => updateInventoryItem(item.id, 'condition', e.target.value)}>
                                        <option value="Yeni">Yeni</option>
                                        <option value="Kullanılmış">Kullanılmış</option>
                                        <option value="Hasarlı">Hasarlı/Eski</option>
                                    </select>
                                    <button type="button" onClick={() => removeInventoryItem(item.id)} className="text-rose-500/70 hover:text-rose-400 p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative border-2 border-dashed border-border/40 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors rounded-2xl p-10 text-center group cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadCloud size={40} className="mx-auto mb-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <h4 className="text-zinc-300 font-medium mb-1">Ev Fotoğraflarını Yükleyin</h4>
                    <p className="text-sm text-zinc-500">Sürükleyip bırakın veya tarayıcıdan dosyaları seçin.</p>
                </div>

                {images.length > 0 && (
                    <div className="flex gap-4 flex-wrap mb-8">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border/50 group">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/60 text-rose-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end gap-4 border-t border-border/40 pt-6">
                    <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>İptal</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px]">
                        {isSubmitted ? <><CheckCircle2 size={18} className="mr-2"/> {id ? 'Güncellendi' : 'Kaydedildi'}</> : (id ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle')}
                    </Button>
                </div>
            </form>
            </CardContent>
        </Card>
    );
};

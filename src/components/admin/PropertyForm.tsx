import { useState, useEffect, useMemo } from 'react';
import { Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud, Trash2, Plus, Layout, X, Users } from 'lucide-react';
import { usePropertyStore, type InventoryItem } from '../../store/usePropertyStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// İkon düzeltmesi
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

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
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
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
                if (existingProp.coordinates) setCoordinates(existingProp.coordinates);
            }
        }
    }, [id, properties]);

    // Haritadan konum seçme bileşeni
    function LocationPicker() {
        const [isFetchingAddress, setIsFetchingAddress] = useState(false);

        useMapEvents({
            async click(e) {
                const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
                setCoordinates(newCoords);

                // Reverse Geocoding (Nominatim - Ücretsiz)
                setIsFetchingAddress(true);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newCoords.lat}&lon=${newCoords.lng}&accept-language=tr,en,ja`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setAddress(data.display_name.substring(0, ADDRESS_MAX_LENGTH));
                    }
                } catch (error) {
                    console.error("Adres alınamadı:", error);
                } finally {
                    setIsFetchingAddress(false);
                }
            },
        });
        return (
            <>
                {coordinates && <Marker position={[coordinates.lat, coordinates.lng]} icon={icon} />}
                {isFetchingAddress && (
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-[500] flex items-center justify-center pointer-events-none">
                        <div className="bg-background px-3 py-1 rounded-full border shadow-lg text-[10px] font-bold animate-pulse">Adres Çözümleniyor...</div>
                    </div>
                )}
            </>
        );
    }

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
        setInventory([...inventory, { id: Math.random().toString(), name: '', description: '' }]);
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
        const payload = {
            address,
            area: Number(area),
            buildYear: Number(buildYear),
            quakeStandard,
            tenantCapacity: Number(tenantCapacity),
            rooms,
            roomType: layoutString,
            images,
            features,
            inventory,
            coordinates: coordinates || undefined
        };
        if (id) updateProperty(id, payload);
        else addProperty(payload);

        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            if (onComplete) onComplete();
            else navigate('/admin');
        }, 1000);
    };

    const ADDRESS_MAX_LENGTH = 200;

    const formContent = (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* TEMEL BİLGİLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">Temel Bilgiler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3 col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2"><MapPin size={24} /> Açık Adres</Label>
                                <span className={`text-[10px] font-mono ${address.length > 180 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                    Kalan: {ADDRESS_MAX_LENGTH - address.length}
                                </span>
                            </div>
                            <Input
                                placeholder="Örn: Tokyo-to, Shibuya-ku..."
                                value={address}
                                onChange={e => e.target.value.length <= ADDRESS_MAX_LENGTH && setAddress(e.target.value)}
                                required
                            />

                            {/* Konum Seçme Haritası */}
                            <div className="mt-4 rounded-xl overflow-hidden border border-border h-[400px] w-full relative group">
                                <div className="absolute top-2 left-2 z-[400] bg-background/90 backdrop-blur px-2 py-1 rounded border text-[10px] font-semibold pointer-events-none">
                                    {coordinates ? `Konum Seçildi: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}` : 'Haritaya tıklayarak konumu işaretleyin'}
                                </div>
                                <MapContainer
                                    center={[35.6762, 139.6503]}
                                    zoom={12}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationPicker />
                                </MapContainer>
                            </div>
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
                                <SelectContent position="popper" side="bottom" sideOffset={4} className="w-full">
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {[
                                    { id: 'Room', label: 'Yatak Odası', },
                                    { id: 'Living', label: 'Salon' },
                                    { id: 'Dining', label: 'Yemek Alanı', },
                                    { id: 'Kitchen', label: 'Mutfak', },
                                    { id: 'Bathroom', label: 'Banyo' },
                                    { id: 'Toilet', label: 'Tuvalet', },
                                    { id: 'Storage', label: 'Depo/Kiler', },
                                    { id: 'Balcony', label: 'Balkon', }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => addRoom(type.id as any)}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary/40 transition-all text-center gap-2 group w-full"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-semibold">{type.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Seçilen Odaların Görüntülendiği Pano (Pill şeklinde) */}
                            <div className="flex flex-wrap items-center gap-2.5 min-h-[50px] p-4 rounded-xl border border-dashed border-border/60 bg-muted/10">
                                {rooms.length === 0 ? (
                                    <span className="text-sm text-muted-foreground w-full text-center py-2 flex items-center justify-center gap-2">
                                        <Layout className="w-4 h-4 opacity-50" /> Henüz oda eklenmedi. Seçimlerinizi yukarıdan yapabilirsiniz.
                                    </span>
                                ) : (
                                    rooms.map((room, index) => (
                                        <button
                                            key={room.id}
                                            type="button"
                                            onClick={() => setRooms(rooms.filter(r => r.id !== room.id))}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background shadow-sm animate-in zoom-in-95 duration-200 group hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                                        >
                                            <span className="text-xs font-semibold text-muted-foreground group-hover:text-destructive w-4 h-4 flex items-center justify-center rounded-full bg-muted/50 group-hover:bg-destructive/20">{index + 1}</span>
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
                                            <X className="w-3.5 h-3.5 ml-0.5 text-muted-foreground opacity-50 group-hover:text-destructive group-hover:opacity-100 transition-opacity" />
                                        </button>
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
                            { id: 'internet', label: 'Fiber İnternet', desc: 'Yüksek hızlı ortak internet altyapısı' },
                            { id: 'elevator', label: 'Asansör', desc: 'Bina içi yük ve insan asansörü' },
                            { id: 'autolock', label: 'Otomatik Kilit', desc: 'Şifreli ve kameralı güvenli bina girişi' },
                            { id: 'deliveryBox', label: 'Kargo Kutusu', desc: '7/24 güvenli kargo teslimat otomatı' },
                            { id: 'parking', label: 'Otopark Alanı', desc: 'Binada araca özel tahsisli alan' },
                            { id: 'intercom', label: 'Kameralı Diyafon', desc: 'Gelen ziyaretçiyi anında görüntüleme' },
                            { id: 'pets', label: 'Evcil Hayvan İzni', desc: 'Kedi, köpek vb. barındırılabilir' },
                            { id: 'aircon', label: 'Klima Alt Yapısı', desc: 'İklimlendirme için ön hazırlık/kurulum' },
                            { id: 'washlet', label: 'Akıllı Tuvalet', desc: 'Isıtmalı ve fonksiyonel Washlet sistemi' },
                            { id: 'systemKitchen', label: 'Ankastre Mutfak', desc: 'Özel entegre ocak ve davlumbaz sistemi' },
                            { id: 'garbageStation', label: '7/24 Çöp İstasyonu', desc: 'Günün her saati çöp atılabilen özel alan' },
                            { id: 'balcony', label: 'Özel Balkon', desc: 'Açık hava bireysel kullanım alanı' },
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
                            <p className="text-xs text-muted-foreground mt-1">Demirbaşları tek tek ekleyin. Eşya adı ve kısa açıklama girilebilir.</p>
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
                                <Input className="h-9 flex-[2] shadow-none" placeholder="Açıklama (örn: 2014 yılında alınmış, 14 ekran...)" value={item.description} onChange={e => updateInventoryItem(item.id, 'description', e.target.value)} />
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

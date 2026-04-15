import { useState, useEffect, useMemo } from 'react';
import { Ruler, Calendar, ShieldCheck, MapPin, CheckCircle2, UploadCloud, Trash2, Plus, Layout, X, Users, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { usePropertyStore, type InventoryItem, type PropertyLogistics, type GarbageSchedule, type PropertyStatus, type GarbageDay } from '../../store/usePropertyStore';
import { getValidTransitions } from '../../lib/propertyStatusMachine';
import { encryptSmartLockCode } from '../../lib/crypto';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';

const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const statusColors: Record<PropertyStatus, string> = {
    available:   'bg-green-500/20 text-green-400 border-green-500/30',
    leased:      'bg-blue-500/20 text-blue-400 border-blue-500/30',
    overdue:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
    eviction:    'bg-red-500/20 text-red-400 border-red-500/30',
    maintenance: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const GARBAGE_DAYS: GarbageDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const PropertyForm = ({ propertyId, onComplete, isModal }: { propertyId?: string; onComplete?: () => void; isModal?: boolean }) => {
    const { addProperty, updateProperty, properties } = usePropertyStore();
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const id = propertyId || routeId;
    const { t } = useTranslation('properties');
    const { t: tMap } = useTranslation('map');
    const tp = (key: string, opts?: Record<string, unknown>) => t(key as any, opts as any);
    const tm = (key: string, opts?: Record<string, unknown>) => tMap(key as any, opts as any);

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

    // Lojistik state
    const [logistics, setLogistics] = useState<PropertyLogistics>({});
    const [garbageSchedule, setGarbageSchedule] = useState<GarbageSchedule>({ burnable: [], nonBurnable: [], recyclable: [] });
    const [showLockCode, setShowLockCode] = useState(false);
    const [lockCodeInput, setLockCodeInput] = useState('');

    // Durum state
    const [status, setStatus] = useState<PropertyStatus>('available');
    const [statusChangedAt, setStatusChangedAt] = useState<string>(new Date().toISOString());

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
                if (existingProp.logistics) {
                    setLogistics(existingProp.logistics);
                    if (existingProp.logistics.garbageSchedule) {
                        setGarbageSchedule(existingProp.logistics.garbageSchedule);
                    }
                    // Şifreli kilit kodunu gösterme — sadece placeholder
                    setLockCodeInput('');
                }
                if (existingProp.status) setStatus(existingProp.status);
                if (existingProp.statusChangedAt) setStatusChangedAt(existingProp.statusChangedAt);
            }
        }
    }, [id, properties]);

    function LocationPicker() {
        const [isFetchingAddress, setIsFetchingAddress] = useState(false);
        useMapEvents({
            async click(e) {
                const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
                setCoordinates(newCoords);
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
                        <div className="bg-background px-3 py-1 rounded-full border shadow-lg text-[10px] font-bold animate-pulse">{tm('locationPicker.resolving')}</div>
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
        setInventory([...inventory, { id: Math.random().toString(), name: '', description: '', image: undefined, condition: 'new' }]);
    };

    const updateInventoryItem = (itemId: string, field: keyof InventoryItem, value: string) => {
        setInventory(inventory.map(item => item.id === itemId ? { ...item, [field]: value } : item));
    };

    const removeInventoryItem = (itemId: string) => {
        setInventory(inventory.filter(item => item.id !== itemId));
    };

    const updateInventoryImage = (itemId: string, file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setInventory(prev => prev.map(item => item.id === itemId ? { ...item, image: reader.result as string } : item));
        };
        reader.readAsDataURL(file);
    };

    const updateDeliveryPhoto = (itemId: string, file: File | null) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert(tp('inventory.fileTooLarge'));
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setInventory(prev => prev.map(item => item.id === itemId ? { ...item, deliveryPhoto: reader.result as string } : item));
        };
        reader.readAsDataURL(file);
    };

    const toggleGarbageDay = (type: keyof GarbageSchedule, day: GarbageDay) => {
        setGarbageSchedule(prev => {
            const current = prev[type];
            const updated = current.includes(day) ? current.filter(d => d !== day) : [...current, day];
            return { ...prev, [type]: updated };
        });
    };

    const handleStatusChange = (newStatus: PropertyStatus) => {
        setStatus(newStatus);
        setStatusChangedAt(new Date().toISOString());
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalSmartLockCode = logistics.smartLockCode;
        if (lockCodeInput) {
            finalSmartLockCode = await encryptSmartLockCode(lockCodeInput);
        }

        const finalLogistics: PropertyLogistics = {
            ...logistics,
            smartLockCode: finalSmartLockCode,
            garbageSchedule,
        };

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
            coordinates: coordinates || undefined,
            logistics: finalLogistics,
            status,
            statusChangedAt,
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
    const keyHandoverNote = logistics.keyHandoverNote ?? '';
    const KEY_HANDOVER_MAX = 500;

    const formContent = (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* TEMEL BİLGİLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <h3 className="text-lg font-medium tracking-tight">{tp('sections.basicInfo')}</h3>
                        {id && (
                            <Badge className={`border text-xs px-2 py-0.5 ${statusColors[status]}`}>
                                {tp(`status.${status}` as any)}
                            </Badge>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3 col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2"><MapPin size={24} /> {tp('fields.address')}</Label>
                                <span className={`text-[10px] font-mono ${address.length > 180 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                    {tp('fields.remaining', { count: ADDRESS_MAX_LENGTH - address.length })}
                                </span>
                            </div>
                            <Input
                                placeholder={tp('fields.addressPlaceholder')}
                                value={address}
                                onChange={e => e.target.value.length <= ADDRESS_MAX_LENGTH && setAddress(e.target.value)}
                                required
                            />
                            <div className="mt-4 rounded-xl overflow-hidden border border-border h-[400px] w-full relative group">
                                <div className="absolute top-2 left-2 z-[400] bg-background/90 backdrop-blur px-2 py-1 rounded border text-[10px] font-semibold pointer-events-none">
                                    {coordinates
                                        ? tm('locationPicker.selected', { lat: coordinates.lat.toFixed(4), lng: coordinates.lng.toFixed(4) })
                                        : tm('locationPicker.hint')}
                                </div>
                                <MapContainer center={[35.6762, 139.6503]} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationPicker />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Ruler size={16} /> {tp('fields.area')}</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder={tp('fields.areaPlaceholder')} value={area} onChange={e => e.target.value !== '0' && setArea(e.target.value)} min="1" step="any" required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Calendar size={16} /> {tp('fields.buildYear')}</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder={tp('fields.buildYearPlaceholder')} min="1950" max="2026" value={buildYear} onChange={e => (!e.target.value.startsWith('0') && e.target.value !== '0') && setBuildYear(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Users size={16} /> {tp('fields.capacity')}</Label>
                            <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" placeholder={tp('fields.capacityPlaceholder')} min="1" max="15" value={tenantCapacity} onChange={e => e.target.value !== '0' && setTenantCapacity(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><ShieldCheck size={16} /> {tp('fields.quakeStandard')}</Label>
                            <Select value={quakeStandard} onValueChange={setQuakeStandard}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent position="popper" side="bottom" sideOffset={4} className="w-full">
                                    <SelectItem value="old">{tp('quakeOptions.old')}</SelectItem>
                                    <SelectItem value="new">{tp('quakeOptions.new')}</SelectItem>
                                    <SelectItem value="grade2">{tp('quakeOptions.grade2')}</SelectItem>
                                    <SelectItem value="grade3">{tp('quakeOptions.grade3')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Durum değiştirme — sadece edit modunda */}
                        {id && (
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label>{tp('status.changeTo')}</Label>
                                <Select value="" onValueChange={(val) => handleStatusChange(val as PropertyStatus)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={tp('status.changeTo')} />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" sideOffset={4}>
                                        {getValidTransitions(status).map(s => (
                                            <SelectItem key={s} value={s}>{tp(`status.${s}` as any)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                {/* PLAN VE ODALAR */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">{tp('sections.roomPlanner')}</h3>
                    <div className="rounded-xl border border-border bg-card overflow-hidden mt-2">
                        <div className="flex items-center justify-between bg-muted/20 p-4 border-b border-border">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium block">{tp('rooms.plannerTitle')}</span>
                                <span className="text-xs text-muted-foreground">{tp('rooms.plannerDesc')}</span>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col gap-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {(['Room', 'Living', 'Dining', 'Kitchen', 'Bathroom', 'Toilet', 'Storage', 'Balcony'] as const).map((type) => (
                                    <button key={type} type="button" onClick={() => addRoom(type)} className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary/40 transition-all text-center gap-2 group w-full">
                                        <span className="text-sm font-semibold">{tp(`rooms.${type}`)}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 min-h-[50px] p-4 rounded-xl border border-dashed border-border/60 bg-muted/10">
                                {rooms.length === 0 ? (
                                    <span className="text-sm text-muted-foreground w-full text-center py-2 flex items-center justify-center gap-2">
                                        <Layout className="w-4 h-4 opacity-50" /> {tp('rooms.empty')}
                                    </span>
                                ) : (
                                    rooms.map((room, index) => (
                                        <button key={room.id} type="button" onClick={() => setRooms(rooms.filter(r => r.id !== room.id))} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background shadow-sm animate-in zoom-in-95 duration-200 group hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors">
                                            <span className="text-xs font-semibold text-muted-foreground group-hover:text-destructive w-4 h-4 flex items-center justify-center rounded-full bg-muted/50 group-hover:bg-destructive/20">{index + 1}</span>
                                            <span className="text-sm font-medium">
                                                {room.type === 'Room' ? `🛏️ ${tp('rooms.Room')}` : room.type === 'Living' ? `🛋️ ${tp('rooms.Living')}` : room.type === 'Dining' ? `🍽️ ${tp('rooms.Dining')}` : room.type === 'Kitchen' ? `🍳 ${tp('rooms.Kitchen')}` : room.type === 'Bathroom' ? `🛁 ${tp('rooms.Bathroom')}` : room.type === 'Toilet' ? `🚽 ${tp('rooms.Toilet')}` : room.type === 'Balcony' ? `🌅 ${tp('rooms.Balcony')}` : `📦 ${tp('rooms.Storage')}`}
                                            </span>
                                            <X className="w-3.5 h-3.5 ml-0.5 text-muted-foreground opacity-50 group-hover:text-destructive group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-sm font-medium text-foreground">{tp('rooms.layoutLabel')}</span>
                                <Badge variant="default" className="text-sm px-4 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 font-bold shadow-none truncate transition-all">
                                    {layoutString === '0' ? tp('rooms.undefined') : layoutString}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ÖZELLİKLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">{tp('sections.features')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {[
                            { id: 'internet' }, { id: 'elevator' }, { id: 'autolock' }, { id: 'deliveryBox' },
                            { id: 'parking' }, { id: 'intercom' }, { id: 'pets' }, { id: 'aircon' },
                            { id: 'washlet' }, { id: 'systemKitchen' }, { id: 'garbageStation' }, { id: 'balcony' },
                        ].map(feat => {
                            const isChecked = Array.isArray(features) && features.includes(feat.id);
                            return (
                                <button key={feat.id} type="button" onClick={() => setFeatures(prev => { const current = Array.isArray(prev) ? prev : []; return current.includes(feat.id) ? current.filter(f => f !== feat.id) : [...current, feat.id]; })} className={`flex flex-col items-start justify-center text-left rounded-xl border p-4 transition-all duration-200 w-full ${isChecked ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-muted/10 hover:bg-muted/30'}`}>
                                    <span className={`text-sm font-semibold leading-none ${isChecked ? 'text-primary' : 'text-foreground'}`}>{tp(`featureList.${feat.id}` as any)}</span>
                                    <span className="text-xs text-muted-foreground/80 leading-snug mt-1.5">{tp(`featureList.${feat.id}Desc` as any)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>


                {/* LOJİSTİK BİLGİLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">{tp('sections.logistics')}</h3>
                    <div className="rounded-xl border border-border bg-card p-5 space-y-5">

                        {/* Anahtar Teslim Tutanağı */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>{tp('logistics.keyHandoverNote')}</Label>
                                <span className={`text-[10px] font-mono ${keyHandoverNote.length > 480 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                    {KEY_HANDOVER_MAX - keyHandoverNote.length}
                                </span>
                            </div>
                            <textarea
                                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                placeholder={tp('logistics.keyHandoverPlaceholder')}
                                maxLength={KEY_HANDOVER_MAX}
                                value={keyHandoverNote}
                                onChange={e => setLogistics(prev => ({ ...prev, keyHandoverNote: e.target.value }))}
                            />
                        </div>

                        {/* Akıllı Kilit Kodu */}
                        <div className="space-y-2">
                            <Label>{tp('logistics.smartLockCode')}</Label>
                            <div className="flex gap-2">
                                <Input
                                    type={showLockCode ? 'text' : 'password'}
                                    placeholder={id && logistics.smartLockCode ? '••••••••' : tp('logistics.smartLockPlaceholder')}
                                    value={lockCodeInput}
                                    onChange={e => setLockCodeInput(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowLockCode(v => !v)} title={showLockCode ? tp('logistics.smartLockHide') : tp('logistics.smartLockShow')}>
                                    {showLockCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Posta Kutusu Numarası */}
                        <div className="space-y-2">
                            <Label>{tp('logistics.mailboxNumber')}</Label>
                            <Input
                                maxLength={20}
                                placeholder={tp('logistics.mailboxPlaceholder')}
                                value={logistics.mailboxNumber ?? ''}
                                onChange={e => setLogistics(prev => ({ ...prev, mailboxNumber: e.target.value }))}
                            />
                        </div>

                        {/* Çöp Takvimi */}
                        <div className="space-y-3">
                            <Label>{tp('logistics.garbageSchedule')}</Label>
                            {(['burnable', 'nonBurnable', 'recyclable'] as const).map(type => (
                                <div key={type} className="space-y-2">
                                    <span className="text-xs font-medium text-muted-foreground">{tp(`logistics.${type}` as any)}</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {GARBAGE_DAYS.map(day => {
                                            const isSelected = garbageSchedule[type].includes(day);
                                            return (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleGarbageDay(type, day)}
                                                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
                                                >
                                                    {tp(`logistics.days.${day}` as any)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ENVANTER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <div>
                            <h3 className="text-lg font-medium tracking-tight">{tp('sections.inventory')}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{tp('sections.inventoryDesc')}</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addInventoryItem}>
                            <Plus className="w-4 h-4 mr-1.5" /> {tp('actions.addItem')}
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        {inventory.length === 0 && <p className="text-sm text-muted-foreground">{tp('inventory.empty')}</p>}
                        {inventory.map((item, idx) => (
                            <div key={item.id} className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-background/50">
                                <div className="flex gap-3 items-center">
                                    <span className="font-mono text-muted-foreground text-xs font-semibold w-6">{idx + 1}.</span>
                                    <Input className="h-9 flex-1 shadow-none" placeholder={tp('inventory.namePlaceholder')} value={item.name} onChange={e => updateInventoryItem(item.id, 'name', e.target.value)} required />
                                    <Input className="h-9 flex-[2] shadow-none" placeholder={tp('inventory.descPlaceholder')} value={item.description} onChange={e => updateInventoryItem(item.id, 'description', e.target.value)} />

                                    {/* Kondisyon */}
                                    <Select value={item.condition} onValueChange={val => updateInventoryItem(item.id, 'condition', val)}>
                                        <SelectTrigger className="h-9 w-32 shrink-0">
                                            <SelectValue placeholder={tp('inventory.condition')} />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom" sideOffset={4}>
                                            <SelectItem value="new">{tp('inventory.conditionNew')}</SelectItem>
                                            <SelectItem value="used">{tp('inventory.conditionUsed')}</SelectItem>
                                            <SelectItem value="damaged">{tp('inventory.conditionDamaged')}</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Demirbaş fotoğrafı */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="relative h-9 w-9 shrink-0">
                                            <input type="file" accept="image/*" className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => { const file = e.target.files?.[0] ?? null; updateInventoryImage(item.id, file); e.target.value = ''; }} aria-label={tp('inventory.addPhoto')} />
                                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-primary/10 hover:text-primary shrink-0 peer-hover:bg-primary/10 peer-hover:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 overflow-hidden" title={item.image ? tp('inventory.changePhoto') : tp('inventory.addPhoto')}>
                                                <span className="sr-only">{item.image ? tp('inventory.changePhoto') : tp('inventory.addPhoto')}</span>
                                                {item.image ? (
                                                    <img src={item.image} alt={`${item.name || 'Demirbaş'} foto`} className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 pointer-events-none" />
                                                )}
                                            </Button>
                                        </div>
                                        {item.image && (
                                            <Button type="button" variant="outline" size="sm" className="h-9 px-2 text-xs" onClick={() => setInventory(prev => prev.map(it => it.id === item.id ? { ...it, image: undefined } : it))}>
                                                {tp('inventory.removePhoto')}
                                            </Button>
                                        )}
                                    </div>

                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeInventoryItem(item.id)} className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0">
                                        <Trash2 className="w-4 h-4 ml-0.5" />
                                    </Button>
                                </div>

                                {/* Garanti bitiş tarihi + Teslim fotoğrafı */}
                                <div className="flex gap-3 items-center pl-9">
                                    <div className="flex flex-col gap-1 flex-1">
                                        <Label className="text-xs text-muted-foreground">{tp('inventory.warrantyExpiry')}</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="date"
                                                className="h-8 text-xs w-40"
                                                value={item.warrantyExpiry ?? ''}
                                                onChange={e => updateInventoryItem(item.id, 'warrantyExpiry', e.target.value)}
                                            />
                                            {item.warrantyExpiry && new Date(item.warrantyExpiry) < new Date() && (
                                                <Badge className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 border-yellow-500/30 border">
                                                    {tp('inventory.warrantyPast')}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Teslim fotoğrafı */}
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">{tp('inventory.deliveryPhoto')}</Label>
                                        <div className="flex items-center gap-2">
                                            {item.deliveryPhoto ? (
                                                <>
                                                    <img src={item.deliveryPhoto} alt="delivery" className="h-8 w-8 rounded object-cover border" />
                                                    <Button type="button" variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => setInventory(prev => prev.map(it => it.id === item.id ? { ...it, deliveryPhoto: undefined } : it))}>
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        onChange={e => { const file = e.target.files?.[0] ?? null; updateDeliveryPhoto(item.id, file); e.target.value = ''; }}
                                                    />
                                                    <Button type="button" variant="outline" size="sm" className="h-8 px-2 text-xs pointer-events-none">
                                                        <Plus className="w-3 h-3 mr-1" /> {tp('inventory.deliveryPhotoAdd')}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GÖRSELLER */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium tracking-tight border-b border-border pb-2">{tp('sections.images')}</h3>
                    <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-10 text-center group bg-muted/10 cursor-pointer">
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <UploadCloud className="w-10 h-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium">{tp('images.uploadHint')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{tp('images.uploadFormats')}</p>
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
                {!isModal && <Button type="button" variant="outline" onClick={() => navigate('/admin')}>{tp('actions.back')}</Button>}
                <Button type="submit" className="min-w-[140px]">
                    {isSubmitted ? <><CheckCircle2 className="w-4 h-4 mr-2" /> {id ? tp('actions.updated') : tp('actions.added')}</> : (id ? tp('actions.saveChanges') : tp('actions.addNew'))}
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
                <h1 className="text-2xl font-bold tracking-tight mb-1">{id ? tp('page.editTitle') : tp('page.addTitle')}</h1>
                <p className="text-muted-foreground text-sm">{tp('page.subtitle')}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                {formContent}
            </div>
        </div>
    );
};

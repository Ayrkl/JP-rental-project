import type { Property } from '../../store/usePropertyStore';
import { Badge } from '@/components/ui/badge';
import { 
    Home, Ruler, Calendar, MapPin, 
    Zap, DoorOpen, Package, ShowerHead, 
    CheckCircle2, Building2, Users, Layout
} from 'lucide-react';

interface PropertyPreviewProps {
    property: Property;
}

export const PropertyPreview = ({ property }: PropertyPreviewProps) => {
    // Oda sayılarını hesapla
    const roomCounts = property.rooms.reduce((acc, room) => {
        acc[room.type] = (acc[room.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const roomLabels: Record<string, string> = {
        Room: 'Yatak Odası',
        Living: 'Salon',
        Dining: 'Yemek Alanı',
        Kitchen: 'Mutfak',
        Bathroom: 'Banyo',
        Toilet: 'Tuvalet',
        Balcony: 'Balkon',
        Storage: 'Depo/Kiler'
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Görsel Galerisi */}
            <div className="grid grid-cols-4 gap-3 h-[300px] sm:h-[400px]">
                <div className="col-span-4 lg:col-span-3 rounded-2xl overflow-hidden border bg-muted relative group">
                    {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/20">
                            <Home className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                    )}
                    <Badge className="absolute top-4 left-4 bg-primary px-4 py-1.5 text-[14px] font-bold shadow-xl border-none">
                        {property.roomType} Plan
                    </Badge>
                </div>
                <div className="hidden lg:flex col-span-1 flex-col gap-3">
                    {[1, 2, 3].map((idx) => (
                        <div key={idx} className="flex-1 rounded-xl overflow-hidden border bg-muted relative">
                            {property.images && property.images[idx] ? (
                                <img src={property.images[idx]} alt={`Sub ${idx}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <Home className="w-6 h-6" />
                                </div>
                            )}
                            {idx === 3 && property.images && property.images.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                                    +{property.images.length - 3}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sol Taraf: Açıklama ve Detaylar */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Building2 size={18} />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Gayrimenkul Kimliği</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-3 leading-tight">Mülk ID: #{property.id.toUpperCase()}</h2>
                        <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-xl border border-border/50">
                            <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <p className="text-sm font-medium leading-relaxed">{property.address}</p>
                        </div>
                    </div>

                    {/* Temel Özellikler Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        {[
                            { icon: <Ruler size={16} />, label: 'Net Alan', value: `${property.area} m²` },
                            { icon: <Calendar size={16} />, label: 'Yapım Yılı', value: property.buildYear },
                            { icon: <Users size={16} />, label: 'Kapasite', value: `${property.tenantCapacity} Kişi` },
                            { icon: <Layout size={16} />, label: 'Madri', value: property.roomType },
                            { icon: <Zap size={16} />, label: 'Deprem', value: property.quakeStandard === 'new' ? 'Yeni Standart' : property.quakeStandard === 'old' ? 'Eski Standart' : 'Grade 2/3' }
                        ].map((spec, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border/40 text-center gap-1 hover:border-primary/30 transition-colors shadow-sm">
                                <div className="text-primary mb-1">{spec.icon}</div>
                                <span className="text-[9px] text-muted-foreground uppercase font-extrabold tracking-wider">{spec.label}</span>
                                <span className="text-[13px] font-bold whitespace-nowrap">{spec.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Oda Detayları */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b border-border pb-2">
                            <DoorOpen size={16} className="text-primary" /> Plan ve Oda Detayları
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(roomCounts).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                                    <span className="text-sm font-medium text-muted-foreground">{roomLabels[type] || type}</span>
                                    <Badge variant="outline" className="bg-background font-bold text-primary border-primary/20">{count}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fiziksel İmkanlar */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b border-border pb-2">
                            <ShowerHead size={16} className="text-primary" /> Bina ve Daire İmkanları
                        </h4>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {property.features && property.features.length > 0 ? property.features.map(f => (
                                <Badge key={f} variant="secondary" className="px-3 py-1.5 font-semibold capitalize border border-border/50 bg-background hover:bg-muted transition-colors">
                                    {f.replace(/([A-Z])/g, ' $1').trim()}
                                </Badge>
                            )) : (
                                <p className="text-xs text-muted-foreground italic">İmkan belirtilmemiş.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: Envanter */}
                <div className="space-y-6">
                    <div className="bg-muted/20 rounded-2xl p-6 border border-border/50 space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b border-border pb-3">
                            <Package size={18} className="text-primary" /> Eşya Envanteri
                        </h4>
                        <div className="space-y-3">
                            {property.inventory && property.inventory.length > 0 ? property.inventory.map(item => (
                                <div key={item.id} className="flex items-start gap-4 p-3 bg-background rounded-xl border border-border/40 text-xs shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary/40 mt-1.5 animate-pulse shrink-0" />
                                    <div className="flex flex-col gap-1">
                                        <span className="font-extrabold text-[13px] text-foreground">{item.name}</span>
                                        <div className="flex flex-col gap-0.5 text-muted-foreground">
                                            <span>{item.brandModel || 'Genel Marka'}</span>
                                            <Badge className="w-fit mt-1 px-1.5 py-0 text-[9px] uppercase font-bold bg-muted text-muted-foreground border-none">
                                                {item.condition}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground italic py-4 text-center">Kayıtlı demirbaş bulunmuyor.</p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-border/60">
                            <div className="bg-primary/10 rounded-2xl p-5 flex items-center gap-4 border border-primary/20 shadow-inner">
                                <div className="p-3 bg-primary/20 rounded-xl">
                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Mülk Statüsü</span>
                                    <span className="text-base font-extrabold">Aktif & Hazır</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

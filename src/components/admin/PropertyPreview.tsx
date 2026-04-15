import { useState } from 'react';
import type { Property } from '../../store/usePropertyStore';
import { Badge } from '@/components/ui/badge';
import {
    Home, Ruler, Calendar, MapPin,
    Zap, DoorOpen, Package, ShowerHead,
    CheckCircle2, Building2, Users, Layout,
    ChevronLeft, ChevronRight
} from 'lucide-react';

interface PropertyPreviewProps {
    property: Property;
}

export const PropertyPreview = ({ property }: PropertyPreviewProps) => {
    const images = property.images ?? [];
    const [activeIndex, setActiveIndex] = useState(0);

    const prev = () => setActiveIndex(i => (i - 1 + images.length) % images.length);
    const next = () => setActiveIndex(i => (i + 1) % images.length);

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
        // gap-10 -> gap-16 yaparak genel boşluğu artırdık
        <div className="flex flex-col gap-10 pb-10">
            {/* Görsel Galerisi */}
            {/* Çoklu görsellerde layout kaymasını engellemek için yükseklik/aspect sabit */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
                {/* Ana görsel + navigasyon */}
                <div className="col-span-4 lg:col-span-3 rounded-2xl overflow-hidden border bg-muted relative group aspect-[16/9] lg:aspect-auto lg:h-[360px]">
                    {images.length > 0 ? (
                        <>
                            <img
                                key={activeIndex}
                                src={images[activeIndex]}
                                alt={`Görsel ${activeIndex + 1}`}
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                            {/* Önceki / Sonraki oklar */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={next}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    {/* Nokta göstergesi */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                        {images.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveIndex(i)}
                                                className={`w-2 h-2 rounded-full transition-all duration-200 ${i === activeIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/20">
                            <Home className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                    )}
                    <Badge className="absolute top-4 left-4 bg-primary px-4 py-1.5 text-[14px] font-bold shadow-xl border-none z-10">
                        {property.roomType} Plan
                    </Badge>
                    {images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                            {activeIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Küçük resimler – tıklanabilir */}
                <div className="hidden lg:flex col-span-1 flex-col gap-3 lg:h-[360px]">
                    {[0, 1, 2].map((idx) => (
                        <button
                            key={idx}
                            onClick={() => images[idx] && setActiveIndex(idx)}
                            className={`flex-1 rounded-xl overflow-hidden border bg-muted relative transition-all duration-200 ${activeIndex === idx
                                ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
                                : 'hover:border-primary/50 hover:scale-[1.01]'
                                } ${!images[idx] ? 'cursor-default opacity-40' : 'cursor-pointer'}`}
                        >
                            {images[idx] ? (
                                <img src={images[idx]} alt={`Küçük ${idx + 1}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Home className="w-6 h-6 text-muted-foreground/50" />
                                </div>
                            )}
                            {/* Son thumbnail'da "+N daha" overlay */}
                            {idx === 2 && images.length > 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                                    +{images.length - 3}
                                </div>
                            )}
                        </button>
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
                                        {item.description ? (
                                            <div className="text-muted-foreground text-xs leading-snug">
                                                {item.description}
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground text-xs italic">Açıklama eklenmemiş.</div>
                                        )}
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

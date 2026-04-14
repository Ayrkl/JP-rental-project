import { useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { PropertyMap } from './PropertyMap';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PropertyForm } from './PropertyForm';
import { MapPin, Info, Home } from 'lucide-react';

export const MapPage = () => {
    const properties = usePropertyStore(state => state.properties);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Emlak Haritası</h1>
                    <p className="text-muted-foreground text-sm mt-1">Tüm mülklerin lokasyonlarını interaktif harita üzerinden takip edin.</p>
                </div>
                <div className="flex items-center gap-4 bg-muted/40 p-2 rounded-lg border border-border">
                    <div className="flex items-center gap-2 px-3 border-r border-border">
                        <Home className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">{properties.length} Mülk</span>
                    </div>
                    <div className="flex items-center gap-2 px-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-muted-foreground">Şehir: Tokyo</span>
                    </div>
                </div>
            </div>


            <CardContent className="h-full p-0">
                <PropertyMap properties={properties} onSelectProperty={setSelectedPropertyId} />
            </CardContent>


            <Dialog open={!!selectedPropertyId} onOpenChange={(open) => !open && setSelectedPropertyId(null)}>
                <DialogContent
                    className="sm:max-w-[850px] lg:max-w-[1600px] w-[95vw] bg-background border-border shadow-2xl sm:rounded-2xl max-h-[83vh] flex flex-col gap-0 p-0 overflow-hidden transition-all duration-300 [&>button]:z-50 [&>button]:right-6 [&>button]:top-6 [&>button]:bg-muted/50 [&>button]:p-2 [&>button]:rounded-full hover:[&>button]:bg-destructive hover:[&>button]:text-destructive-foreground"
                    style={{ left: 'calc(50% + (var(--sidebar-width, 230px) / 2))' }}
                >
                    <div className="px-6 md:px-8 py-5 border-b border-border bg-card/50 z-10 shrink-0">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Mülkü Görüntüle / Düzenle</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                                Harita üzerinden seçilen mülkün detaylarını güncelleyin.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="px-8 py-6 overflow-y-auto flex-1">
                        <PropertyForm propertyId={selectedPropertyId || undefined} onComplete={() => setSelectedPropertyId(null)} isModal={true} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

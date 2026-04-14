import { useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { PropertyMap } from './PropertyMap';
import { CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PropertyForm } from './PropertyForm';
import { PropertyPreview } from './PropertyPreview';
import { MapPin, Home, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MapPage = () => {
    const properties = usePropertyStore(state => state.properties);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const selectedProperty = properties.find(p => p.id === selectedPropertyId);

    const handleClose = () => {
        setSelectedPropertyId(null);
        setIsEditing(false);
    };

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

            <Dialog open={!!selectedPropertyId} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent
                    className="sm:max-w-[850px] lg:max-w-[1200px] w-[95vw] bg-background border-border shadow-2xl sm:rounded-3xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden transition-all duration-300 [&>button]:z-[2001] [&>button]:right-8 [&>button]:top-8 [&>button]:bg-muted/50 [&>button]:p-2 [&>button]:rounded-full hover:[&>button]:bg-destructive hover:[&>button]:text-destructive-foreground z-[2000]"
                    style={{ left: 'calc(50% + (var(--sidebar-width, 230px) / 2))' }}
                >
                    {!isEditing ? (
                        <>
                            <div className="px-10 py-10 overflow-y-auto flex-1">
                                {selectedProperty && <PropertyPreview property={selectedProperty} />}
                            </div>
                            <div className="px-10 py-5 bg-muted/30 border-t border-border flex justify-end gap-3 shrink-0">
                                <Button variant="outline" onClick={handleClose}>Kapat</Button>
                                <Button onClick={() => setIsEditing(true)}>
                                    <Pencil className="w-4 h-4 mr-2" /> Düzenle
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="px-8 py-5 border-b border-border bg-card/50 z-10 shrink-0">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Mülkü Düzenle</DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                                        Mülk bilgilerini ve konumunu güncelleyin.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <div className="px-8 py-6 overflow-y-auto flex-1">
                                <PropertyForm propertyId={selectedPropertyId || undefined} onComplete={handleClose} isModal={true} />
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

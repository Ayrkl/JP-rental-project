import { useMemo, useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useContractStore } from './useContractStore';
import { PropertyMap } from './PropertyMap';
import { CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PropertyForm } from './PropertyForm';
import { PropertyPreview } from './PropertyPreview';
import { MapPin, Home, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export const MapPage = () => {
    const properties = usePropertyStore(state => state.properties);
    const contracts = useContractStore(state => state.contracts);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation('map');

    const selectedProperty = properties.find(p => p.id === selectedPropertyId);

    const contractStatuses = useMemo(() => {
        const map = new Map();
        contracts
            .filter(c => c.status === 'Taslak' || c.status === 'Aktif' || c.status === 'Sona Erdi' || c.status === 'Feshedildi')
            .forEach(c => {
                map.set(c.propertyId, c.status);
            });
        return map;
    }, [contracts]);

    const handleClose = () => {
        setSelectedPropertyId(null);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground text-sm mt-1">{t('subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 bg-muted/40 p-2 rounded-lg border border-border">
                        <div className="flex items-center gap-2 px-3 border-r border-border">
                            <Home className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">{t('stats.properties', { count: properties.length })}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-muted-foreground">{t('stats.city')}</span>
                        </div>
                    </div>

                    {/* Pin Renk Sistemi Legend */}
                    <div className="bg-muted/40 p-3 rounded-lg border border-border">
                        <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">{t('pinLegend.title')}</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                                <span>{t('pinLegend.blue')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                                <span>{t('pinLegend.green')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
                                <span>{t('pinLegend.orange')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ec4899' }}></div>
                                <span>{t('pinLegend.red')}</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6b7280' }}></div>
                                <span>{t('pinLegend.gray')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="h-full p-0">
                <PropertyMap properties={properties} onSelectProperty={setSelectedPropertyId} contractStatuses={contractStatuses} />
            </CardContent>

            <Dialog open={!!selectedPropertyId} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent
                    className="sm:max-w-[900px] lg:max-w-[1600px] w-[90vw] bg-background border-border shadow-2xl sm:rounded-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden transition-all duration-300 [&>button]:z-[2001] [&>button]:right-8 [&>button]:top-8 [&>button]:bg-muted/50 [&>button]:p-2 [&>button]:rounded-full hover:[&>button]:bg-destructive hover:[&>button]:text-destructive-foreground z-[2000]"
                >
                    {!isEditing ? (
                        <>
                            <div className="px-8 py-6 overflow-y-auto flex-1">
                                {selectedProperty && <PropertyPreview property={selectedProperty} />}
                            </div>
                            <div className="px-10 py-5 bg-muted/30 border-t border-border flex justify-end gap-3 shrink-0">
                                <Button variant="outline" onClick={handleClose}>{t('dialogs.close')}</Button>
                                <Button onClick={() => setIsEditing(true)}>
                                    <Pencil className="w-4 h-4 mr-2" /> {t('dialogs.edit')}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="px-8 py-5 border-b border-border bg-card/50 z-10 shrink-0">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">{t('dialogs.editTitle')}</DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                                        {t('dialogs.editDescription')}
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Building2, Calendar, MapPin, Pencil } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { PropertyForm } from './PropertyForm';
import { PropertyPreview } from './PropertyPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const Dashboard = () => {
    const properties = usePropertyStore(state => state.properties);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [previewPropertyId, setPreviewPropertyId] = useState<string | null>(null);
    const [gridCols, setGridCols] = useState<number>(3);

    const gridClassMap: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    };

    const previewProperty = properties.find(p => p.id === previewPropertyId);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center gap-2.5 pb-2 space-y-0 text-muted-foreground">
                        <Home className="w-4 h-4 text-primary" />
                        <CardTitle className="text-sm font-medium">Toplam Mülk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{properties.length}</div>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors text-muted-foreground">
                    <CardHeader className="flex flex-row items-center gap-2.5 pb-2 space-y-0">
                        <Building2 className="w-4 h-4 text-primary" />
                        <CardTitle className="text-sm font-medium">Aktif Kiracı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors text-muted-foreground">
                    <CardHeader className="flex flex-row items-center gap-2.5 pb-2 space-y-0">
                        <Calendar className="w-4 h-4 text-primary" />
                        <CardTitle className="text-sm font-medium">Boşta Ev</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold tracking-tight">Mülk Portföyü</h2>

                        <div className="hidden sm:flex items-center bg-muted/40 p-1 rounded-lg border border-border h-8">
                            {[1, 2, 3, 4, 5].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setGridCols(num)}
                                    className={`w-8 h-full flex items-center justify-center rounded-md text-xs font-bold transition-all ${gridCols === num ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button asChild>
                        <Link to="/admin/properties/new">
                            <Home className="w-4 h-4 mr-2" /> Yeni Ekle
                        </Link>
                    </Button>
                </div>

                {properties.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <Home className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Sistemde Mülk Yok</h3>
                        <p className="text-muted-foreground mb-6 max-w-[400px]">Henüz portföye bir mülk eklenmemiş. Lütfen yeni bir mülk tanımlayarak sistemi başlatın.</p>
                        <Button asChild>
                            <Link to="/admin/properties/new">Yeni Mülk Tanımla</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className={`grid gap-4 ${gridClassMap[gridCols]}`}>
                        {properties.map(p => (
                            <Card
                                key={p.id}
                                className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-md group"
                                onClick={() => setPreviewPropertyId(p.id)}
                            >
                                <CardContent className="p-4 flex gap-4">
                                    {p.images && p.images.length > 0 ? (
                                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border bg-muted group-hover:border-primary/30 transition-colors">
                                            <img src={p.images[0]} alt="Property" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0 border border-dashed">
                                            <Home className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <Building2 className="w-4 h-4 text-primary shrink-0" />
                                            <h4 className="font-semibold text-base truncate">Mülk #{p.id.toUpperCase()}</h4>
                                        </div>
                                        <p className="text-sm text-foreground/80 flex items-center gap-1.5 mb-1 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> {p.address}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" /> Yapım: {p.buildYear} • {p.area}m²
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 justify-between">
                                        <Badge variant="secondary" className="px-3 py-1 font-bold text-[10px] tracking-widest">{p.roomType}</Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPropertyId(p.id);
                                            }}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* DÜZENLEME MODALI */}
            <Dialog open={!!selectedPropertyId} onOpenChange={(open) => !open && setSelectedPropertyId(null)}>
                <DialogContent
                    className="sm:max-w-[850px] lg:max-w-[1600px] w-[95vw] bg-background border-border shadow-2xl sm:rounded-2xl max-h-[83vh] flex flex-col gap-0 p-0 overflow-hidden transition-all duration-300 [&>button]:z-[2001] [&>button]:right-6 [&>button]:top-6 [&>button]:bg-muted/50 [&>button]:p-2 [&>button]:rounded-full hover:[&>button]:bg-destructive hover:[&>button]:text-destructive-foreground z-[2000]"
                    style={{ left: 'calc(50% + (var(--sidebar-width, 230px) / 2))' }}
                >
                    <div className="px-6 md:px-8 py-5 border-b border-border bg-card/50 z-10 shrink-0">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Mülkü Düzenle</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                                Mülk verilerini, plan detaylarını ve görselleri güncelleyin.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="px-8 py-6 overflow-y-auto flex-1">
                        <PropertyForm propertyId={selectedPropertyId || undefined} onComplete={() => setSelectedPropertyId(null)} isModal={true} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* ÖNİZLEME MODALI */}
            <Dialog open={!!previewPropertyId} onOpenChange={(open) => !open && setPreviewPropertyId(null)}>
                <DialogContent
                    className="sm:max-w-[850px] lg:max-w-[1600px] w-[95vw] bg-background border-border shadow-2xl sm:rounded-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden transition-all duration-300 [&>button]:z-[2001] [&>button]:right-4 [&>button]:top-4 [&>button]:bg-black/60 [&>button]:p-2 [&>button]:rounded-full hover:[&>button]:bg-destructive hover:[&>button]:text-white z-[2000]"
                    style={{ left: 'calc(50% + (var(--sidebar-width, 230px) / 2))' }}
                >
                    <div className="px-8 py-6 overflow-y-auto flex-1">
                        {previewProperty && <PropertyPreview property={previewProperty} />}
                    </div>
                    <div className="px-10 py-4 bg-muted/30 border-t border-border flex justify-end gap-3 shrink-0">
                        <Button variant="outline" onClick={() => setPreviewPropertyId(null)}>Kapat</Button>
                        <Button onClick={() => {
                            const id = previewPropertyId;
                            setPreviewPropertyId(null);
                            setTimeout(() => setSelectedPropertyId(id), 100);
                        }}>
                            <Pencil className="w-4 h-4 mr-2" /> Düzenle
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
};

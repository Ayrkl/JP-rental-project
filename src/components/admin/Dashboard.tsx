import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Map, Home, Building2, Calendar, MapPin, Pencil } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { PropertyForm } from './PropertyForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const Dashboard = () => {
    const properties = usePropertyStore(state => state.properties);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Toplam Mülk</CardTitle>
                        <Home className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{properties.length}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+12%</span> geçen aydan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Aktif Kiracı</CardTitle>
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+8%</span> geçen aydan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Boşta Ev</CardTitle>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowDownRight className="w-3 h-3 text-rose-500 mr-1" />
                            <span className="text-rose-500 font-medium">-2%</span> geçen aydan
                        </p>
                    </CardContent>
                </Card>

                <Card className="flex items-center justify-center min-h-[120px] bg-muted/50 border-dashed">
                    <div className="text-center text-muted-foreground flex flex-col items-center">
                        <Map className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs font-medium">Harita Modülü Bekleniyor</p>
                    </div>
                </Card>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold tracking-tight">Son Eklenen Mülkler</h2>
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
                    <div className="grid gap-4 md:grid-cols-2">
                        {properties.map(p => (
                            <Card
                                key={p.id}
                                className="cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => setSelectedPropertyId(p.id)}
                            >
                                <CardContent className="p-4 flex gap-4">
                                    {p.images && p.images.length > 0 ? (
                                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border bg-muted">
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
                                        <p className="text-sm text-foreground flex items-center gap-1.5 mb-1 truncate">
                                            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> {p.address}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" /> Yapım: {p.buildYear} • Net: {p.area}m² {p.images && p.images.length > 1 && `• +${p.images.length - 1}`}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 justify-between">
                                        <Badge variant="secondary" className="px-3 py-1 font-bold text-sm tracking-widest">{p.roomType}</Badge>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); setSelectedPropertyId(p.id); }}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!selectedPropertyId} onOpenChange={(open) => !open && setSelectedPropertyId(null)}>
                <DialogContent className="max-w-5xl bg-background border-border shadow-2xl sm:rounded-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
                    {/* STICKY HEADER GÖRÜNÜMÜ */}
                    <div className="px-8 py-6 border-b border-border bg-card/50 z-10 shrink-0">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Mülkü Görüntüle / Düzenle</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                                Sistemde kayıtlı olan mülkün detaylarını, planını ve eşya envanterini güncelleyin.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* SCROLLABLE FORM ALANI */}
                    <div className="px-8 py-6 overflow-y-auto flex-1">
                        <PropertyForm propertyId={selectedPropertyId || undefined} onComplete={() => setSelectedPropertyId(null)} isModal={true} />
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
};

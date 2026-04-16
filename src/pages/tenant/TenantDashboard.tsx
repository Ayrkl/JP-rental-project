import { CreditCard, Calendar, FileText, Bell, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { icon: CreditCard, label: 'Güncel Borç' },
  { icon: Calendar, label: 'Sonraki Ödeme' },
  { icon: FileText, label: 'Belgelerim' },
  { icon: Bell, label: 'Bildirimler' },
];

export const TenantDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-emerald-100">Kiracı Paneli</h1>
        <p className="text-emerald-700 text-sm mt-1">Geliştirme Aşamasında</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(({ icon: Icon, label }) => (
          <Card key={label} className="border-emerald-900/40 bg-emerald-950/20">
            <CardHeader className="flex flex-row items-center gap-2.5 pb-2 space-y-0">
              <Icon className="w-4 h-4 text-emerald-500" />
              <CardTitle className="text-sm font-medium text-emerald-300">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-100">—</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3">
        <Info className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-400">
          Bu panel backend entegrasyonu tamamlandığında aktif olacak.
        </p>
      </div>
    </div>
  );
};

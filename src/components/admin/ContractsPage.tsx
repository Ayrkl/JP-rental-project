import { useMemo, useState } from 'react';
import { FileText, Plus, Trash2, User, CalendarDays, Wallet } from 'lucide-react';
import { useContractStore, type ContractStatus } from './useContractStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const initialForm = {
  propertyId: '',
  tenantName: '',
  tenantPhone: '',
  tenantEmail: '',
  startDate: '',
  endDate: '',
  monthlyRent: '',
  deposit: '',
  paymentDay: '1',
  status: 'Taslak' as ContractStatus,
  notes: '',
};

export const ContractsPage = () => {
  const properties = usePropertyStore((s) => s.properties);
  const { contracts, addContract, removeContract, updateContract } = useContractStore();
  const [form, setForm] = useState(initialForm);

  const contractsWithProperty = useMemo(
    () =>
      contracts.map((contract) => ({
        ...contract,
        property: properties.find((p) => p.id === contract.propertyId),
      })),
    [contracts, properties]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId) return;

    addContract({
      propertyId: form.propertyId,
      tenantName: form.tenantName.trim(),
      tenantPhone: form.tenantPhone.trim(),
      tenantEmail: form.tenantEmail.trim() || undefined,
      startDate: form.startDate,
      endDate: form.endDate,
      monthlyRent: Number(form.monthlyRent),
      deposit: Number(form.deposit),
      paymentDay: Number(form.paymentDay),
      status: form.status,
      notes: form.notes.trim() || undefined,
    });

    setForm(initialForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sözleşmeler</h1>
          <p className="text-sm text-muted-foreground mt-1">Mülke bağlı kira sözleşmelerini oluşturun ve yönetin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Yeni Sözleşme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Mülk</Label>
                <Select value={form.propertyId} onValueChange={(v) => setForm((prev) => ({ ...prev, propertyId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mülk seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        #{p.id.toUpperCase()} - {p.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kiracı Adı</Label>
                <Input
                  placeholder="Ad Soyad"
                  value={form.tenantName}
                  onChange={(e) => setForm((prev) => ({ ...prev, tenantName: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input
                    placeholder="090..."
                    value={form.tenantPhone}
                    onChange={(e) => setForm((prev) => ({ ...prev, tenantPhone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-posta</Label>
                  <Input
                    type="email"
                    placeholder="mail@ornek.com"
                    value={form.tenantEmail}
                    onChange={(e) => setForm((prev) => ({ ...prev, tenantEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Başlangıç</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bitiş</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Aylık Kira</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="120000"
                    value={form.monthlyRent}
                    onChange={(e) => setForm((prev) => ({ ...prev, monthlyRent: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Depozito</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="120000"
                    value={form.deposit}
                    onChange={(e) => setForm((prev) => ({ ...prev, deposit: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Ödeme Günü</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={form.paymentDay}
                    onChange={(e) => setForm((prev) => ({ ...prev, paymentDay: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Durum</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((prev) => ({ ...prev, status: v as ContractStatus }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Taslak">Taslak</SelectItem>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Sona Erdi">Sona Erdi</SelectItem>
                      <SelectItem value="Feshedildi">Feshedildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notlar</Label>
                <textarea
                  className="w-full min-h-[90px] rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Özel şartlar, ödeme notları..."
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full" disabled={properties.length === 0}>
                <Plus className="w-4 h-4 mr-2" /> Sözleşme Oluştur
              </Button>
              {properties.length === 0 && (
                <p className="text-xs text-muted-foreground">Önce en az bir mülk eklemeniz gerekir.</p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Sözleşme Listesi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contractsWithProperty.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz sözleşme yok. Soldan yeni sözleşme oluşturabilirsiniz.</p>
            ) : (
              contractsWithProperty.map((contract) => (
                <div key={contract.id} className="rounded-xl border border-border/60 p-4 bg-background/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-base">Sözleşme #{contract.id.toUpperCase()}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {contract.property ? contract.property.address : 'Mülk silinmiş veya bulunamadı'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={contract.status}
                        onValueChange={(v) =>
                          updateContract(contract.id, {
                            propertyId: contract.propertyId,
                            tenantName: contract.tenantName,
                            tenantPhone: contract.tenantPhone,
                            tenantEmail: contract.tenantEmail,
                            startDate: contract.startDate,
                            endDate: contract.endDate,
                            monthlyRent: contract.monthlyRent,
                            deposit: contract.deposit,
                            paymentDay: contract.paymentDay,
                            status: v as ContractStatus,
                            notes: contract.notes,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Taslak">Taslak</SelectItem>
                          <SelectItem value="Aktif">Aktif</SelectItem>
                          <SelectItem value="Sona Erdi">Sona Erdi</SelectItem>
                          <SelectItem value="Feshedildi">Feshedildi</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeContract(contract.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{contract.tenantName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {contract.startDate} - {contract.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                      <span>¥{contract.monthlyRent.toLocaleString()} / ay</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline">Depozito: ¥{contract.deposit.toLocaleString()}</Badge>
                    <Badge variant="outline">Ödeme Günü: {contract.paymentDay}</Badge>
                    {contract.tenantEmail && <Badge variant="secondary">{contract.tenantEmail}</Badge>}
                    <Badge>{contract.status}</Badge>
                  </div>

                  {contract.notes && <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{contract.notes}</p>}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

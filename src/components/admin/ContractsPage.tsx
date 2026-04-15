import { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, Plus, Trash2, User, CalendarDays, Wallet, Pencil, X, Phone, ChevronDown, Search } from 'lucide-react';
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
  countryCode: '+81',
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

type CountryCodeOption = {
  iso: string;
  code: string;
  name: string;
};

const COUNTRY_CODE_OPTIONS: CountryCodeOption[] = [
  { iso: 'AF', code: '+93', name: 'Afganistan' },
  { iso: 'AL', code: '+355', name: 'Arnavutluk' },
  { iso: 'DZ', code: '+213', name: 'Cezayir' },
  { iso: 'AD', code: '+376', name: 'Andorra' },
  { iso: 'AO', code: '+244', name: 'Angola' },
  { iso: 'AR', code: '+54', name: 'Arjantin' },
  { iso: 'AM', code: '+374', name: 'Ermenistan' },
  { iso: 'AT', code: '+43', name: 'Avusturya' },
  { iso: 'AZ', code: '+994', name: 'Azerbaycan' },
  { iso: 'BH', code: '+973', name: 'Bahreyn' },
  { iso: 'BD', code: '+880', name: 'Banglades' },
  { iso: 'BY', code: '+375', name: 'Belarus' },
  { iso: 'BA', code: '+387', name: 'Bosna Hersek' },
  { iso: 'BR', code: '+55', name: 'Brezilya' },
  { iso: 'BG', code: '+359', name: 'Bulgaristan' },
  { iso: 'KH', code: '+855', name: 'Kambocya' },
  { iso: 'CM', code: '+237', name: 'Kamerun' },
  { iso: 'CA', code: '+1', name: 'Kanada' },
  { iso: 'CL', code: '+56', name: 'Sili' },
  { iso: 'CO', code: '+57', name: 'Kolombiya' },
  { iso: 'CR', code: '+506', name: 'Kosta Rika' },
  { iso: 'HR', code: '+385', name: 'Hirvatistan' },
  { iso: 'CU', code: '+53', name: 'Kuba' },
  { iso: 'CY', code: '+357', name: 'Kibris' },
  { iso: 'CZ', code: '+420', name: 'Cekya' },
  { iso: 'EG', code: '+20', name: 'Misir' },
  { iso: 'EE', code: '+372', name: 'Estonya' },
  { iso: 'ET', code: '+251', name: 'Etiyopya' },
  { iso: 'FI', code: '+358', name: 'Finlandiya' },
  { iso: 'GE', code: '+995', name: 'Gurcistan' },
  { iso: 'GH', code: '+233', name: 'Gana' },
  { iso: 'HK', code: '+852', name: 'Hong Kong' },
  { iso: 'HU', code: '+36', name: 'Macaristan' },
  { iso: 'IS', code: '+354', name: 'Izlanda' },
  { iso: 'ID', code: '+62', name: 'Endonezya' },
  { iso: 'IR', code: '+98', name: 'Iran' },
  { iso: 'IQ', code: '+964', name: 'Irak' },
  { iso: 'IE', code: '+353', name: 'Irlanda' },
  { iso: 'IL', code: '+972', name: 'Israil' },
  { iso: 'JP', code: '+81', name: 'Japonya' },
  { iso: 'TR', code: '+90', name: 'Turkiye' },
  { iso: 'US', code: '+1', name: 'ABD/Kanada' },
  { iso: 'GB', code: '+44', name: 'Birlesik Krallik' },
  { iso: 'DE', code: '+49', name: 'Almanya' },
  { iso: 'FR', code: '+33', name: 'Fransa' },
  { iso: 'IT', code: '+39', name: 'Italya' },
  { iso: 'ES', code: '+34', name: 'Ispanya' },
  { iso: 'NL', code: '+31', name: 'Hollanda' },
  { iso: 'BE', code: '+32', name: 'Belcika' },
  { iso: 'SE', code: '+46', name: 'Isvec' },
  { iso: 'NO', code: '+47', name: 'Norvec' },
  { iso: 'DK', code: '+45', name: 'Danimarka' },
  { iso: 'PL', code: '+48', name: 'Polonya' },
  { iso: 'PT', code: '+351', name: 'Portekiz' },
  { iso: 'GR', code: '+30', name: 'Yunanistan' },
  { iso: 'AE', code: '+971', name: 'Birlesik Arap Emirlikleri' },
  { iso: 'SA', code: '+966', name: 'Suudi Arabistan' },
  { iso: 'IN', code: '+91', name: 'Hindistan' },
  { iso: 'CN', code: '+86', name: 'Cin' },
  { iso: 'KR', code: '+82', name: 'Guney Kore' },
  { iso: 'TH', code: '+66', name: 'Tayland' },
  { iso: 'SG', code: '+65', name: 'Singapur' },
  { iso: 'AU', code: '+61', name: 'Avustralya' },
  { iso: 'JO', code: '+962', name: 'Urdun' },
  { iso: 'KZ', code: '+7', name: 'Kazakistan' },
  { iso: 'KE', code: '+254', name: 'Kenya' },
  { iso: 'KW', code: '+965', name: 'Kuveyt' },
  { iso: 'KG', code: '+996', name: 'Kirgizistan' },
  { iso: 'LA', code: '+856', name: 'Laos' },
  { iso: 'LV', code: '+371', name: 'Letonya' },
  { iso: 'LB', code: '+961', name: 'Luban' },
  { iso: 'LY', code: '+218', name: 'Libya' },
  { iso: 'LT', code: '+370', name: 'Litvanya' },
  { iso: 'LU', code: '+352', name: 'Luksemburg' },
  { iso: 'MO', code: '+853', name: 'Makao' },
  { iso: 'MK', code: '+389', name: 'Kuzey Makedonya' },
  { iso: 'MY', code: '+60', name: 'Malezya' },
  { iso: 'MX', code: '+52', name: 'Meksika' },
  { iso: 'MD', code: '+373', name: 'Moldova' },
  { iso: 'MN', code: '+976', name: 'Mogolistan' },
  { iso: 'ME', code: '+382', name: 'Karadag' },
  { iso: 'MA', code: '+212', name: 'Fas' },
  { iso: 'NP', code: '+977', name: 'Nepal' },
  { iso: 'NZ', code: '+64', name: 'Yeni Zelanda' },
  { iso: 'NG', code: '+234', name: 'Nijerya' },
  { iso: 'PK', code: '+92', name: 'Pakistan' },
  { iso: 'PA', code: '+507', name: 'Panama' },
  { iso: 'PE', code: '+51', name: 'Peru' },
  { iso: 'PH', code: '+63', name: 'Filipinler' },
  { iso: 'QA', code: '+974', name: 'Katar' },
  { iso: 'RO', code: '+40', name: 'Romanya' },
  { iso: 'RU', code: '+7', name: 'Rusya' },
  { iso: 'RS', code: '+381', name: 'Sirbistan' },
  { iso: 'SK', code: '+421', name: 'Slovakya' },
  { iso: 'SI', code: '+386', name: 'Slovenya' },
  { iso: 'ZA', code: '+27', name: 'Guney Afrika' },
  { iso: 'LK', code: '+94', name: 'Sri Lanka' },
  { iso: 'CH', code: '+41', name: 'Isvicre' },
  { iso: 'TW', code: '+886', name: 'Tayvan' },
  { iso: 'TJ', code: '+992', name: 'Tacikistan' },
  { iso: 'TN', code: '+216', name: 'Tunus' },
  { iso: 'TM', code: '+993', name: 'Turkmenistan' },
  { iso: 'UA', code: '+380', name: 'Ukrayna' },
  { iso: 'UY', code: '+598', name: 'Uruguay' },
  { iso: 'UZ', code: '+998', name: 'Ozbekistan' },
  { iso: 'VE', code: '+58', name: 'Venezuela' },
  { iso: 'VN', code: '+84', name: 'Vietnam' },
  { iso: 'YE', code: '+967', name: 'Yemen' },
  { iso: 'ZW', code: '+263', name: 'Zimbabve' },
];

export const ContractsPage = () => {
  const properties = usePropertyStore((s) => s.properties);
  const { contracts, addContract, removeContract, updateContract } = useContractStore();
  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState<'pending' | 'contracted'>('pending');
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  const contractsWithProperty = useMemo(
    () =>
      contracts.map((contract) => ({
        ...contract,
        property: properties.find((p) => p.id === contract.propertyId),
      })),
    [contracts, properties]
  );

  const occupiedPropertyIds = useMemo(
    () =>
      new Set(
        contracts
          .filter((c) => c.status === 'Taslak' || c.status === 'Aktif')
          .map((c) => c.propertyId)
      ),
    [contracts]
  );

  const pendingProperties = useMemo(
    () => properties.filter((p) => !occupiedPropertyIds.has(p.id)),
    [properties, occupiedPropertyIds]
  );

  const selectedCountry = useMemo(
    () => COUNTRY_CODE_OPTIONS.find((c) => c.code === form.countryCode),
    [form.countryCode]
  );

  const filteredCountryOptions = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRY_CODE_OPTIONS;
    return COUNTRY_CODE_OPTIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.includes(q) || c.iso.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const getPhoneRule = (countryCode: string) => {
    const rules: Record<string, { min: number; max: number; example: string }> = {
      '+81': { min: 9, max: 10, example: '9012345678' },
      '+90': { min: 10, max: 10, example: '5321234567' },
      '+1': { min: 10, max: 10, example: '2125551234' },
      '+44': { min: 10, max: 10, example: '7911123456' },
      '+49': { min: 10, max: 11, example: '15123456789' },
      '+33': { min: 9, max: 9, example: '612345678' },
      '+39': { min: 9, max: 10, example: '3123456789' },
      '+34': { min: 9, max: 9, example: '612345678' },
      '+86': { min: 11, max: 11, example: '13812345678' },
      '+82': { min: 9, max: 10, example: '1012345678' },
      '+91': { min: 10, max: 10, example: '9876543210' },
      '+7': { min: 10, max: 10, example: '9123456789' },
    };

    return rules[countryCode] ?? { min: 6, max: 15, example: '123456789' };
  };

  const phoneRule = useMemo(() => getPhoneRule(form.countryCode), [form.countryCode]);

  const buildAutoPattern = (targetLength: number) => {
    if (targetLength <= 3) return [targetLength];
    if (targetLength === 4) return [2, 2];
    if (targetLength === 5) return [3, 2];
    if (targetLength === 6) return [3, 3];
    if (targetLength === 7) return [3, 2, 2];
    if (targetLength === 8) return [4, 4];
    if (targetLength === 9) return [3, 3, 3];
    if (targetLength === 10) return [3, 3, 2, 2];
    if (targetLength === 11) return [3, 4, 4];

    const pattern: number[] = [];
    let remain = targetLength;
    while (remain > 4) {
      pattern.push(3);
      remain -= 3;
    }
    pattern.push(remain);
    return pattern;
  };

  const formatPhoneByCountry = (countryCode: string, digits: string) => {
    const rule = getPhoneRule(countryCode);
    const pattern = buildAutoPattern(Math.max(digits.length, rule.min));
    const chunks: string[] = [];
    let i = 0;
    for (const size of pattern) {
      if (i >= digits.length) break;
      chunks.push(digits.slice(i, i + size));
      i += size;
    }
    if (i < digits.length) chunks.push(digits.slice(i));
    return chunks.join(' ');
  };

  const phoneDisplayValue = useMemo(
    () => formatPhoneByCountry(form.countryCode, form.tenantPhone),
    [form.countryCode, form.tenantPhone]
  );

  const customCountryCode = useMemo(() => {
    const q = countrySearch.trim();
    return /^\+\d{1,4}$/.test(q) ? q : '';
  }, [countrySearch]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!countryDropdownRef.current) return;
      if (!countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const startEdit = (contractId: string) => {
    const c = contracts.find((x) => x.id === contractId);
    if (!c) return;
    const phoneMatch = c.tenantPhone.trim().match(/^(\+\d{1,4})\s*(.*)$/);
    setEditingContractId(contractId);
    setForm({
      propertyId: c.propertyId,
      tenantName: c.tenantName,
      countryCode: phoneMatch?.[1] ?? '+81',
      tenantPhone: (phoneMatch?.[2] ?? c.tenantPhone).replace(/\D/g, ''),
      tenantEmail: c.tenantEmail ?? '',
      startDate: c.startDate,
      endDate: c.endDate,
      monthlyRent: String(c.monthlyRent),
      deposit: String(c.deposit),
      paymentDay: String(c.paymentDay),
      status: c.status,
      notes: c.notes ?? '',
    });
    setActiveTab('pending');
    setPhoneError('');
  };

  const resetForm = () => {
    setEditingContractId(null);
    setForm(initialForm);
    setCountrySearch('');
    setCountryDropdownOpen(false);
    setPhoneError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId) return;

    const digitCount = form.tenantPhone.replace(/\D/g, '').length;
    if (digitCount < phoneRule.min || digitCount > phoneRule.max) {
      setPhoneError(`Bu ulke kodu icin numara ${phoneRule.min}-${phoneRule.max} hane olmali.`);
      return;
    }

    const payload = {
      propertyId: form.propertyId,
      tenantName: form.tenantName.trim(),
      tenantPhone: `${form.countryCode} ${form.tenantPhone.trim()}`.trim(),
      tenantEmail: form.tenantEmail.trim() || undefined,
      startDate: form.startDate,
      endDate: form.endDate,
      monthlyRent: Number(form.monthlyRent),
      deposit: Number(form.deposit),
      paymentDay: Number(form.paymentDay),
      status: form.status,
      notes: form.notes.trim() || undefined,
    };

    if (editingContractId) {
      updateContract(editingContractId, payload);
    } else {
      addContract(payload);
    }

    resetForm();
    setActiveTab('contracted');
  };

  const normalizePhone = (raw: string) => {
    // Numara alani: sadece rakam, secili ulke koduna gore max hane
    const digitsOnly = raw.replace(/\D/g, '');
    return digitsOnly.slice(0, phoneRule.max);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sözleşmeler</h1>
          <p className="text-sm text-muted-foreground mt-1">Mülke bağlı kira sözleşmelerini oluşturun ve yönetin.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          type="button"
          variant={activeTab === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('pending')}
        >
          Sözleşme Bekleyen Mülkler
        </Button>
        <Button
          type="button"
          variant={activeTab === 'contracted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('contracted')}
        >
          Sözleşmeli Mülkler
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> {editingContractId ? 'Sözleşme Düzenle' : 'Yeni Sözleşme'}
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
                  <SelectContent position="popper" side="bottom" sideOffset={4}>
                    {(editingContractId ? properties : pendingProperties).map((p) => (
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

              <div className="space-y-2">
                <Label>Telefon Numarasi</Label>
                <div className="flex items-start gap-2">
                  <div ref={countryDropdownRef} className="relative w-[190px] shrink-0">
                    <button
                      type="button"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-left text-sm flex items-center justify-between hover:bg-accent/40 transition-colors"
                      onClick={() => setCountryDropdownOpen((prev) => !prev)}
                    >
                      <span className="truncate">
                        {selectedCountry ? `${selectedCountry.iso} ${selectedCountry.code}` : form.countryCode}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
                    </button>

                    {countryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-[300px] rounded-md border border-border bg-popover shadow-xl z-50">
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Ulke, kod veya ISO ara..."
                              className="pl-8 h-9"
                            />
                          </div>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto p-1">
                          {customCountryCode && !COUNTRY_CODE_OPTIONS.some((c) => c.code === customCountryCode) && (
                            <button
                              type="button"
                              className="w-full text-left px-2 py-2 rounded-md text-sm hover:bg-accent/60 border border-dashed border-border mb-1"
                              onClick={() => {
                                setForm((prev) => ({ ...prev, countryCode: customCountryCode }));
                                setCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                            >
                              Ozel kodu kullan: {customCountryCode}
                            </button>
                          )}
                          {filteredCountryOptions.length === 0 ? (
                            <p className="text-xs text-muted-foreground px-2 py-3">Sonuc bulunamadi.</p>
                          ) : (
                            filteredCountryOptions.map((country) => (
                              <button
                                key={`${country.iso}-${country.code}`}
                                type="button"
                                className={`w-full text-left px-2 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                                  form.countryCode === country.code ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60'
                                }`}
                                onClick={() => {
                                  setForm((prev) => ({ ...prev, countryCode: country.code }));
                                  setCountryDropdownOpen(false);
                                  setCountrySearch('');
                                  setPhoneError('');
                                }}
                              >
                                <span className="truncate">
                                  {country.iso} {country.code} {country.name}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder={phoneRule.example}
                      value={phoneDisplayValue}
                      onChange={(e) => {
                        setPhoneError('');
                        setForm((prev) => ({ ...prev, tenantPhone: normalizePhone(e.target.value) }));
                      }}
                      required
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Ulke koduna gore {phoneRule.min}-{phoneRule.max} hane numara girin.
                </p>
                {phoneError && <p className="text-[11px] text-destructive">{phoneError}</p>}
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
                    <SelectContent position="popper" side="bottom" sideOffset={4}>
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
                <Plus className="w-4 h-4 mr-2" /> {editingContractId ? 'Değişiklikleri Kaydet' : 'Sözleşme Oluştur'}
              </Button>
              {editingContractId && (
                <Button type="button" variant="outline" className="w-full" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" /> Düzenlemeyi İptal Et
                </Button>
              )}
              {properties.length === 0 && <p className="text-xs text-muted-foreground">Önce en az bir mülk eklemeniz gerekir.</p>}
              {!editingContractId && properties.length > 0 && pendingProperties.length === 0 && (
                <p className="text-xs text-muted-foreground">Tüm mülklerde aktif/taslak sözleşme var. Yeni sözleşme için önce birini tamamlayın.</p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> {activeTab === 'pending' ? 'Sözleşme Bekleyen Mülkler' : 'Sözleşmeli Mülkler'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTab === 'pending' ? (
              pendingProperties.length === 0 ? (
                <p className="text-sm text-muted-foreground">Bekleyen mülk yok. Tüm mülkler sözleşmeli görünüyor.</p>
              ) : (
                pendingProperties.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border/60 p-4 bg-background/60">
                    <h3 className="font-semibold text-base">Mülk #{p.id.toUpperCase()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{p.address}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{p.roomType}</Badge>
                      <Badge variant="outline">{p.area} m²</Badge>
                      <Badge>Sözleşme Bekliyor</Badge>
                    </div>
                  </div>
                ))
              )
            ) : (
              contractsWithProperty.length === 0 ? (
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        onClick={() => startEdit(contract.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
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
                        <SelectContent position="popper" side="bottom" sideOffset={4}>
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
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{contract.tenantPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {contract.startDate} - {contract.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-3">
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
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

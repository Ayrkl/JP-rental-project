# Tasarım Dokümanı: Lokalizasyon Sistemi

## Genel Bakış

Bu doküman, Edusama Rental yönetim paneline eklenecek çok dilli lokalizasyon sisteminin teknik tasarımını tanımlar. Sistem `i18next` + `react-i18next` üzerine inşa edilecek; JSON tabanlı dil paketleri, TypeScript tip güvenliği ve header'da dil seçici bileşeni içerecektir.

---

## Mimari

```
src/
├── i18n/
│   ├── index.ts                  # i18next init konfigürasyonu
│   ├── types.ts                  # TypeScript module augmentation
│   ├── config.ts                 # SUPPORTED_LANGUAGES sabiti
│   └── locales/
│       ├── tr/
│       │   ├── common.json
│       │   ├── navigation.json
│       │   ├── dashboard.json
│       │   ├── properties.json
│       │   ├── contracts.json
│       │   ├── map.json
│       │   └── validation.json
│       └── en/
│           ├── common.json
│           ├── navigation.json
│           ├── dashboard.json
│           ├── properties.json
│           ├── contracts.json
│           ├── map.json
│           └── validation.json
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx       # Dil seçici entegrasyonu
│   │   ├── Dashboard.tsx         # useTranslation entegrasyonu
│   │   ├── ContractsPage.tsx     # useTranslation entegrasyonu
│   │   ├── PropertyForm.tsx      # useTranslation entegrasyonu
│   │   └── MapPage.tsx           # useTranslation entegrasyonu
│   └── ui/
│       └── LanguageSwitcher.tsx  # Yeni bileşen
└── main.tsx                      # i18n import
```

---

## Bağımlılıklar

`i18next` ve `react-i18next` paketleri kurulacak:

```bash
npm install i18next react-i18next
```

---

## i18next Konfigürasyonu (`src/i18n/index.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES, NAMESPACES } from './config';

// Dil paketlerini statik import
import trCommon from './locales/tr/common.json';
import trNavigation from './locales/tr/navigation.json';
import trDashboard from './locales/tr/dashboard.json';
import trProperties from './locales/tr/properties.json';
import trContracts from './locales/tr/contracts.json';
import trMap from './locales/tr/map.json';
import trValidation from './locales/tr/validation.json';

import enCommon from './locales/en/common.json';
// ... diğer en paketleri

const savedLang = localStorage.getItem('i18n-lang');
const browserLang = navigator.language.split('-')[0];
const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);
const detectedLang = supportedCodes.includes(savedLang ?? '')
  ? savedLang!
  : supportedCodes.includes(browserLang)
  ? browserLang
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    tr: { common: trCommon, navigation: trNavigation, /* ... */ },
    en: { common: enCommon, /* ... */ },
  },
  lng: detectedLang,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: NAMESPACES,
  interpolation: { escapeValue: false },
  missingKeyHandler: import.meta.env.DEV
    ? (lng, ns, key) => console.warn(`[i18n] Missing key: ${ns}:${key} (${lng})`)
    : undefined,
});

export default i18n;
```

---

## Dil Konfigürasyonu (`src/i18n/config.ts`)

```typescript
export const NAMESPACES = [
  'common', 'navigation', 'dashboard', 'properties', 'contracts', 'map', 'validation'
] as const;

export type Namespace = typeof NAMESPACES[number];

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  // Yeni dil eklemek için buraya satır ekle:
  // { code: 'ja', label: '日本語', flag: '🇯🇵' },
  // { code: 'ko', label: '한국어', flag: '🇰🇷' },
] as const;

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
```

---

## TypeScript Tip Güvenliği (`src/i18n/types.ts`)

```typescript
import 'i18next';
import type trCommon from './locales/tr/common.json';
import type trNavigation from './locales/tr/navigation.json';
// ... diğerleri

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof trCommon;
      navigation: typeof trNavigation;
      dashboard: typeof trDashboard;
      properties: typeof trProperties;
      contracts: typeof trContracts;
      map: typeof trMap;
      validation: typeof trValidation;
    };
  }
}
```

Bu sayede `t('gecersiz.anahtar')` çağrısı derleme zamanında hata verir.

---

## Dil Seçici Bileşeni (`src/components/ui/LanguageSwitcher.tsx`)

```typescript
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18n-lang', code);
  };

  // Radix UI DropdownMenu ile render edilir
  // AdminLayout header'ında Bell ikonu ile avatar arasına yerleştirilir
};
```

---

## Namespace JSON Yapısı

### `common.json`
```json
{
  "save": "Kaydet",
  "cancel": "İptal",
  "edit": "Düzenle",
  "delete": "Sil",
  "close": "Kapat",
  "search": "Ara",
  "loading": "Yükleniyor...",
  "noData": "Veri yok",
  "add": "Ekle",
  "back": "Geri Dön",
  "confirm": "Onayla"
}
```

### `navigation.json`
```json
{
  "dashboard": "Kontrol Paneli",
  "properties": "Mülk Yönetimi",
  "map": "Harita",
  "contracts": "Sözleşmeler",
  "users": "Kullanıcılar ve Roller",
  "announcements": "Duyurular",
  "management": "Yönetim",
  "search": "Ara...",
  "centerManagement": "Merkez Yönetim"
}
```

### `dashboard.json`
```json
{
  "stats": {
    "totalProperties": "Toplam Mülk",
    "activeTenants": "Aktif Kiracı",
    "vacantHomes": "Boşta Ev"
  },
  "portfolio": {
    "title": "Mülk Portföyü",
    "addNew": "Yeni Ekle",
    "empty": {
      "title": "Sistemde Mülk Yok",
      "description": "Henüz portföye bir mülk eklenmemiş. Lütfen yeni bir mülk tanımlayarak sistemi başlatın.",
      "cta": "Yeni Mülk Tanımla"
    }
  },
  "dialogs": {
    "editTitle": "Mülkü Düzenle",
    "editDescription": "Mülk verilerini, plan detaylarını ve görselleri güncelleyin."
  }
}
```

### `contracts.json`
```json
{
  "title": "Sözleşmeler",
  "subtitle": "Mülke bağlı kira sözleşmelerini oluşturun ve yönetin.",
  "tabs": {
    "pending": "Sözleşme Bekleyen Mülkler",
    "contracted": "Sözleşmeli Mülkler"
  },
  "form": {
    "title": "Yeni Sözleşme",
    "editTitle": "Sözleşme Düzenle",
    "property": "Mülk",
    "propertyPlaceholder": "Mülk seçin...",
    "tenantName": "Kiracı Adı",
    "tenantNamePlaceholder": "Ad Soyad",
    "phone": "Telefon Numarası",
    "email": "E-posta",
    "startDate": "Başlangıç",
    "endDate": "Bitiş",
    "monthlyRent": "Aylık Kira",
    "deposit": "Depozito",
    "paymentDay": "Ödeme Günü",
    "status": "Durum",
    "notes": "Notlar",
    "notesPlaceholder": "Özel şartlar, ödeme notları...",
    "selectContractHint": "Düzenlemek için sağ taraftan bir sözleşme seçin."
  },
  "status": {
    "draft": "Taslak",
    "active": "Aktif",
    "expired": "Sona Erdi",
    "terminated": "Feshedildi"
  },
  "actions": {
    "create": "Sözleşme Oluştur",
    "saveChanges": "Değişiklikleri Kaydet",
    "cancelEdit": "Düzenlemeyi İptal Et"
  },
  "errors": {
    "noProperty": "Lütfen bir mülk seçin.",
    "noTenantName": "Kiracı adı zorunludur.",
    "noProperties": "Önce en az bir mülk eklemeniz gerekir.",
    "allOccupied": "Tüm mülklerde aktif/taslak sözleşme var. Yeni sözleşme için önce birini tamamlayın."
  },
  "list": {
    "property": "Mülk",
    "contract": "Sözleşme",
    "deletedProperty": "Mülk silinmiş veya bulunamadı",
    "archivedProperty": "(Arşiv/Eski) Mülk",
    "noPending": "Bekleyen mülk yok. Tüm mülkler sözleşmeli görünüyor.",
    "noContracts": "Henüz sözleşme yok. Soldan yeni sözleşme oluşturabilirsiniz.",
    "deposit": "Depozito",
    "paymentDay": "Ödeme Günü",
    "perMonth": "/ ay"
  }
}
```

### `properties.json`
```json
{
  "sections": {
    "basicInfo": "Temel Bilgiler",
    "roomPlanner": "Oda & Plan Çizicisi",
    "features": "Fiziksel İmkanlar",
    "inventory": "Eşya & Demirbaş Envanteri",
    "images": "Mülk Görselleri"
  },
  "fields": {
    "address": "Açık Adres",
    "addressPlaceholder": "Örn: Tokyo-to, Shibuya-ku...",
    "area": "Net Alan (m²)",
    "buildYear": "Yapım Yılı",
    "capacity": "Kişi Kapasitesi",
    "quakeStandard": "Deprem Sertifikası (耐震基準)",
    "remaining": "Kalan: {{count}}"
  },
  "rooms": {
    "Room": "Yatak Odası",
    "Living": "Salon",
    "Dining": "Yemek Alanı",
    "Kitchen": "Mutfak",
    "Bathroom": "Banyo",
    "Toilet": "Tuvalet",
    "Storage": "Depo/Kiler",
    "Balcony": "Balkon",
    "empty": "Henüz oda eklenmedi. Seçimlerinizi yukarıdan yapabilirsiniz.",
    "layoutLabel": "Japonya Mülk Planı (マドリ):",
    "undefined": "Tanımsız"
  },
  "featureList": {
    "internet": "Fiber İnternet",
    "elevator": "Asansör",
    "autolock": "Otomatik Kilit",
    "deliveryBox": "Kargo Kutusu",
    "parking": "Otopark Alanı",
    "intercom": "Kameralı Diyafon",
    "pets": "Evcil Hayvan İzni",
    "aircon": "Klima Alt Yapısı",
    "washlet": "Akıllı Tuvalet",
    "systemKitchen": "Ankastre Mutfak",
    "garbageStation": "7/24 Çöp İstasyonu",
    "balcony": "Özel Balkon"
  },
  "actions": {
    "addNew": "Yeni Mülkü Ekle",
    "saveChanges": "Değişiklikleri Kaydet",
    "added": "Eklendi",
    "updated": "Güncellendi",
    "back": "Geri Dön",
    "addItem": "Eşya Ekle"
  },
  "quakeOptions": {
    "old": "Eski Standart (旧耐震 - 1981 Öncesi)",
    "new": "Yeni Standart (新耐震 - 1981 Sonrası)",
    "grade2": "Grade 2 (耐震等級2)",
    "grade3": "Grade 3 (耐震等級3)"
  }
}
```

### `map.json`
```json
{
  "title": "Emlak Haritası",
  "subtitle": "Tüm mülklerin lokasyonlarını interaktif harita üzerinden takip edin.",
  "stats": {
    "properties": "{{count}} Mülk",
    "city": "Şehir: Tokyo"
  },
  "pinLegend": {
    "title": "Pin Renk Sistemi",
    "blue": "Mavi: Kiracılı/dolu",
    "green": "Yeşil: Müsait (boş)",
    "orange": "Turuncu: Ödeme gecikmiş",
    "red": "Kırmızı: Tahliye süreci aktif",
    "gray": "Gri: Bakımda"
  },
  "popup": {
    "property": "Mülk",
    "status": "Durum: {{status}}",
    "viewDetails": "Detayları Gör"
  },
  "locationPicker": {
    "selected": "Konum Seçildi: {{lat}}, {{lng}}",
    "hint": "Haritaya tıklayarak konumu işaretleyin",
    "resolving": "Adres Çözümleniyor..."
  }
}
```

### `validation.json`
```json
{
  "required": "Bu alan zorunludur.",
  "invalidEmail": "Geçerli bir e-posta adresi girin.",
  "phoneLength": "Ülke koduna göre {{min}}-{{max}} hane numara girin.",
  "minLength": "En az {{count}} karakter girilmelidir.",
  "maxLength": "En fazla {{count}} karakter girilebilir.",
  "invalidDate": "Geçerli bir tarih girin.",
  "endBeforeStart": "Bitiş tarihi başlangıç tarihinden önce olamaz.",
  "positiveNumber": "Sıfırdan büyük bir değer girin."
}
```

---

## Bileşen Entegrasyon Örüntüsü

### Tek namespace:
```typescript
const { t } = useTranslation('contracts');
// Kullanım:
<Label>{t('form.tenantName')}</Label>
```

### Çoklu namespace:
```typescript
const { t } = useTranslation(['contracts', 'common']);
// Kullanım:
<Button>{t('common:save')}</Button>
<Label>{t('form.tenantName')}</Label>
```

### Interpolasyon:
```typescript
t('properties:fields.remaining', { count: 45 })
// → "Kalan: 45"
```

---

## Dil Seçici Yerleşimi (AdminLayout)

```
Header: [Toggle] [Separator] [Breadcrumb]  ...  [Bell] [LanguageSwitcher] [Avatar]
```

`LanguageSwitcher` bileşeni `@radix-ui/react-dropdown-menu` kullanır, mevcut tasarım sistemiyle uyumludur.

---

## Yeni Dil Ekleme Adımları

1. `src/i18n/locales/{kod}/` dizini oluştur, 7 JSON dosyasını ekle
2. `src/i18n/config.ts` → `SUPPORTED_LANGUAGES` dizisine `{ code, label, flag }` ekle
3. `src/i18n/index.ts` → `resources` nesnesine yeni dil paketlerini import edip ekle
4. `src/i18n/types.ts` → Tip tanımları otomatik olarak `tr` paketini referans aldığından ek değişiklik gerekmez

Bileşenlerde **hiçbir değişiklik gerekmez**.

---

## Doğruluk Özellikleri (Correctness Properties)

1. **Round-trip key consistency**: `tr` ve `en` paketlerindeki tüm anahtarlar birebir eşleşmelidir — eksik anahtar olmamalıdır.
2. **Fallback guarantee**: Aktif dilde eksik anahtar varsa `en` fallback değeri gösterilmeli, uygulama hata fırlatmamalıdır.
3. **localStorage persistence**: Dil değiştirildiğinde `localStorage`'a yazılmalı, sayfa yenilendiğinde aynı dil yüklenmeli.
4. **No hardcoded strings**: Hiçbir bileşende kullanıcıya görünen Türkçe/İngilizce string literal kalmamalıdır.
5. **Type safety**: Geçersiz çeviri anahtarı kullanımı TypeScript derleme hatası üretmelidir.

# Görev Listesi: Lokalizasyon Sistemi

## Görevler

- [ ] 1. Paket kurulumu ve i18n altyapısı
  - [ ] 1.1 `i18next` ve `react-i18next` paketlerini kur
  - [ ] 1.2 `src/i18n/config.ts` dosyasını oluştur — `SUPPORTED_LANGUAGES` ve `NAMESPACES` sabitlerini tanımla
  - [ ] 1.3 `src/i18n/index.ts` dosyasını oluştur — i18next init konfigürasyonu, localStorage + tarayıcı dil tespiti, fallback `en`
  - [ ] 1.4 `src/main.tsx` dosyasına `import '@/i18n'` ekle

- [ ] 2. Türkçe dil paketleri (tr)
  - [ ] 2.1 `src/i18n/locales/tr/common.json` oluştur
  - [ ] 2.2 `src/i18n/locales/tr/navigation.json` oluştur
  - [ ] 2.3 `src/i18n/locales/tr/dashboard.json` oluştur
  - [ ] 2.4 `src/i18n/locales/tr/properties.json` oluştur
  - [ ] 2.5 `src/i18n/locales/tr/contracts.json` oluştur
  - [ ] 2.6 `src/i18n/locales/tr/map.json` oluştur
  - [ ] 2.7 `src/i18n/locales/tr/validation.json` oluştur

- [ ] 3. İngilizce dil paketleri (en)
  - [ ] 3.1 `src/i18n/locales/en/common.json` oluştur
  - [ ] 3.2 `src/i18n/locales/en/navigation.json` oluştur
  - [ ] 3.3 `src/i18n/locales/en/dashboard.json` oluştur
  - [ ] 3.4 `src/i18n/locales/en/properties.json` oluştur
  - [ ] 3.5 `src/i18n/locales/en/contracts.json` oluştur
  - [ ] 3.6 `src/i18n/locales/en/map.json` oluştur
  - [ ] 3.7 `src/i18n/locales/en/validation.json` oluştur

- [ ] 4. TypeScript tip güvenliği
  - [ ] 4.1 `src/i18n/types.ts` dosyasını oluştur — `i18next` module augmentation ile `tr` paketlerini tip kaynağı olarak tanımla

- [ ] 5. Dil Seçici bileşeni
  - [ ] 5.1 `src/components/ui/LanguageSwitcher.tsx` bileşenini oluştur — Radix UI DropdownMenu, `SUPPORTED_LANGUAGES` listesinden dinamik render, `localStorage` yazma
  - [ ] 5.2 `AdminLayout.tsx` header'ına `LanguageSwitcher` bileşenini Bell ikonu ile avatar arasına ekle

- [ ] 6. AdminLayout bileşeni entegrasyonu
  - [ ] 6.1 Sidebar navigasyon etiketlerini `navigation` namespace'inden `t()` ile render et
  - [ ] 6.2 Arama input placeholder'ını `t('navigation:search')` ile güncelle
  - [ ] 6.3 Breadcrumb fallback metnini `t('navigation:centerManagement')` ile güncelle
  - [ ] 6.4 Yönetim kategori başlığını `t('navigation:management')` ile güncelle

- [ ] 7. Dashboard bileşeni entegrasyonu
  - [ ] 7.1 İstatistik kartı başlıklarını (`dashboard` namespace) `t()` ile güncelle
  - [ ] 7.2 "Mülk Portföyü" başlığı ve "Yeni Ekle" butonunu `t()` ile güncelle
  - [ ] 7.3 Boş durum mesajlarını (title, description, CTA) `t()` ile güncelle
  - [ ] 7.4 Dialog başlık ve açıklama metinlerini `t()` ile güncelle

- [ ] 8. ContractsPage bileşeni entegrasyonu
  - [ ] 8.1 Sayfa başlığı ve alt başlığını `t()` ile güncelle
  - [ ] 8.2 Tab başlıklarını (`contracts:tabs`) `t()` ile güncelle
  - [ ] 8.3 Form etiketlerini ve placeholder metinlerini `t()` ile güncelle
  - [ ] 8.4 Durum seçeneklerini (`contracts:status`) `t()` ile güncelle
  - [ ] 8.5 Hata mesajlarını (`contracts:errors`) `t()` ile güncelle
  - [ ] 8.6 Buton metinlerini (`contracts:actions`) `t()` ile güncelle
  - [ ] 8.7 Liste metinlerini (boş durum, etiketler) `t()` ile güncelle
  - [ ] 8.8 Telefon validasyon metnini `validation:phoneLength` interpolasyonu ile güncelle

- [ ] 9. PropertyForm bileşeni entegrasyonu
  - [ ] 9.1 Bölüm başlıklarını (`properties:sections`) `t()` ile güncelle
  - [ ] 9.2 Alan etiketlerini ve placeholder metinlerini `t()` ile güncelle
  - [ ] 9.3 Oda tipi etiketlerini (`properties:rooms`) `t()` ile güncelle
  - [ ] 9.4 Özellik listesi etiket ve açıklamalarını (`properties:featureList`) `t()` ile güncelle
  - [ ] 9.5 Deprem sertifikası seçeneklerini (`properties:quakeOptions`) `t()` ile güncelle
  - [ ] 9.6 Buton metinlerini ve adres karakter sayacını interpolasyon ile güncelle
  - [ ] 9.7 Harita konum seçici metinlerini (`map:locationPicker`) `t()` ile güncelle

- [ ] 10. MapPage ve PropertyMap bileşeni entegrasyonu
  - [ ] 10.1 Sayfa başlığı ve açıklama metnini `t()` ile güncelle
  - [ ] 10.2 İstatistik etiketlerini (`map:stats`) interpolasyon ile güncelle
  - [ ] 10.3 Pin renk sistemi legend etiketlerini (`map:pinLegend`) `t()` ile güncelle
  - [ ] 10.4 Popup metinlerini (`map:popup`) `t()` ile güncelle

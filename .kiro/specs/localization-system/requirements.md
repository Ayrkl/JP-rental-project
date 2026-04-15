# Gereksinimler Dokümanı

## Giriş

Bu doküman, **Edusama Rental** yönetim paneline çok dilli lokalizasyon sistemi (i18n) eklenmesine yönelik gereksinimleri tanımlar. Sistem; Türkçe ve İngilizce ile başlayacak, Japonca ve Korece gibi ek dillerin kolayca entegre edilebileceği genişletilebilir bir yapıya sahip olacaktır. Kapsam; sidebar navigasyonu, dashboard, mülk yönetimi formu, sözleşmeler sayfası, harita sayfası, hata mesajları, form etiketleri, badge'ler ve bildirimler dahil tüm UI metinlerini içermektedir. Mevcut stack: React 19, TypeScript, Vite; `i18next` paketi zaten `package.json` bağımlılıklarında tanımlıdır.

---

## Sözlük

- **Lokalizasyon Sistemi (i18n System)**: Uygulamanın birden fazla dili desteklemesini sağlayan altyapı ve bileşenler bütünü.
- **Dil Paketi (Language Bundle)**: Belirli bir dile ait tüm çeviri anahtarlarını ve değerlerini içeren JSON dosyası.
- **Çeviri Anahtarı (Translation Key)**: Bir UI metnini dil bağımsız biçimde temsil eden noktalı-hiyerarşik string (örn. `contracts.form.tenantName`).
- **Aktif Dil (Active Language)**: Kullanıcının o an seçili tuttuğu ve UI'ın render ettiği dil kodu (örn. `tr`, `en`).
- **Dil Seçici (Language Switcher)**: Kullanıcının aktif dili değiştirebildiği UI bileşeni.
- **Namespace**: i18next'te çeviri anahtarlarını mantıksal gruplara ayıran yapı (örn. `common`, `contracts`, `properties`).
- **Fallback Dili (Fallback Language)**: Aktif dilde bir çeviri anahtarı bulunamadığında kullanılan yedek dil.
- **RTL**: Sağdan sola yazılan dil yönü (Right-to-Left).
- **i18next**: Proje bağımlılıklarında mevcut olan JavaScript lokalizasyon kütüphanesi.
- **react-i18next**: i18next'in React hook ve bileşen entegrasyonunu sağlayan paketi.

---

## Gereksinimler

### Gereksinim 1: i18next Altyapısının Kurulumu

**Kullanıcı Hikayesi:** Bir geliştirici olarak, i18next'in projeye doğru biçimde entegre edilmesini istiyorum; böylece tüm çeviri işlemleri merkezi ve tutarlı bir altyapı üzerinden yürütülsün.

#### Kabul Kriterleri

1. THE Lokalizasyon_Sistemi SHALL `i18next` ve `react-i18next` paketlerini kullanarak başlatma (init) konfigürasyonunu `src/i18n/index.ts` dosyasında tanımlamalıdır.
2. THE Lokalizasyon_Sistemi SHALL Türkçe (`tr`) ve İngilizce (`en`) dillerini başlangıç dilleri olarak desteklemelidir.
3. THE Lokalizasyon_Sistemi SHALL varsayılan (fallback) dil olarak İngilizce (`en`) kullanmalıdır.
4. WHEN uygulama ilk yüklendiğinde, THE Lokalizasyon_Sistemi SHALL kullanıcının tarayıcı dil tercihini (`navigator.language`) kontrol etmeli ve desteklenen bir dil ise aktif dil olarak ayarlamalıdır.
5. IF tarayıcı dili desteklenen diller arasında bulunmuyorsa, THEN THE Lokalizasyon_Sistemi SHALL fallback dili (İngilizce) aktif dil olarak kullanmalıdır.
6. THE Lokalizasyon_Sistemi SHALL dil paketlerini `src/i18n/locales/{dil_kodu}/` dizininde JSON formatında saklamalıdır.
7. THE Lokalizasyon_Sistemi SHALL namespace yapısını kullanarak çeviri anahtarlarını mantıksal gruplara (`common`, `navigation`, `dashboard`, `properties`, `contracts`, `map`, `validation`) ayırmalıdır.

---

### Gereksinim 2: Dil Paketi Yapısı ve Kapsam

**Kullanıcı Hikayesi:** Bir geliştirici olarak, tüm UI metinlerinin çeviri anahtarlarıyla yönetilmesini istiyorum; böylece hiçbir hardcoded metin UI bileşenlerinde kalmasın.

#### Kabul Kriterleri

1. THE Dil_Paketi SHALL `navigation` namespace'i altında sidebar menü öğelerini (Kontrol Paneli, Mülk Yönetimi, Harita, Sözleşmeler, Kullanıcılar ve Roller, Duyurular) içermelidir.
2. THE Dil_Paketi SHALL `dashboard` namespace'i altında Dashboard sayfasındaki tüm metinleri (Toplam Mülk, Aktif Kiracı, Boşta Ev, Mülk Portföyü, Yeni Ekle, Sistemde Mülk Yok vb.) içermelidir.
3. THE Dil_Paketi SHALL `contracts` namespace'i altında Sözleşmeler sayfasındaki tüm form etiketlerini, placeholder metinlerini, durum değerlerini (Taslak, Aktif, Sona Erdi, Feshedildi), hata mesajlarını ve buton metinlerini içermelidir.
4. THE Dil_Paketi SHALL `properties` namespace'i altında Mülk Formu'ndaki tüm bölüm başlıklarını, alan etiketlerini, oda tiplerini (Yatak Odası, Salon, Mutfak vb.), özellik listesini (Fiber İnternet, Asansör vb.) ve buton metinlerini içermelidir.
5. THE Dil_Paketi SHALL `map` namespace'i altında Harita sayfasındaki tüm metinleri (Emlak Haritası, pin renk sistemi açıklamaları, Mülk sayısı etiketi vb.) içermelidir.
6. THE Dil_Paketi SHALL `common` namespace'i altında tüm sayfalarda tekrar eden genel metinleri (Kaydet, İptal, Düzenle, Sil, Kapat, Ara, Yükleniyor, Veri yok vb.) içermelidir.
7. THE Dil_Paketi SHALL `validation` namespace'i altında form doğrulama hata mesajlarını içermelidir.
8. WHEN yeni bir dil eklenmek istendiğinde, THE Lokalizasyon_Sistemi SHALL yalnızca `src/i18n/locales/{yeni_dil_kodu}/` dizinine karşılık gelen JSON dosyalarının eklenmesi ve i18n konfigürasyonuna dil kodunun dahil edilmesiyle genişletilebilir olmalıdır.
9. FOR ALL çeviri anahtarları, THE Dil_Paketi SHALL Türkçe ve İngilizce dil paketlerinde birebir eşleşen anahtar yapısına sahip olmalıdır (round-trip property: `tr` anahtarı ↔ `en` anahtarı).

---

### Gereksinim 3: Bileşen Entegrasyonu

**Kullanıcı Hikayesi:** Bir geliştirici olarak, mevcut tüm React bileşenlerindeki hardcoded metinlerin `useTranslation` hook'u ile çeviri anahtarlarına dönüştürülmesini istiyorum.

#### Kabul Kriterleri

1. WHEN bir React bileşeni render edildiğinde, THE Lokalizasyon_Sistemi SHALL `react-i18next`'in `useTranslation` hook'unu kullanarak aktif dile ait çeviri değerini döndürmelidir.
2. THE AdminLayout_Bileşeni SHALL sidebar navigasyon etiketlerini, breadcrumb metnini ve arama placeholder'ını çeviri anahtarları üzerinden render etmelidir.
3. THE Dashboard_Bileşeni SHALL istatistik kartı başlıklarını, mülk portföyü başlığını, boş durum mesajlarını ve buton metinlerini çeviri anahtarları üzerinden render etmelidir.
4. THE ContractsPage_Bileşeni SHALL form etiketlerini, placeholder metinlerini, hata mesajlarını, durum seçeneklerini, tab başlıklarını ve buton metinlerini çeviri anahtarları üzerinden render etmelidir.
5. THE PropertyForm_Bileşeni SHALL bölüm başlıklarını, alan etiketlerini, oda tipi etiketlerini, özellik açıklamalarını ve buton metinlerini çeviri anahtarları üzerinden render etmelidir.
6. THE MapPage_Bileşeni SHALL sayfa başlığını, açıklama metnini, pin renk sistemi legend etiketlerini ve istatistik etiketlerini çeviri anahtarları üzerinden render etmelidir.
7. WHEN aktif dil değiştirildiğinde, THE Lokalizasyon_Sistemi SHALL tüm bileşenleri yeniden render etmeksizin (React re-render mekanizması ile) güncel dildeki metinleri göstermelidir.
8. IF bir çeviri anahtarı aktif dil paketinde bulunamazsa, THEN THE Lokalizasyon_Sistemi SHALL fallback dil paketindeki değeri göstermelidir.

---

### Gereksinim 4: Dil Seçici UI Bileşeni

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, uygulamanın header alanından dili kolayca değiştirebilmek istiyorum; böylece tercih ettiğim dilde arayüzü kullanabileyim.

#### Kabul Kriterleri

1. THE Dil_Seçici SHALL AdminLayout header alanında, bildirim ikonu ile kullanıcı avatarı arasında konumlandırılmalıdır.
2. THE Dil_Seçici SHALL aktif dili bayrak ikonu veya dil kodu (TR / EN) ile görsel olarak göstermelidir.
3. WHEN kullanıcı Dil_Seçici'ye tıkladığında, THE Dil_Seçici SHALL desteklenen dillerin listesini bir dropdown menü olarak göstermelidir.
4. WHEN kullanıcı dropdown'dan bir dil seçtiğinde, THE Lokalizasyon_Sistemi SHALL aktif dili seçilen dil ile değiştirmeli ve tüm UI metinlerini anında güncellenmiş halde göstermelidir.
5. THE Lokalizasyon_Sistemi SHALL kullanıcının seçtiği dili `localStorage`'a kaydetmelidir.
6. WHEN uygulama yeniden yüklendiğinde, THE Lokalizasyon_Sistemi SHALL `localStorage`'da kayıtlı dil tercihini okuyarak aktif dil olarak uygulamalıdır.
7. IF `localStorage`'da kayıtlı dil tercih bulunamazsa, THEN THE Lokalizasyon_Sistemi SHALL tarayıcı dil tercihini kontrol etmeli; o da bulunamazsa fallback dili kullanmalıdır.
8. THE Dil_Seçici SHALL mevcut Radix UI ve TailwindCSS tasarım sistemiyle uyumlu görünüm ve davranışa sahip olmalıdır.

---

### Gereksinim 5: Genişletilebilirlik

**Kullanıcı Hikayesi:** Bir geliştirici olarak, Japonca veya Korece gibi yeni dilleri minimum kod değişikliğiyle sisteme ekleyebilmek istiyorum.

#### Kabul Kriterleri

1. THE Lokalizasyon_Sistemi SHALL yeni bir dil eklemek için gereken adımları yalnızca şunlarla sınırlamalıdır: (a) `src/i18n/locales/{dil_kodu}/` dizinine JSON dosyaları eklemek, (b) i18n konfigürasyonundaki desteklenen diller listesine dil kodunu eklemek.
2. THE Lokalizasyon_Sistemi SHALL dil listesini merkezi bir konfigürasyon nesnesinde (`SUPPORTED_LANGUAGES`) tanımlamalı; Dil_Seçici bu listeden dinamik olarak render edilmelidir.
3. WHERE Japonca (`ja`) dili eklendiğinde, THE Lokalizasyon_Sistemi SHALL mevcut bileşenlerde herhangi bir kod değişikliği gerektirmeksizin Japonca metinleri doğru biçimde göstermelidir.
4. WHERE Korece (`ko`) dili eklendiğinde, THE Lokalizasyon_Sistemi SHALL mevcut bileşenlerde herhangi bir kod değişikliği gerektirmeksizin Korece metinleri doğru biçimde göstermelidir.
5. THE Lokalizasyon_Sistemi SHALL çeviri anahtarı yapısını TypeScript tip tanımları (`i18next` module augmentation) ile desteklemeli; böylece geliştirici geçersiz anahtar kullandığında derleme zamanında hata almalıdır.

---

### Gereksinim 6: Dinamik İçerik ve Interpolasyon

**Kullanıcı Hikayesi:** Bir geliştirici olarak, değişken içeren metinlerin (örn. "Kalan: 45 karakter", "Mülk #ABC123") de lokalizasyon sistemi üzerinden yönetilmesini istiyorum.

#### Kabul Kriterleri

1. THE Lokalizasyon_Sistemi SHALL i18next interpolasyon sözdizimini (`{{değişken}}`) kullanarak dinamik değerleri çeviri metinlerine yerleştirmelidir.
2. THE Dil_Paketi SHALL sayısal değer içeren metinleri (örn. `"Kalan: {{count}} karakter"`, `"{{count}} Mülk"`) interpolasyon anahtarları ile tanımlamalıdır.
3. THE Dil_Paketi SHALL çoğul form gerektiren metinler için i18next `count` interpolasyonunu kullanmalıdır.
4. WHEN bir interpolasyon değeri eksik olduğunda, THE Lokalizasyon_Sistemi SHALL çeviri anahtarının kendisini veya fallback değerini göstermeli; uygulama hata fırlatmamalıdır.

---

### Gereksinim 7: Kalite ve Bakım

**Kullanıcı Hikayesi:** Bir geliştirici olarak, lokalizasyon sisteminin bakımının kolay olmasını ve eksik çevirilerin tespit edilebilmesini istiyorum.

#### Kabul Kriterleri

1. THE Lokalizasyon_Sistemi SHALL geliştirme ortamında (`development` mode) eksik çeviri anahtarlarını konsola uyarı olarak loglayacak şekilde konfigüre edilmelidir.
2. THE Dil_Paketi SHALL Türkçe ve İngilizce paketlerinin aynı anahtar setine sahip olduğunu doğrulamak amacıyla TypeScript tip sistemi veya derleme zamanı kontrolü ile desteklenmelidir.
3. THE Lokalizasyon_Sistemi SHALL UI bileşenlerinde doğrudan string literal kullanımını (hardcoded metin) ortadan kaldırmalıdır; tüm kullanıcıya görünen metinler çeviri anahtarı üzerinden gelmelidir.
4. WHEN bir geliştirici yeni bir UI metni eklediğinde, THE Lokalizasyon_Sistemi SHALL TypeScript tip desteği sayesinde eksik çeviri anahtarını derleme zamanında işaret etmelidir.

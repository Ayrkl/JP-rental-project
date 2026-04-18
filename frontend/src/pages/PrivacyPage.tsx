import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-16 mx-auto object-contain" />
          <h1 className="text-4xl font-bold tracking-tight text-white">Gizlilik Politikası</h1>
          <p className="text-zinc-400">Son güncelleme: Ocak 2026</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Giriş</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Edusama olarak, gizliliğinizi korumaya ve kişisel bilgilerinizin güvenliğini sağlamaya kararlıyız. Bu Gizlilik Politikası, eğitim yönetim sistemimizi kullandığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı, açıkladığımızı ve koruduğumuzu açıklar.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Topladığımız Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              <p className="mb-2">Doğrudan bize sağladığınız bilgilerin yanı sıra hizmetlerimizi kullandığınızda otomatik olarak toplanan bilgileri de topluyoruz. Bu şunları içerir:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kişisel kimlik bilgileri (ad, doğum tarihi vb.)</li>
                <li>İletişim bilgileri (e-posta adresi, telefon numarası)</li>
                <li>Akademik bilgiler (notlar, dersler, devam kayıtları)</li>
                <li>Hesap kimlik bilgileri ve kimlik doğrulama verileri</li>
                <li>Kullanım verileri ve etkileşim kayıtları</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Bilgilerinizi Nasıl Kullanıyoruz</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              <p className="mb-2">Toplanan bilgileri çeşitli amaçlarla kullanıyoruz, bunlar arasında:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Eğitim hizmetlerimizi sağlamak ve sürdürmek</li>
                <li>Hesabınız ve hizmetlerimiz hakkında sizinle iletişim kurmak</li>
                <li>Deneyiminizi iyileştirmek ve kişiselleştirmek</li>
                <li>Yasal yükümlülüklere ve eğitim düzenlemelerine uymak</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Veri Güvenliği</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Kişisel bilgilerinizi yetkisiz erişime, değişikliğe, ifşaya veya yok edilmeye karşı korumak için uygun teknik ve organizasyonel güvenlik önlemleri uyguluyoruz. Ancak, İnternet üzerinden iletilme veya elektronik depolama yöntemlerinden hiçbiri %100 güvenli değildir.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Bilgi Paylaşımı</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Kişisel bilgilerinizi üçüncü taraflara satmıyor, takas etmiyor veya kiralamıyoruz. Bilgilerinizi yalnızca yetkili eğitim kurumları, platformumuzu işletmemize yardımcı olan hizmet sağlayıcılar veya yasa gereği gerekli olduğunda paylaşabiliriz.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Haklarınız</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              <p className="mb-2">Şu haklara sahipsiniz:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kişisel bilgilerinize erişmek ve incelemek</li>
                <li>Yanlış bilgilerin düzeltilmesini talep etmek</li>
                <li>Kişisel bilgilerinizin silinmesini talep etmek</li>
                <li>Kişisel bilgilerinizin işlenmesine itiraz etmek</li>
                <li>Verilerinizin taşınabilir formatta dışa aktarılmasını talep etmek</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Çerezler ve İzleme Teknolojileri</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Platformumuzdaki aktiviteyi izlemek ve belirli bilgileri tutmak için çerezler ve benzer izleme teknolojileri kullanıyoruz. Tarayıcınıza tüm çerezleri reddetmesini veya bir çerez gönderildiğinde belirtmesini söyleyebilirsiniz.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Bu Gizlilik Politikasındaki Değişiklikler</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Gizlilik Politikamızı zaman zaman güncelleyebiliriz. Değişiklikleri bu sayfaya yeni Gizlilik Politikasını yayınlayarak ve "Son güncelleme" tarihini güncelleyerek size bildireceğiz.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Bize Ulaşın</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Bu Gizlilik Politikası hakkında herhangi bir sorunuz varsa, lütfen destek kanallarımız aracılığıyla bizimle iletişime geçin veya <a href="mailto:support@edusama.com" className="text-indigo-400 hover:text-indigo-300 hover:underline">support@edusama.com</a> adresine e-posta gönderin.
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-8">
          <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
            Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

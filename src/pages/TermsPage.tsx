import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <img src="/edusama-BXUdwSsl.png" alt="Edusama Logo" className="h-16 mx-auto object-contain" />
          <h1 className="text-4xl font-bold tracking-tight text-white">Hizmet Şartları</h1>
          <p className="text-zinc-400">Son güncelleme: Ocak 2026</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Şartların Kabulü</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Edusama'ya erişerek ve kullanarak, bu sözleşmenin şartlarını ve hükümlerini kabul eder ve bunlara bağlı kalmayı kabul edersiniz. Yukarıdakilere uymayı kabul etmiyorsanız, lütfen bu hizmeti kullanmayın.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Hizmetin Kullanımı</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              <p className="mb-2">Hizmeti yalnızca yasal amaçlar için ve bu Şartlara uygun olarak kullanmayı kabul edersiniz. Şunları yapmayacağınızı kabul edersiniz:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hesap oluştururken doğru ve eksiksiz bilgi sağlamak</li>
                <li>Hizmeti yalnızca yetkili eğitim amaçları için kullanmak</li>
                <li>Tüm geçerli yasa ve düzenlemelere uymak</li>
                <li>Hesap kimlik bilgilerinizin gizliliğini korumaktan sorumlu olmak</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Kullanıcı Hesapları</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Hesabınızın ve şifrenizin gizliliğini korumaktan sorumlusunuz. Hesabınız altında gerçekleşen tüm faaliyetlerden sorumluluğu kabul edersiniz. Hesabınızın yetkisiz kullanımından derhal haberdar etmelisiniz.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Fikri Mülkiyet Hakları</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Hizmetin tüm içeriği, özellikleri ve işlevselliği, metin, grafikler, logolar ve yazılım dahil ancak bunlarla sınırlı olmamak üzere, Edusama'nın münhasır mülkiyetidir ve uluslararası telif hakkı, marka ve diğer fikri mülkiyet yasalarıyla korunmaktadır.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Yasak Faaliyetler</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              <p className="mb-2">Hizmeti şu amaçlarla kullanamazsınız:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hizmetin herhangi bir bölümüne yetkisiz erişim sağlamaya çalışmak</li>
                <li>Herhangi bir virüs, kötü amaçlı yazılım veya zararlı kod iletmek</li>
                <li>Spam göndermek, istenmeyen mesajlar göndermek veya herhangi bir şekilde tacizde bulunmak</li>
                <li>Yetkisiz olarak hizmetin kopyasını çıkarmak, değiştirmek veya türev çalışmalar oluşturmak</li>
                <li>Hizmete veya hizmete bağlı sunuculara müdahale etmek veya bunları bozmak</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Fesih</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Bu Şartları ihlal ettiğine veya diğer kullanıcılara, bize veya üçüncü taraflara zararlı olduğuna inandığımız davranışlar için, önceden haber vermeksizin hesabınızı ve hizmete erişiminizi derhal sonlandırma veya askıya alma hakkını saklı tutarız.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Feragatnameler</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Hizmet "olduğu gibi" ve "mevcut olduğu şekilde" herhangi bir garanti olmaksızın, açık veya örtülü olarak sağlanmaktadır. Hizmetin kesintisiz, güvenli veya hatasız olacağını garanti etmiyoruz.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Sorumluluk Sınırlaması</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Yasaların izin verdiği en geniş ölçüde, Edusama, dolaylı, arızi, özel, sonuçsal veya cezai zararlardan veya doğrudan veya dolaylı olarak oluşan kar veya gelir kaybından sorumlu olmayacaktır.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Şartlardaki Değişiklikler</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Bu Şartları istediğimiz zaman değiştirme hakkını saklı tutarız. Güncellenmiş Şartları bu sayfaya yayınlayarak ve "Son güncelleme" tarihini güncelleyerek kullanıcıları önemli değişikliklerden haberdar edeceğiz.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">Uygulanacak Hukuk</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Bu Şartlar, Edusama'nın faaliyet gösterdiği yargı bölgesinin yasalarına göre yönetilecek ve yorumlanacaktır, çatışma hukuku hükümlerine bakılmaksızın.
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-zinc-200">
            <CardHeader>
              <CardTitle className="text-xl text-white">İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-zinc-400">
              Bu Hizmet Şartları hakkında herhangi bir sorunuz varsa, lütfen destek kanallarımız aracılığıyla bizimle iletişime geçin veya <a href="mailto:support@edusama.com" className="text-indigo-400 hover:text-indigo-300 hover:underline">support@edusama.com</a> adresine e-posta gönderin.
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

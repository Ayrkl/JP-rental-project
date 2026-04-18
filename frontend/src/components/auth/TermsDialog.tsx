import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export const TermsDialog = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-zinc-950 border-zinc-800 text-zinc-100 flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-2">Hizmet Şartları</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 mt-2">
          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed pb-6">
            <p className="text-zinc-500 font-medium">Son güncelleme: Ocak 2026</p>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Şartların Kabulü</h3>
              <p>Edusama'ya erişerek ve kullanarak, bu sözleşmenin şartlarını ve hükümlerini kabul eder ve bunlara bağlı kalmayı kabul edersiniz. Yukarıdakilere uymayı kabul etmiyorsanız, lütfen bu hizmeti kullanmayın.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Hizmetin Kullanımı</h3>
              <p className="mb-2">Hizmeti yalnızca yasal amaçlar için ve bu Şartlara uygun olarak kullanmayı kabul edersiniz. Şunları yapmayacağınızı kabul edersiniz:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hesap oluştururken doğru ve eksiksiz bilgi sağlamak</li>
                <li>Hizmeti yalnızca yetkili eğitim amaçları için kullanmak</li>
                <li>Tüm geçerli yasa ve düzenlemelere uymak</li>
                <li>Hesap kimlik bilgilerinizin gizliliğini korumaktan sorumlu olmak</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Kullanıcı Hesapları</h3>
              <p>Hesabınızın ve şifrenizin gizliliğini korumaktan sorumlusunuz. Hesabınız altında gerçekleşen tüm faaliyetlerden sorumluluğu kabul edersiniz. Hesabınızın yetkisiz kullanımından derhal haberdar etmelisiniz.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Fikri Mülkiyet Hakları</h3>
              <p>Hizmetin tüm içeriği, özellikleri ve işlevselliği, metin, grafikler, logolar ve yazılım dahil ancak bunlarla sınırlı olmamak üzere, Edusama'nın münhasır mülkiyetidir ve uluslararası telif hakkı, marka ve diğer fikri mülkiyet yasalarıyla korunmaktadır.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Yasak Faaliyetler</h3>
              <p className="mb-2">Hizmeti şu amaçlarla kullanamazsınız:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hizmetin herhangi bir bölümüne yetkisiz erişim sağlamaya çalışmak</li>
                <li>Herhangi bir virüs, kötü amaçlı yazılım veya zararlı kod iletmek</li>
                <li>Spam göndermek, istenmeyen mesajlar göndermek veya herhangi bir şekilde tacizde bulunmak</li>
                <li>Yetkisiz olarak hizmetin kopyasını çıkarmak, değiştirmek veya türev çalışmalar oluşturmak</li>
                <li>Hizmete veya hizmete bağlı sunuculara müdahale etmek veya bunları bozmak</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Fesih</h3>
              <p>Bu Şartları ihlal ettiğine veya diğer kullanıcılara, bize veya üçüncü taraflara zararlı olduğuna inandığımız davranışlar için, önceden haber vermeksizin hesabınızı ve hizmete erişiminizi derhal sonlandırma veya askıya alma hakkını saklı tutarız.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Feragatnameler</h3>
              <p>Hizmet "olduğu gibi" ve "mevcut olduğu şekilde" herhangi bir garanti olmaksızın, açık veya örtülü olarak sağlanmaktadır. Hizmetin kesintisiz, güvenli veya hatasız olacağını garanti etmiyoruz.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Sorumluluk Sınırlaması</h3>
              <p>Yasaların izin verdiği en geniş ölçüde, Edusama, dolaylı, arızi, özel, sonuçsal veya cezai zararlardan veya doğrudan veya dolaylı olarak oluşan kar veya gelir kaybından sorumlu olmayacaktır.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Şartlardaki Değişiklikler</h3>
              <p>Bu Şartları istediğimiz zaman değiştirme hakkını saklı tutarız. Güncellenmiş Şartları bu sayfaya yayınlayarak ve "Son güncelleme" tarihini güncelleyerek kullanıcıları önemli değişikliklerden haberdar edeceğiz.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Uygulanacak Hukuk</h3>
              <p>Bu Şartlar, Edusama'nın faaliyet gösterdiği yargı bölgesinin yasalarına göre yönetilecek ve yorumlanacaktır, çatışma hukuku hükümlerine bakılmaksızın.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">İletişim Bilgileri</h3>
              <p>Bu Hizmet Şartları hakkında herhangi bir sorunuz varsa, lütfen destek kanallarımız aracılığıyla bizimle iletişime geçin veya <a href="mailto:support@edusama.com" className="text-indigo-400 hover:text-indigo-300 hover:underline">support@edusama.com</a> adresine e-posta gönderin.</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const superAdminEmail = 'test@edusama.com';
  const superAdminPassword = '123456789Tr.';
  const superAdminName = 'Super Admin';

  console.log('🧹 Veritabanı temizleniyor...');
  // Tüm kullanıcıları sil (Fresh start)
  await prisma.user.deleteMany({});
  console.log('✅ Veritabanı temizlendi.');

  console.log('🔐 Super Admin şifresi hashleniyor...');
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  console.log('👤 Super Admin oluşturuluyor...');
  const user = await prisma.user.create({
    data: {
      email: superAdminEmail,
      password: hashedPassword,
      name: superAdminName,
      role: 'admin',
    },
  });

  console.log('✅ Super Admin kullanıcısı başarıyla oluşturuldu:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

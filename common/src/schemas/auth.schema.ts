import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz."),
  password: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır.")
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(3, "Adınız en az 3 karakter olmalıdır."),
  email: z.string().email("Geçerli bir email adresi giriniz."),
  password: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır."),
  role: z.enum(['tenant', 'admin'])
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

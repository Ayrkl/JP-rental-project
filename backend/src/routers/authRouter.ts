import { router, publicProcedure } from '../trpc';
import { LoginSchema, RegisterSchema } from 'common';
import bcrypt from 'bcrypt';

export const authRouter = router({
  login: publicProcedure
    .input(LoginSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) throw new Error("Kullanıcı bulunamadı.");
      
      const isPasswordValid = await bcrypt.compare(input.password, user.password);
      if (!isPasswordValid) throw new Error("Şifre hatalı.");
      
      return { token: "mock_jwt_token_123", user };
    }),
    
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email }
      });
      if (existingUser) throw new Error("Bu email ile kayıtlı bir kullanıcı var!");
      
      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
        }
      });
      return { token: "mock_jwt_token_456", user };
    })
});

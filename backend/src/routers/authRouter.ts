import { router, publicProcedure } from '../trpc';
import { LoginSchema, RegisterSchema } from 'common';

export const authRouter = router({
  login: publicProcedure
    .input(LoginSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) throw new Error("Kullanıcı bulunamadı.");
      if (user.password !== input.password) throw new Error("Şifre hatalı."); // TODO: bcrypt check
      
      return { token: "mock_jwt_token_123", user };
    }),
    
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email }
      });
      if (existingUser) throw new Error("Bu email ile kayıtlı bir kullanıcı var!");
      
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: input.password, // TODO: bcrypt hash,
          name: input.name,
          role: input.role,
        }
      });
      return { token: "mock_jwt_token_456", user };
    })
});

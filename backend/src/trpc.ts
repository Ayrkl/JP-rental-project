import { initTRPC } from '@trpc/server';
import { prisma } from './prisma';

export const createContext = ({ req, res }: any) => {
  return { req, res, prisma };
};
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

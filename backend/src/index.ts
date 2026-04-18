import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { router, createContext } from './trpc';
import { authRouter } from './routers/authRouter';

// Ana App Router'ı (tüm routerları toplar)
const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

const app = express();

// Güvenlik izinleri (Vite lokal portuna izin ver)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// tRPC Express Adapter Entegrasyonu
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(3001, () => {
  console.log('🚀 Backend sunucusu çalışıyor: http://localhost:3001');
});

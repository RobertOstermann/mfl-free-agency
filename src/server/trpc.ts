import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { createTRPContext, publicProcedure, router } from "@/server/context";
import { counterRouter } from "@/server/routers/counter";

const POSTS = [
  { id: "1", title: "First post" },
  { id: "2", title: "Second post" },
  { id: "3", title: "Third post" },
  { id: "4", title: "Fourth post" },
  { id: "5", title: "Fifth post" },
  { id: "6", title: "Sixth post" },
  { id: "7", title: "Seventh post" },
  { id: "8", title: "Eighth post" },
  { id: "9", title: "Ninth post" },
  { id: "10", title: "Tenth post" },
];

export const appRouter = router({
  hello: publicProcedure.query(() => "Hello world!"),
  counter: counterRouter,
  posts: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return POSTS;
  }),
  post: publicProcedure.input(String).query(async (req) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return POSTS.find((p) => p.id === req.input);
  }),
});

export const trpcMiddleWare = createExpressMiddleware({
  router: appRouter,
  createContext: createTRPContext,
});

export type AppRouter = typeof appRouter;

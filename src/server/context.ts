import { initTRPC } from "@trpc/server";

/**
 * Per-request context.
 *
 * Nothing is derived from the request yet; the `CreateExpressContextOptions`
 * argument is accepted implicitly so procedures keep a typed context to grow
 * into.
 */
export const createTRPContext = () => ({});

type TRPCContext = Awaited<ReturnType<typeof createTRPContext>>;

/**
 * Shared tRPC instance.
 *
 * Lives apart from the app router so feature routers can build procedures
 * without importing the app router that mounts them.
 */
const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

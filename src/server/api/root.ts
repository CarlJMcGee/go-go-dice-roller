import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { roomRouter } from "./routers/room";
import { dieRollRouter } from "./routers/dieRoll";
import { DbRouter } from "./routers/db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  room: roomRouter,
  dieRoll: dieRollRouter,
  db: DbRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

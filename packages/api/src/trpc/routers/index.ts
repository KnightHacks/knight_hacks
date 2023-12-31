import { router } from "../init";
import { publicProcedure } from "../procedures";
import { hackathonsRouter } from "./hackathons";
import { hackersRouter } from "./hackers";
import { usersRouter } from "./users";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello Hono!";
  }),
  users: usersRouter,
  hackathons: hackathonsRouter,
  hackers: hackersRouter,
});

export type AppRouter = typeof appRouter;

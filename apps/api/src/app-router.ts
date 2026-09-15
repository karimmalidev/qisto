import { Router } from "express";
import type { AppContainer } from "./app-container.ts";
import { authMiddleware } from "./middlewares/auth.middleware.ts";

export const appRouter = (container: AppContainer) => {
  const router = Router();

  const auth = authMiddleware(container);

  router.post("/login", container.authController.login);

  router.post("/sync/push", auth, container.syncController.push);
  router.post("/sync/pull", auth, container.syncController.pull);

  return router;
};

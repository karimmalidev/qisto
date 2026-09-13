import { Router } from "express";
import type { AppContainer } from "./app-container.ts";
import { authMiddleware } from "./middlewares/auth.middleware.ts";

export const appRouter = (container: AppContainer) => {
  const router = Router();
  const auth = authMiddleware(container);

  router.post("/sessions", container.sessionController.post);
  router.get("/sessions", auth, container.sessionController.get);

  return router;
};

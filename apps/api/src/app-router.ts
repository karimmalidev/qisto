import { Router } from "express";
import type { AppContainer } from "./app-container.ts";

export const appRouter = (container: AppContainer) => {
  const router = Router();

  router.post("/sessions", container.sessionController.post);

  return router;
};

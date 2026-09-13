import type { Request, Response, NextFunction } from "express";
import { AppContainer } from "../app-container.js";
import { UnauthorizedError } from "@qisto/schemas";

export const authMiddleware =
  (container: AppContainer) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7).trim()
      : undefined;

    if (!token) {
      throw new UnauthorizedError();
    }

    const verified = await container.sessionService.verify({ token });

    req.userId = verified.userId;
    req.sessionId = verified.sessionId;

    next();
  };

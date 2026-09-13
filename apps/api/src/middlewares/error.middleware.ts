import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError, strings } from "@qisto/schemas";

export const errorMiddleware =
  () => (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: strings.VALIDATION_ERROR,
        zod: JSON.parse(error.message),
      });
    }

    if (
      error instanceof SyntaxError &&
      "body" in error &&
      (error as any).status === 400
    ) {
      return res.status(400).json({ error: strings.INVALID_JSON });
    }

    console.error(error);
    return res.status(500).json({ error: strings.INTERNAL_SERVER_ERROR });
  };

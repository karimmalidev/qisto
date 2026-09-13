import type { Request, Response } from "express";
import type { SessionService } from "./session.service.ts";
import { postSessionsSchema } from "@qisto/schemas";

export class SessionController {
  constructor(private readonly service: SessionService) {}

  post = async (req: Request, res: Response) => {
    const parsed = postSessionsSchema.shape.request.shape.body.parse(req.body);
    const { token } = await this.service.create({
      ...parsed,
      ipAddress: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
    });

    return res.status(201).json({ token });
  };
}

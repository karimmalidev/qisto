import type { Request, Response } from "express";
import type { SessionService } from "./session.service.ts";
import {
  postSessionsSchema,
  type GetSessions,
  type PostSessions,
} from "@qisto/schemas";

export class SessionController {
  constructor(private readonly service: SessionService) {}

  post = async (req: Request, res: Response) => {
    const parsed: PostSessions["request"]["body"] =
      postSessionsSchema.shape.request.shape.body.parse(req.body);
    const { token } = await this.service.create({
      ...parsed,
      ipAddress: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
    });

    const json: PostSessions["response"]["body"] = { token };
    return res.status(201).json(json);
  };

  get = async (req: Request, res: Response) => {
    const json: GetSessions["response"]["body"] =
      await this.service.getSessions({
        userId: req.userId,
      });

    return res.json(json);
  };
}

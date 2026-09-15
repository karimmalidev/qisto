import type { Request, Response } from "express";
import type { AuthService } from "./auth.service.ts";
import { loginSchema, type Login } from "@qisto/schemas";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response) => {
    const parsed: Login["request"]["body"] =
      loginSchema.shape.request.shape.body.parse(req.body);
    const { token } = await this.service.login({
      ...parsed,
      ipAddress: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
    });

    const json: Login["response"]["body"] = { token };
    return res.status(201).json(json);
  };
}

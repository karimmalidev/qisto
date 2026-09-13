import { strings, UnauthorizedError } from "@qisto/schemas";
import type { DB } from "../../db/index.ts";
import { sessions } from "../../db/schema.ts";
import { SessionUtils } from "./session.utils.ts";

export class SessionService {
  constructor(private readonly db: DB) {}

  create = async (input: {
    username: string;
    password: string;
    ipAddress: string | null;
    userAgent: string | null;
  }) => {
    const user = await this.db.query.users.findFirst({
      where: { username: input.username },
    });

    if (
      !user ||
      !(await SessionUtils.matchPassword(input.password, user.hashedPassword))
    ) {
      throw new UnauthorizedError(strings.INVALID_USERNAME_OR_PASSWORD);
    }

    const token = SessionUtils.generateToken();
    await this.db.insert(sessions).values({
      userId: user.id,
      hashedToken: SessionUtils.hashToken(token),
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    });

    return { token };
  };

  verify = async (input: { token: string }) => {
    const session = await this.db.query.sessions.findFirst({
      where: {
        hashedToken: SessionUtils.hashToken(input.token),
        revokedAt: { isNull: true },
      },
      columns: { userId: true, id: true },
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    return { sessionId: session.id, userId: session.userId };
  };

  getSessions = async (input: { userId: string }) => {
    return await this.db.query.sessions.findMany({
      where: { userId: input.userId },
      columns: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        lastSyncBefore: true,
      },
    });
  };
}

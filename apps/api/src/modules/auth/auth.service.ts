import { strings, UnauthorizedError } from "@qisto/schemas";
import type { DB } from "../../db/index.ts";
import { sessions } from "../../db/schema.ts";
import { AuthUtils } from "./auth.utils.ts";

export class AuthService {
  constructor(private readonly db: DB) {}

  login = async (input: {
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
      !(await AuthUtils.matchPassword(input.password, user.hashedPassword))
    ) {
      throw new UnauthorizedError(strings.INVALID_USERNAME_OR_PASSWORD);
    }

    const token = AuthUtils.generateToken();
    await this.db.insert(sessions).values({
      userId: user.id,
      hashedToken: AuthUtils.hashToken(token),
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    });

    return { token };
  };

  verify = async (input: { token: string }) => {
    const session = await this.db.query.sessions.findFirst({
      where: {
        hashedToken: AuthUtils.hashToken(input.token),
        revokedAt: { isNull: true },
      },
      columns: { userId: true, id: true },
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    return { sessionId: session.id, userId: session.userId };
  };
}

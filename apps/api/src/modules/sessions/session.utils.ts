import argon2 from "argon2";
import { createHash, randomBytes } from "crypto";

export class SessionUtils {
  static generateToken = () => {
    return randomBytes(32).toString("base64url");
  };

  static hashToken = (token: string) => {
    return createHash("sha256").update(token).digest("base64url");
  };

  static hashPassword = async (password: string) => {
    return await argon2.hash(password, {
      type: argon2.argon2id,
    });
  };

  static matchPassword = async (password: string, hash: string) => {
    return await argon2.verify(hash, password);
  };
}

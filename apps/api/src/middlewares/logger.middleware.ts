import chalk from "chalk";
import type { Request, Response, NextFunction } from "express";

export const loggerMiddleware =
  () => (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        chalk.gray(`[${new Date().toISOString()}]`),
        req.method,
        req.originalUrl,
        colorStatus(res.statusCode),
        chalk.gray(`(${duration}ms)`),
      );
    });

    next();
  };

function colorStatus(status: number) {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return chalk.white(status);
}

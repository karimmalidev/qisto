import express, { json, type Express } from "express";
import { AppContainer } from "./app-container.ts";
import { db } from "./db/index.ts";
import { loggerMiddleware } from "./middlewares/logger.middleware.ts";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { appRouter } from "./app-router.ts";
import { strings } from "@qisto/schemas";

const app: Express = express();
const port = 3000;

const container = new AppContainer(db);

app.use(loggerMiddleware());
app.use(json());
app.use(appRouter(container));
app.use((req, res) =>
  res.status(404).json({ message: strings.NOT_FOUND_ERROR }),
);
app.use(errorMiddleware());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

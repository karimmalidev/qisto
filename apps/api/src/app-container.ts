import type { DB } from "./db/index.ts";
import { SessionController } from "./modules/sessions/session.controller.ts";
import { SessionService } from "./modules/sessions/session.service.ts";

export class AppContainer {
  sessionService: SessionService;
  sessionController: SessionController;

  constructor(private readonly db: DB) {
    this.sessionService = new SessionService(db);
    this.sessionController = new SessionController(this.sessionService);
  }
}

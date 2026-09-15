import type { DB } from "./db/index.ts";
import { AuthController } from "./modules/auth/auth.controller.ts";
import { AuthService } from "./modules/auth/auth.service.ts";
import { OperationService } from "./modules/resources/operation.service.ts";
import { SyncController } from "./modules/sync/sync.controller.ts";
import { SyncService } from "./modules/sync/sync.service.ts";

export class AppContainer {
  authService: AuthService;
  authController: AuthController;
  syncService: SyncService;
  syncController: SyncController;

  constructor(readonly db: DB) {
    this.authService = new AuthService(db);
    this.authController = new AuthController(this.authService);

    this.syncService = new SyncService(new OperationService(db));
    this.syncController = new SyncController(this.syncService);
  }
}

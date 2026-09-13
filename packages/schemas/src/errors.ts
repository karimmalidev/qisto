import { strings } from "./strings.ts";

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = strings.NOT_FOUND_ERROR) {
    super(message, 404);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = strings.UNAUTHORIZED_ERROR) {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = strings.FORBIDDEN_ERROR) {
    super(message, 403);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = strings.BAD_REQUEST_ERROR) {
    super(message, 400);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = strings.INTERNAL_SERVER_ERROR) {
    super(message, 500);
  }
}

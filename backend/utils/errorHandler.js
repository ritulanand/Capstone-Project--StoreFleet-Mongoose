export class ErrorHandler extends Error {
  constructor(statusCode, error) {
    console.log("error handler", error, statusCode);
    super(error);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

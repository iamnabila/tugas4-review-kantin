export type FieldError = { field: string; message: string };

// Satu jenis error untuk seluruh aplikasi. Dilempar dari service/middleware,
// lalu diubah jadi response JSON oleh middlewares/errorHandler.ts.
export class AppError extends Error {
  statusCode: number;
  errors?: FieldError[];

  constructor(statusCode: number, message: string, errors?: FieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

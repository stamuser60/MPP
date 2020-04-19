export class AppError extends Error {
  public readonly status: number;
  constructor(m: string, status: number) {
    super(m);
    this.status = status;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class DispatchError extends AppError {
  constructor(m: string, status: number) {
    super(m, status);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DispatchError.prototype);
  }
}

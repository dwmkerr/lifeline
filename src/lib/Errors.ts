export class LifelineError extends Error {
  public title: string;
  public error?: Error;

  public constructor(title: string, message: string, error?: Error) {
    super(message);
    this.title = title;
    this.error = error;
  }

  public static fromError(title: string, err: unknown): LifelineError {
    //  Cast the internal error into an error object.
    const error = err as Error;
    return new LifelineError(title, error?.message || "Unknown error", error);
  }
}

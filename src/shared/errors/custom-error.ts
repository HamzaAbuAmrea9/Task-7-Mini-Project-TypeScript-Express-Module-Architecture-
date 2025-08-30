export class CustomError extends Error {
  // We must pass the status code when creating an instance of this class
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = 'CustomError';
  }
}
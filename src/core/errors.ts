export class UnknownJsonDataError extends Error {
  constructor(value: never, message: string) {
    super(message);
  }
}

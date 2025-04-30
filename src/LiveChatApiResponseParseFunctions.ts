import { Continuations } from "./zod/continuation";

export function getNextContinuation(continuations: Continuations): string | undefined {
  const continuation = [...continuations].shift();
  if (!continuation) {
    return undefined;
  }
  if ("invalidationContinuationData" in continuation) {
    return continuation.invalidationContinuationData.continuation;
  } else if ("timedContinuationData" in continuation) {
    return continuation.timedContinuationData.continuation;
  } else if ("reloadContinuationData" in continuation) {
    return continuation.reloadContinuationData.continuation;
  } else {
    throw new UnknownContinuationError(continuation);
  }
}

export class UnknownContinuationError extends Error {
  constructor(value: never, message = `Unknown continuation is detected. ${value}`) {
    super(message);
  }
}

import { UnknownJsonDataError } from "./core/errors";
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
    throw new UnknownJsonDataError(
      continuation,
      `Unknown continuation is detected. ${continuation}`,
    );
  }
}

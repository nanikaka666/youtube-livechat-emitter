import {
  Continuations,
  invalidationContinuationDataSchema,
  reloadContinuationDataSchema,
  timedContinuationDataSchema,
} from "./zod/continuation";

export function getNextContinuation(continuations: Continuations): string | undefined {
  if (continuations.length === 0) {
    return undefined;
  }
  const continuation = [...continuations].shift();
  const maybeInvalidation = invalidationContinuationDataSchema.safeParse(continuation);
  if (maybeInvalidation.success) {
    return maybeInvalidation.data.invalidationContinuationData.continuation;
  }
  const maybeTimed = timedContinuationDataSchema.safeParse(continuation);
  if (maybeTimed.success) {
    return maybeTimed.data.timedContinuationData.continuation;
  }
  const maybeReload = reloadContinuationDataSchema.safeParse(continuation);
  if (maybeReload.success) {
    return maybeReload.data.reloadContinuationData.continuation;
  }
  console.log("UNKNOWN Continuations:", continuation);
}

export interface Membership {
  thumbnail?: URL;
  tooltip: string;
}

export interface Author {
  channelId: string;
  name: string;
  thumbnail: URL;
  isOwner: boolean;
  isModerator: boolean;
  membership?: Membership;
}

export interface Chat {
  id: string;
  timestampUsec: number;
  author: Author;
  messages: Messages;
  paidAmount?: string;
}

export interface Emoji {
  image: URL;
}

export type Messages = (string | Emoji)[];

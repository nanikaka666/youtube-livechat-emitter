import { UnknownJsonDataError } from "../core/errors";
import { fetchLiveChatApi } from "../infrastructure/fetch";
import {
  Continuations,
  GetLiveChatApiResponse,
  getLiveChatApiResponseSchema,
} from "../zod/continuation";

export interface GetLiveChatApiRequestPayload {
  continuation: string;
  readonly apiKey: string;
  readonly clientName: string;
  readonly clientVersion: string;
}

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

export async function fetchGetLiveChatApiResponse(
  payload: GetLiveChatApiRequestPayload,
): Promise<GetLiveChatApiResponse> {
  const apiUrl = `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${payload.apiKey}`;
  const postPayload = {
    context: {
      client: {
        clientName: payload.clientName,
        clientVersion: payload.clientVersion,
      },
    },
    continuation: payload.continuation,
  };

  const res = await fetchLiveChatApi(apiUrl, postPayload);
  return getLiveChatApiResponseSchema.parse(res);
}

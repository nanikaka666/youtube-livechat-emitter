import { UnknownJsonDataError } from "../core/errors";
import { fetchLiveChatApi } from "../infrastructure/fetch";
import {
  Continuations,
  GetLiveChatApiResponse,
  getLiveChatApiResponseSchema,
} from "../zod/continuation";

export interface GetLiveChatApiPayloadBaseData {
  continuation: string;
  readonly apiKey: string;
  readonly clientName: string;
  readonly clientVersion: string;
}

export interface GetLiveChatApiPayload {
  context: {
    client: {
      clientName: string;
      clientVersion: string;
    };
  };
  continuation: string;
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
  baseData: GetLiveChatApiPayloadBaseData,
): Promise<GetLiveChatApiResponse> {
  const apiUrl = `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${baseData.apiKey}`;
  const payload = {
    context: {
      client: {
        clientName: baseData.clientName,
        clientVersion: baseData.clientVersion,
      },
    },
    continuation: baseData.continuation,
  } satisfies GetLiveChatApiPayload;

  const res = await fetchLiveChatApi(apiUrl, payload);
  return getLiveChatApiResponseSchema.parse(res);
}

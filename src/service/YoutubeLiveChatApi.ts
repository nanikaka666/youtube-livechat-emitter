import { ChannelId } from "../core/ChannelId";
import { UnknownJsonDataError } from "../core/errors";
import { post } from "../infrastructure/fetch";
import { Actions } from "../zod/action";
import {
  Continuations,
  GetLiveChatApiResponse,
  getLiveChatApiResponseSchema,
} from "../zod/continuation";
import { getOutputFlag } from "./ParseArgsForDebug";
import { getPayloadBaseData } from "./YoutubeLivePage";
import fs from "fs";

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

export class YoutubeLiveChatApi {
  #baseData?: GetLiveChatApiPayloadBaseData;
  readonly #channelId: ChannelId;
  constructor(channelId: ChannelId) {
    this.#channelId = channelId;
  }

  async init() {
    if (!this.#baseData) {
      this.#baseData = await getPayloadBaseData(this.#channelId);
    }
  }

  async getNextActions(): Promise<Actions | undefined> {
    if (!this.#baseData) {
      throw new Error("init() must be called.");
    }
    const res = await this.#fetchGetLiveChatApiResponse();
    this.#baseData.continuation =
      this.#extractContinuation(res.continuationContents.liveChatContinuation.continuations) ??
      this.#baseData.continuation;

    return res.continuationContents.liveChatContinuation.actions;
  }

  #extractContinuation(continuations: Continuations): string | undefined {
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

  async #fetchGetLiveChatApiResponse(): Promise<GetLiveChatApiResponse> {
    if (!this.#baseData) {
      throw new Error("init() must be called.");
    }
    const apiUrl = `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${this.#baseData.apiKey}`;
    const payload = {
      context: {
        client: {
          clientName: this.#baseData.clientName,
          clientVersion: this.#baseData.clientVersion,
        },
      },
      continuation: this.#baseData.continuation,
    } satisfies GetLiveChatApiPayload;

    const res = await post(apiUrl, payload);

    // to grab a contents of api response that can not be parsed, weird if statement is here for it.
    // if --output-error-response command option is given then output the response onto out/ directory.
    if (getOutputFlag() && !getLiveChatApiResponseSchema.safeParse(res).success) {
      const date = new Date();
      const timeString = `${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
      const outputFileName = `./out/error-${this.#channelId.id}-${timeString}.json`;
      fs.writeFileSync(outputFileName, JSON.stringify(res));
    }
    return getLiveChatApiResponseSchema.parse(res);
  }
}

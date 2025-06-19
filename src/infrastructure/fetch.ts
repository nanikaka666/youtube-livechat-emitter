import axios from "axios";
import { ChannelId } from "../core/ChannelId";

export interface GetLiveChatApiRequestPayload {
  continuation: string;
  readonly apiKey: string;
  readonly clientName: string;
  readonly clientVersion: string;
}

export async function fetchLiveChatApi(payload: GetLiveChatApiRequestPayload): Promise<string> {
  const res = await axios.post(
    `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${payload.apiKey}`,
    {
      context: {
        client: {
          clientName: payload.clientName,
          clientVersion: payload.clientVersion,
        },
      },
      continuation: payload.continuation,
    },
  );
  return res.data as string;
}

export async function get(url: string): Promise<string> {
  const res = await axios.get(url);
  return res.data as string;
}

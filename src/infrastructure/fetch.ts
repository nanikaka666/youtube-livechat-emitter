import axios from "axios";
import { ChannelId } from "../core/ChannelId";

export interface GetLiveChatApiRequestPayload {
  continuation: string;
  readonly apiKey: string;
  readonly clientName: string;
  readonly clientVersion: string;
}

export async function fetchLiveChatApi(payload: GetLiveChatApiRequestPayload): Promise<any> {
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
  return res.data;
}

export async function fetchLivePage(channelId: ChannelId): Promise<string> {
  const channelUrl = channelId.isHandle
    ? `https://www.youtube.com/${channelId.id}/live`
    : `https://www.youtube.com/channel/${channelId.id}/live`;
  const res = await axios.get(channelUrl);
  return res.data as string;
}

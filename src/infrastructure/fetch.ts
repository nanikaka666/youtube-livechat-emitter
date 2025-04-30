import axios from "axios";
import { GetLiveChatApiRequestPayload } from "../YoutubeLiveChatEmitter";

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

export async function fetchLivePage(channelId: string): Promise<string> {
  const channelUrl = channelId.startsWith("@")
    ? `https://www.youtube.com/${channelId}/live`
    : `https://www.youtube.com/channel/${channelId}/live`;
  const res = await axios.get(channelUrl);
  return res.data as string;
}

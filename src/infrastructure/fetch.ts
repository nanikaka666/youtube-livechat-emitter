import axios from "axios";
import { ChannelId } from "../core/ChannelId";

export interface GetLiveChatApiRequestPayload {
  continuation: string;
  readonly apiKey: string;
  readonly clientName: string;
  readonly clientVersion: string;
}

export async function fetchLiveChatApi(url: string, data: object): Promise<string> {
  const res = await axios.post(url, data);
  return res.data as string;
}

export async function get(url: string): Promise<string> {
  const res = await axios.get(url);
  return res.data as string;
}

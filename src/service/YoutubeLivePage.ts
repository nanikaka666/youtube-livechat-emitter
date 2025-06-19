import { parse } from "node-html-parser";
import { get } from "../infrastructure/fetch";
import { GetLiveChatApiRequestPayload } from "../infrastructure/fetch";
import { ChannelId } from "../core/ChannelId";

export async function getRequestPayload(channelId: ChannelId) {
  const livePageUrl = channelId.isHandle
    ? `https://www.youtube.com/${channelId.id}/live`
    : `https://www.youtube.com/channel/${channelId.id}/live`;
  const rawHtml = await get(livePageUrl);

  const videoId = getVideoId(rawHtml);
  if (videoId === undefined) {
    throw new Error("No live streaming.");
  }
  const requestPayload = makeRequestPayload(rawHtml);
  if (requestPayload === undefined) {
    throw new Error("Failed extracting payload data.");
  }
  return requestPayload;
}

function makeRequestPayload(html: string): GetLiveChatApiRequestPayload | undefined {
  const continuation = getContinuation(html);
  const apiKey = getInnertubeApiKey(html);
  const clientName = getInnertubeClientName(html);
  const clientVersion = getInnertubeClientVersion(html);

  if (continuation && apiKey && clientName && clientVersion) {
    return {
      continuation,
      apiKey,
      clientName,
      clientVersion,
    };
  } else {
    return undefined;
  }
}

function getVideoId(html: string) {
  const parsedBody = parse(html);
  const element = parsedBody.querySelector('link[rel="canonical"]');
  if (element === null) {
    return undefined;
  }
  const href = element.getAttribute("href");
  if (href === undefined) {
    return undefined;
  }
  const videoIdMatch = href.match(/^https:\/\/www\.youtube\.com\/watch\?v=(.+)$/);
  if (videoIdMatch === null) {
    return undefined;
  }
  return videoIdMatch[1];
}

function getContinuation(html: string) {
  const match = html.match(/{"continuation":"(.+?)"/);
  if (match === null) {
    return undefined;
  }
  return match[1];
}

function getInnertubeApiKey(html: string) {
  const match = html.match(/"INNERTUBE_API_KEY":"(.+?)"/);
  if (match === null) {
    return undefined;
  }
  return match[1];
}

function getInnertubeClientName(html: string) {
  const match = html.match(/"INNERTUBE_CLIENT_NAME":"(.+?)"/);
  if (match === null) {
    return undefined;
  }
  return match[1];
}

function getInnertubeClientVersion(html: string) {
  const match = html.match(/"INNERTUBE_CLIENT_VERSION":"(.+?)"/);
  if (match === null) {
    return undefined;
  }
  return match[1];
}

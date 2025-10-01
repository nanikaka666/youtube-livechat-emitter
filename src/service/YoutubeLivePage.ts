import { ChannelId, PageFetcher, Scraper } from "youtube-live-scraper";

export async function getPayloadBaseData(channelId: ChannelId) {
  const page = await PageFetcher.getLivePage(channelId);
  if (page.type !== "video") {
    throw new Error("No live streaming.");
  }

  const payloadBaseData = Scraper.getLiveChatApiParameters(page);

  if (payloadBaseData === undefined) {
    throw new Error("Failed extracting payload data.");
  }

  return payloadBaseData;
}

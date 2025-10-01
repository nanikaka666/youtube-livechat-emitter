import { ChannelId } from "youtube-live-scraper";
import { PageFetcher, Scraper } from "youtube-live-scraper";
import { getPayloadBaseData } from "../../src/service/YoutubeLivePage";

afterEach(() => {
  jest.clearAllMocks();
});

describe("valid cases", () => {
  test("returns data successfully.", async () => {
    jest
      .spyOn(PageFetcher, "getLivePage")
      .mockImplementation(jest.fn(() => Promise.resolve({ type: "video" })) as jest.Mock);

    jest.spyOn(Scraper, "getLiveChatApiParameters").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuation: "CONTINUATION_TEST",
          apiKey: "INNERTUBE_API_KEY_TEST",
          clientName: "INNERTUBE_CLIENT_NAME_TEST",
          clientVersion: "INNERTUBE_CLIENT_VERSION_TEST",
        }),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");

    expect(await getPayloadBaseData(channelId)).toEqual({
      continuation: "CONTINUATION_TEST",
      apiKey: "INNERTUBE_API_KEY_TEST",
      clientName: "INNERTUBE_CLIENT_NAME_TEST",
      clientVersion: "INNERTUBE_CLIENT_VERSION_TEST",
    });

    expect(jest.mocked(PageFetcher.getLivePage).mock.calls.at(0)?.[0]).toEqual(channelId);
  });
});

describe("invalid cases", () => {
  test("if input channel has no live-streaming, then exception is thrown.", () => {
    jest
      .spyOn(PageFetcher, "getLivePage")
      .mockImplementation(jest.fn(() => Promise.resolve({ type: "channel" })) as jest.Mock);

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);
  });

  test("if continuations not founded, then exception is thrown.", async () => {
    jest
      .spyOn(PageFetcher, "getLivePage")
      .mockImplementation(jest.fn(() => Promise.resolve({ type: "video" })) as jest.Mock);

    jest.spyOn(Scraper, "getLiveChatApiParameters").mockReturnValue(undefined);

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);
  });
});

import * as YoutubeLivePage from "../../src/service/YoutubeLivePage";
import * as fetch from "../../src/infrastructure/fetch";
import {
  GetLiveChatApiPayloadBaseData,
  YoutubeLiveChatApi,
} from "../../src/service/YoutubeLiveChatApi";
import { ChannelId } from "../../src/core/ChannelId";
import {
  GetLiveChatApiResponse,
  InvalidationContinuationData,
  ReloadContinuationData,
  TimedContinuationData,
} from "../../src/zod/continuation";
import { AxiosError } from "axios";
import fs from "fs";
import * as ParseArgsForDebug from "../../src/service/ParseArgsForDebug";

describe("check correctness in case of no any troubles.", () => {
  test("execute one of successful story of calling getNextActions, check each steps.", async () => {
    jest.spyOn(fs, "writeFileSync").mockImplementation(jest.fn());
    jest.spyOn(YoutubeLivePage, "getPayloadBaseData").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuation: "CONTINUATION_TEST",
          apiKey: "API_KEY_TEST",
          clientName: "CLIENT_NAME_TEST",
          clientVersion: "CLIENT_VERSION_TEST",
        } satisfies GetLiveChatApiPayloadBaseData),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");
    const liveChatApi = new YoutubeLiveChatApi(channelId);

    await liveChatApi.init();

    expect(YoutubeLivePage.getPayloadBaseData).toHaveBeenCalledTimes(1);
    expect(jest.mocked(YoutubeLivePage.getPayloadBaseData).mock.calls.at(0)?.[0]).toEqual(
      channelId,
    );

    jest.spyOn(fetch, "post").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuationContents: {
            liveChatContinuation: {
              continuations: [
                {
                  invalidationContinuationData: {
                    timeoutMs: 1000,
                    continuation: "NEXT_CONTINUATION",
                  },
                },
              ],
              actions: [
                {
                  addChatItemAction: {
                    item: {
                      liveChatTextMessageRenderer: {
                        message: {
                          runs: [
                            {
                              text: "TEXT_MESSAGE",
                            },
                          ],
                        },
                        id: "LIVE_CHAT_ITEM_ID_1",
                        authorName: { simpleText: "AUTHOR_NAME" },
                        authorPhoto: {
                          thumbnails: [
                            { url: "https://example.com/image1", width: 16, height: 16 },
                          ],
                        },
                        timestampUsec: 100000,
                        authorExternalChannelId: "AUTHOR_CHANNEL_ID_TEST__",
                      },
                    },
                  },
                },
                {
                  removeChatItemAction: {
                    targetItemId: "LIVE_CHAT_ITEM_ID_1",
                  },
                },
              ],
            },
          },
        } satisfies GetLiveChatApiResponse),
      ) as jest.Mock,
    );

    expect(await liveChatApi.getNextActions()).toEqual([
      {
        addChatItemAction: {
          item: {
            liveChatTextMessageRenderer: {
              message: {
                runs: [
                  {
                    text: "TEXT_MESSAGE",
                  },
                ],
              },
              id: "LIVE_CHAT_ITEM_ID_1",
              authorName: { simpleText: "AUTHOR_NAME" },
              authorPhoto: {
                thumbnails: [{ url: "https://example.com/image1", width: 16, height: 16 }],
              },
              timestampUsec: 100000,
              authorExternalChannelId: "AUTHOR_CHANNEL_ID_TEST__",
            },
          },
        },
      },
      {
        removeChatItemAction: {
          targetItemId: "LIVE_CHAT_ITEM_ID_1",
        },
      },
    ]);
    expect(fetch.post).toHaveBeenCalledTimes(1);
    expect(jest.mocked(fetch.post).mock.calls.at(0)?.[0]).toEqual(
      `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=API_KEY_TEST`,
    );
    expect(jest.mocked(fetch.post).mock.calls.at(0)?.[1]).toEqual({
      context: {
        client: {
          clientName: "CLIENT_NAME_TEST",
          clientVersion: "CLIENT_VERSION_TEST",
        },
      },
      continuation: "CONTINUATION_TEST",
    });

    // file writing never occurred.
    expect(fs.writeFileSync).toHaveBeenCalledTimes(0);

    jest.clearAllMocks();
  });

  test.each([
    {
      type: "InvalidationContinuationData" as const,
      data: {
        invalidationContinuationData: {
          timeoutMs: 10000,
          continuation: "INVALIDATION_CONTINUATION_DATA",
        },
      } satisfies InvalidationContinuationData,
    },
    {
      type: "TimedContinuationData" as const,
      data: {
        timedContinuationData: {
          timeoutMs: 20000,
          continuation: "TIMED_CONTINUATION_DATA",
        },
      } satisfies TimedContinuationData,
    },
    {
      type: "ReloadContinuationData" as const,
      data: {
        reloadContinuationData: {
          continuation: "RELOAD_CONTINUATION_DATA",
        },
      } satisfies ReloadContinuationData,
    },
  ])(
    "continuation will be updated correctly, by each type of continuation data.",
    async (continuationData) => {
      jest.spyOn(YoutubeLivePage, "getPayloadBaseData").mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            continuation: "CONTINUATION_TEST",
            apiKey: "API_KEY_TEST",
            clientName: "CLIENT_NAME_TEST",
            clientVersion: "CLIENT_VERSION_TEST",
          } satisfies GetLiveChatApiPayloadBaseData),
        ) as jest.Mock,
      );

      const channelId = new ChannelId("@test_channel");
      const liveChatApi = new YoutubeLiveChatApi(channelId);

      await liveChatApi.init();

      jest.spyOn(fetch, "post").mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            continuationContents: {
              liveChatContinuation: {
                continuations: [continuationData.data],
              },
            },
          } satisfies GetLiveChatApiResponse),
        ) as jest.Mock,
      );

      await liveChatApi.getNextActions();
      await liveChatApi.getNextActions();

      expect(fetch.post).toHaveBeenCalledTimes(2);
      expect(jest.mocked(fetch.post).mock.calls.at(0)?.[1]).toEqual({
        context: {
          client: {
            clientName: "CLIENT_NAME_TEST",
            clientVersion: "CLIENT_VERSION_TEST",
          },
        },
        continuation: "CONTINUATION_TEST",
      });

      const expectedContinuation =
        continuationData.type === "InvalidationContinuationData"
          ? continuationData.data.invalidationContinuationData.continuation
          : continuationData.type === "TimedContinuationData"
            ? continuationData.data.timedContinuationData.continuation
            : continuationData.data.reloadContinuationData.continuation;

      expect(jest.mocked(fetch.post).mock.calls.at(1)?.[1]).toEqual({
        context: {
          client: {
            clientName: "CLIENT_NAME_TEST",
            clientVersion: "CLIENT_VERSION_TEST",
          },
        },
        continuation: expectedContinuation,
      });

      jest.clearAllMocks();
    },
  );

  test("when there is no live chat event, getNextActions returns undefined", async () => {
    jest.spyOn(YoutubeLivePage, "getPayloadBaseData").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuation: "CONTINUATION_TEST",
          apiKey: "API_KEY_TEST",
          clientName: "CLIENT_NAME_TEST",
          clientVersion: "CLIENT_VERSION_TEST",
        } satisfies GetLiveChatApiPayloadBaseData),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");
    const liveChatApi = new YoutubeLiveChatApi(channelId);

    await liveChatApi.init();

    jest.spyOn(fetch, "post").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuationContents: {
            liveChatContinuation: {
              continuations: [
                {
                  invalidationContinuationData: {
                    timeoutMs: 1000,
                    continuation: "NEXT_CONTINUATION",
                  },
                },
              ],
            },
          },
        } satisfies GetLiveChatApiResponse),
      ) as jest.Mock,
    );

    expect(await liveChatApi.getNextActions()).toBe(undefined);

    jest.clearAllMocks();
  });
});

describe("check correctness in case of under the troubles.", () => {
  test("if fail to get data from live page, init() throws exception.", () => {
    jest
      .spyOn(YoutubeLivePage, "getPayloadBaseData")
      .mockImplementation(jest.fn(() => Promise.reject(new Error())) as jest.Mock);

    const channelId = new ChannelId("@test_channel");
    const liveChatApi = new YoutubeLiveChatApi(channelId);

    expect(async () => await liveChatApi.init()).rejects.toThrow(Error);

    jest.clearAllMocks();
  });

  test("if getNextActions was called before calling init(), exception is thrown", async () => {
    const channelId = new ChannelId("@test_channel");
    const liveChatApi = new YoutubeLiveChatApi(channelId);

    expect(async () => await liveChatApi.getNextActions()).rejects.toThrow(Error);

    jest.clearAllMocks();
  });

  test("if get_live_chat api returns bad status, then exception is thrown, and same continuation will be used at next calling.", async () => {
    jest.spyOn(YoutubeLivePage, "getPayloadBaseData").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuation: "CONTINUATION_TEST",
          apiKey: "API_KEY_TEST",
          clientName: "CLIENT_NAME_TEST",
          clientVersion: "CLIENT_VERSION_TEST",
        } satisfies GetLiveChatApiPayloadBaseData),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");
    const liveChatApi = new YoutubeLiveChatApi(channelId);

    await liveChatApi.init();

    jest
      .spyOn(fetch, "post")
      .mockImplementation(jest.fn(() => Promise.reject(new AxiosError())) as jest.Mock);

    expect(async () => await liveChatApi.getNextActions()).rejects.toThrow(AxiosError);
    expect(async () => await liveChatApi.getNextActions()).rejects.toThrow(AxiosError); // call two times

    expect(jest.mocked(fetch.post).mock.calls.at(0)?.[1]).toEqual({
      context: {
        client: {
          clientName: "CLIENT_NAME_TEST",
          clientVersion: "CLIENT_VERSION_TEST",
        },
      },
      continuation: "CONTINUATION_TEST",
    });
    expect(jest.mocked(fetch.post).mock.calls.at(1)?.[1]).toEqual({
      context: {
        client: {
          clientName: "CLIENT_NAME_TEST",
          clientVersion: "CLIENT_VERSION_TEST",
        },
      },
      continuation: "CONTINUATION_TEST", // same as first time
    });

    jest.clearAllMocks();
  });

  test("if output flag is valid and api response contains unknown json structure, a file will be output.", async () => {
    jest.spyOn(YoutubeLivePage, "getPayloadBaseData").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuation: "CONTINUATION_TEST",
          apiKey: "API_KEY_TEST",
          clientName: "CLIENT_NAME_TEST",
          clientVersion: "CLIENT_VERSION_TEST",
        } satisfies GetLiveChatApiPayloadBaseData),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");
    const liveChatApi = new YoutubeLiveChatApi(channelId);

    await liveChatApi.init();

    jest.spyOn(fetch, "post").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          continuationContents: {
            liveChatContinuation: {
              continuations: [
                {
                  invalidationContinuationData: {
                    timeoutMs: 1000,
                    continuation: "NEXT_CONTINUATION",
                  },
                },
              ],
              actions: [
                {
                  unknownTypeOfActions: {},
                },
              ],
            },
          },
        }),
      ) as jest.Mock,
    );
    jest.spyOn(fs, "writeFileSync").mockImplementation(jest.fn());
    jest.spyOn(ParseArgsForDebug, "getOutputFlag").mockReturnValue(true);

    // use try-catch clause, because if test code like below, it bring unexpected results for toHaveBeenCalled
    // expect(async () => await liveChatApi.getNextActions()).rejects.toThrow(ZodError);
    try {
      await liveChatApi.getNextActions();
    } catch {}

    // the json file will be output, including unknown json structures.
    expect(ParseArgsForDebug.getOutputFlag).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
  });
});

import { ChannelId } from "../../src/core/ChannelId";
import * as fetch from "../../src/infrastructure/fetch";
import { getPayloadBaseData } from "../../src/service/YoutubeLivePage";

describe("valid cases", () => {
  test("returns data successfully with youtube id.", async () => {
    jest.spyOn(fetch, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve(`
            <html>
                <head>
                    <link rel="canonical" href="https://www.youtube.com/watch?v=abcdefghijk">
                </head>
                <script>
                    {"continuation":"CONTINUATION_TEST",
                    "INNERTUBE_API_KEY":"INNERTUBE_API_KEY_TEST",
                    "INNERTUBE_CLIENT_NAME":"INNERTUBE_CLIENT_NAME_TEST",
                    "INNERTUBE_CLIENT_VERSION":"INNERTUBE_CLIENT_VERSION_TEST"}
                </script>
            </html>
        `),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("testtesttesttesttesttest");

    expect(await getPayloadBaseData(channelId)).toEqual({
      continuation: "CONTINUATION_TEST",
      apiKey: "INNERTUBE_API_KEY_TEST",
      clientName: "INNERTUBE_CLIENT_NAME_TEST",
      clientVersion: "INNERTUBE_CLIENT_VERSION_TEST",
    });

    expect(fetch.get).toHaveBeenCalledTimes(1);
    expect(jest.mocked(fetch.get).mock.calls.at(0)?.[0]).toEqual(
      "https://www.youtube.com/channel/testtesttesttesttesttest/live",
    );

    jest.clearAllMocks();
  });
  test("returns data successfully with youtube handle.", async () => {
    jest.spyOn(fetch, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve(`
            <html>
                <head>
                    <link rel="canonical" href="https://www.youtube.com/watch?v=abcdefghijk">
                </head>
                <script>
                    {"continuation":"CONTINUATION_TEST",
                    "INNERTUBE_API_KEY":"INNERTUBE_API_KEY_TEST",
                    "INNERTUBE_CLIENT_NAME":"INNERTUBE_CLIENT_NAME_TEST",
                    "INNERTUBE_CLIENT_VERSION":"INNERTUBE_CLIENT_VERSION_TEST"}
                </script>
            </html>
        `),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");

    expect(await getPayloadBaseData(channelId)).toEqual({
      continuation: "CONTINUATION_TEST",
      apiKey: "INNERTUBE_API_KEY_TEST",
      clientName: "INNERTUBE_CLIENT_NAME_TEST",
      clientVersion: "INNERTUBE_CLIENT_VERSION_TEST",
    });

    expect(fetch.get).toHaveBeenCalledTimes(1);
    expect(jest.mocked(fetch.get).mock.calls.at(0)?.[0]).toEqual(
      "https://www.youtube.com/@test_channel/live",
    );

    jest.clearAllMocks();
  });
});

describe("invalid cases", () => {
  test("if fail to fetch live page, then exception is thrown.", async () => {
    jest
      .spyOn(fetch, "get")
      .mockImplementation(
        jest.fn(() => Promise.reject(new Error("something wrong."))) as jest.Mock,
      );

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);

    jest.clearAllMocks();
  });
  test("if input channel has no live-streaming, then exception is thrown.", async () => {
    jest.spyOn(fetch, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve(`
            <html>
                <script>
                    {"continuation":"CONTINUATION_TEST",
                    "INNERTUBE_API_KEY":"INNERTUBE_API_KEY_TEST",
                    "INNERTUBE_CLIENT_NAME":"INNERTUBE_CLIENT_NAME_TEST",
                    "INNERTUBE_CLIENT_VERSION":"INNERTUBE_CLIENT_VERSION_TEST"}
                </script>
            </html>
        `),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);

    jest.clearAllMocks();
  });

  test("if continuation key not found, then exception is thrown.", async () => {
    jest.spyOn(fetch, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve(`
            <html>
                <head>
                    <link rel="canonical" href="https://www.youtube.com/watch?v=abcdefghijk">
                </head>
                <script>
                    {
                    "INNERTUBE_API_KEY":"INNERTUBE_API_KEY_TEST",
                    "INNERTUBE_CLIENT_NAME":"INNERTUBE_CLIENT_NAME_TEST",
                    "INNERTUBE_CLIENT_VERSION":"INNERTUBE_CLIENT_VERSION_TEST"}
                </script>
            </html>
        `),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);

    jest.clearAllMocks();
  });

  test("if INNERTUBE_API_KEY key not found, then exception is thrown.", async () => {
    jest.spyOn(fetch, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve(`
            <html>
                <head>
                    <link rel="canonical" href="https://www.youtube.com/watch?v=abcdefghijk">
                </head>
                <script>
                    {"continuation":"CONTINUATION_TEST",
                    "INNERTUBE_CLIENT_NAME":"INNERTUBE_CLIENT_NAME_TEST",
                    "INNERTUBE_CLIENT_VERSION":"INNERTUBE_CLIENT_VERSION_TEST"}
                </script>
            </html>
        `),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);

    jest.clearAllMocks();
  });
  test("if INNERTUBE_CLIENT_NAME key not found, then exception is thrown.", async () => {
    jest.spyOn(fetch, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve(`
            <html>
                <head>
                    <link rel="canonical" href="https://www.youtube.com/watch?v=abcdefghijk">
                </head>
                <script>
                    {"continuation":"CONTINUATION_TEST",
                    "INNERTUBE_API_KEY":"INNERTUBE_API_KEY_TEST",
                    "INNERTUBE_CLIENT_VERSION":"INNERTUBE_CLIENT_VERSION_TEST"}
                </script>
            </html>
        `),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);

    jest.clearAllMocks();
  });
  test("if INNERTUBE_CLIENT_VERSION key not found, then exception is thrown.", async () => {
    jest.spyOn(fetch, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve(`
            <html>
                <head>
                    <link rel="canonical" href="https://www.youtube.com/watch?v=abcdefghijk">
                </head>
                <script>
                    {"continuation":"CONTINUATION_TEST",
                    "INNERTUBE_API_KEY":"INNERTUBE_API_KEY_TEST",
                    "INNERTUBE_CLIENT_NAME":"INNERTUBE_CLIENT_NAME_TEST",
                    }
                </script>
            </html>
        `),
      ) as jest.Mock,
    );

    const channelId = new ChannelId("@test_channel");

    expect(async () => await getPayloadBaseData(channelId)).rejects.toThrow(Error);

    jest.clearAllMocks();
  });
});

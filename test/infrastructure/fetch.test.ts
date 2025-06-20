import axios, { AxiosError } from "axios";
import { post, get } from "../../src/infrastructure/fetch";
import { GetLiveChatApiPayloadBaseData } from "../../src/service/YoutubeLiveChatApi";

describe("post", () => {
  test("post method just only return data property.", async () => {
    jest.spyOn(axios, "post").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          data: "response data strings.",
        }),
      ) as jest.Mock,
    );

    const url = "https://example.com/post_endpoint";
    const postData: GetLiveChatApiPayloadBaseData = {
      continuation: "continuation",
      apiKey: "apiKey",
      clientName: "clientName",
      clientVersion: "0.1",
    };

    const res = await post(url, postData);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(jest.mocked(axios.post).mock.calls.at(0)?.[0]).toEqual(url);
    expect(jest.mocked(axios.post).mock.calls.at(0)?.[1]).toEqual(postData);
    expect(res).toEqual("response data strings.");

    jest.clearAllMocks();
  });

  test("if axios throws AxiosError then throw it", async () => {
    jest
      .spyOn(axios, "post")
      .mockImplementation(jest.fn(() => Promise.reject(new AxiosError())) as jest.Mock);

    const url = "https://example.com/post_endpoint";
    const postData = {};

    expect(async () => await post(url, postData)).rejects.toBeInstanceOf(AxiosError);
    expect(axios.post).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
  });
});

describe("get", () => {
  test("get method just only return data property.", async () => {
    jest.spyOn(axios, "get").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          data: "response data strings.",
        }),
      ) as jest.Mock,
    );

    const url = "https://example.com";
    const res = await get(url);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(jest.mocked(axios.get).mock.calls.at(0)?.[0]).toEqual(url);
    expect(res).toEqual("response data strings.");

    jest.clearAllMocks();
  });

  test("if axios throws AxiosError then throw it", async () => {
    jest
      .spyOn(axios, "get")
      .mockImplementation(jest.fn(() => Promise.reject(new AxiosError())) as jest.Mock);

    const url = "https://example.com/post_endpoint";

    expect(async () => await get(url)).rejects.toBeInstanceOf(AxiosError);
    expect(axios.get).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
  });
});

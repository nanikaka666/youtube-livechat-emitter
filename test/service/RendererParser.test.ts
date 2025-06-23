import { ChannelId } from "../../src/core/ChannelId";
import { LiveChatItemId } from "../../src/core/LiveChatItemId";
import { parseLiveChatTextMessageRenderer } from "../../src/service/RendererParser";
import { ChatItemText } from "../../src/types/liveChat";
import { LiveChatTextMessageRenderer } from "../../src/zod/renderer";

describe("parseLiveChatTextMessageRenderer", () => {
  test("general pattern", () => {
    const renderer: LiveChatTextMessageRenderer = {
      liveChatTextMessageRenderer: {
        id: "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY001",
        authorName: {
          simpleText: "Author Name",
        },
        authorPhoto: {
          thumbnails: [
            { url: "https://example.com/icon/1.png", width: 32, height: 32 },
            { url: "https://example.com/icon/1.png", width: 48, height: 48 },
          ],
        },
        timestampUsec: 100000,
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon001",
        message: {
          runs: [
            { text: "neighbor texts are " },
            { text: "concatinated." },
            {
              emoji: {
                emojiId: "Emoji Id",
                image: {
                  thumbnails: [
                    { url: "https://example.com/emoji/1.png", width: 16, height: 16 },
                    { url: "https://example.com/emoji/1.png", width: 32, height: 32 },
                  ],
                },
              },
            },
            { text: "text object that split by Emoji will not be concatinated." },
          ],
        },
      },
    };
    expect(parseLiveChatTextMessageRenderer(renderer)).toEqual({
      type: "text",
      id: new LiveChatItemId("ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY001"),
      timestamp: 100000,
      author: {
        channelId: new ChannelId("UCAXPWkBVUzxCSrBiqDon001"),
        name: "Author Name",
        thumbnails: [
          {
            url: "https://example.com/icon/1.png",
            size: {
              width: 32,
              height: 32,
            },
          },
          {
            url: "https://example.com/icon/1.png",
            size: {
              width: 48,
              height: 48,
            },
          },
        ],
        authorType: "general",
        memberships: undefined,
      },
      messages: [
        { type: "text", text: "neighbor texts are concatinated." },
        {
          type: "images",
          images: [
            { url: "https://example.com/emoji/1.png", size: { width: 16, height: 16 } },
            { url: "https://example.com/emoji/1.png", size: { width: 32, height: 32 } },
          ],
        },
        { type: "text", text: "text object that split by Emoji will not be concatinated." },
      ],
    } satisfies ChatItemText);
  });

  test("moderator's chat pattern", () => {
    const renderer: LiveChatTextMessageRenderer = {
      liveChatTextMessageRenderer: {
        id: "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY002",
        authorName: {
          simpleText: "Moderator Name",
        },
        authorPhoto: {
          thumbnails: [
            { url: "https://example.com/icon/2.png", width: 32, height: 32 },
            { url: "https://example.com/icon/2.png", width: 48, height: 48 },
          ],
        },
        authorBadges: [
          {
            liveChatAuthorBadgeRenderer: {
              tooltip: "Moderator",
              icon: {
                iconType: "MODERATOR",
              },
            },
          },
        ],
        timestampUsec: 100000,
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon002",
        message: {
          runs: [{ text: "moderator chat" }],
        },
      },
    };
    expect(parseLiveChatTextMessageRenderer(renderer)).toEqual({
      type: "text",
      id: new LiveChatItemId("ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY002"),
      timestamp: 100000,
      author: {
        channelId: new ChannelId("UCAXPWkBVUzxCSrBiqDon002"),
        name: "Moderator Name",
        thumbnails: [
          {
            url: "https://example.com/icon/2.png",
            size: {
              width: 32,
              height: 32,
            },
          },
          {
            url: "https://example.com/icon/2.png",
            size: {
              width: 48,
              height: 48,
            },
          },
        ],
        authorType: "moderator",
        memberships: undefined,
      },
      messages: [{ type: "text", text: "moderator chat" }],
    } satisfies ChatItemText);
  });

  test("owner's chat pattern", () => {
    const renderer: LiveChatTextMessageRenderer = {
      liveChatTextMessageRenderer: {
        id: "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY003",
        authorName: {
          simpleText: "Owner Name",
        },
        authorPhoto: {
          thumbnails: [
            { url: "https://example.com/icon/3.png", width: 32, height: 32 },
            { url: "https://example.com/icon/3.png", width: 48, height: 48 },
          ],
        },
        authorBadges: [
          {
            liveChatAuthorBadgeRenderer: {
              tooltip: "Owner",
              icon: {
                iconType: "OWNER",
              },
            },
          },
        ],
        timestampUsec: 100000,
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon003",
        message: {
          runs: [{ text: "owner chat" }],
        },
      },
    };
    expect(parseLiveChatTextMessageRenderer(renderer)).toEqual({
      type: "text",
      id: new LiveChatItemId("ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY003"),
      timestamp: 100000,
      author: {
        channelId: new ChannelId("UCAXPWkBVUzxCSrBiqDon003"),
        name: "Owner Name",
        thumbnails: [
          {
            url: "https://example.com/icon/3.png",
            size: {
              width: 32,
              height: 32,
            },
          },
          {
            url: "https://example.com/icon/3.png",
            size: {
              width: 48,
              height: 48,
            },
          },
        ],
        authorType: "owner",
        memberships: undefined,
      },
      messages: [{ type: "text", text: "owner chat" }],
    } satisfies ChatItemText);
  });

  test("membership's chat pattern", () => {
    const renderer: LiveChatTextMessageRenderer = {
      liveChatTextMessageRenderer: {
        id: "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY004",
        authorName: {
          simpleText: "Member Name",
        },
        authorPhoto: {
          thumbnails: [
            { url: "https://example.com/icon/4.png", width: 32, height: 32 },
            { url: "https://example.com/icon/4.png", width: 48, height: 48 },
          ],
        },
        authorBadges: [
          {
            liveChatAuthorBadgeRenderer: {
              tooltip: "Member (1 month)",
              customThumbnail: {
                thumbnails: [
                  {
                    url: "https://example.com/membership/4.png",
                    width: 16,
                    height: 16,
                  },
                  {
                    url: "https://example.com/membership/4.png",
                    width: 32,
                    height: 32,
                  },
                ],
              },
            },
          },
        ],
        timestampUsec: 100000,
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon004",
        message: {
          runs: [{ text: "member chat" }],
        },
      },
    };
    expect(parseLiveChatTextMessageRenderer(renderer)).toEqual({
      type: "text",
      id: new LiveChatItemId("ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY004"),
      timestamp: 100000,
      author: {
        channelId: new ChannelId("UCAXPWkBVUzxCSrBiqDon004"),
        name: "Member Name",
        thumbnails: [
          {
            url: "https://example.com/icon/4.png",
            size: {
              width: 32,
              height: 32,
            },
          },
          {
            url: "https://example.com/icon/4.png",
            size: {
              width: 48,
              height: 48,
            },
          },
        ],
        authorType: "general",
        memberships: {
          label: "Member (1 month)",
          thumbnails: [
            {
              url: "https://example.com/membership/4.png",
              size: {
                width: 16,
                height: 16,
              },
            },
            {
              url: "https://example.com/membership/4.png",
              size: {
                width: 32,
                height: 32,
              },
            },
          ],
        },
      },
      messages: [{ type: "text", text: "member chat" }],
    } satisfies ChatItemText);
  });
});

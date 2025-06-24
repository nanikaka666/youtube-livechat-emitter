import { ChannelId } from "../../src/core/ChannelId";
import { LiveChatItemId } from "../../src/core/LiveChatItemId";
import {
  parseLiveChatMembershipItemRenderer,
  parseLiveChatPaidMessageRenderer,
  parseLiveChatPaidStickerRenderer,
  parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
  parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
  parseLiveChatTextMessageRenderer,
  parseLiveChatTickerPaidMessageItemRenderer,
  parseLiveChatTickerPaidStickerItemRenderer,
} from "../../src/service/RendererParser";
import {
  Blue,
  ChatItemSuperChat,
  ChatItemSuperSticker,
  ChatItemText,
  GiftRedemption,
  LightBlue,
  Magenta,
  MembershipItem,
  MembershipMilestone,
  NewMembership,
  Orange,
  Red,
  SponsorshipsGift,
  SuperChatTicker,
  SuperStickerTicker,
  Yellow,
  YellowGreen,
} from "../../src/types/liveChat";
import {
  LiveChatMembershipItemRenderer,
  LiveChatPaidMessageRenderer,
  LiveChatPaidStickerRenderer,
  LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
  LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
  LiveChatTextMessageRenderer,
  LiveChatTickerPaidMessageItemRenderer,
  LiveChatTickerPaidStickerItemRenderer,
} from "../../src/zod/renderer";

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

describe("parseLiveChatPaidMessageRenderer", () => {
  test("Blue super chat. Blue can't contain message.", () => {
    const renderer: LiveChatPaidMessageRenderer = {
      liveChatPaidMessageRenderer: {
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
        purchaseAmountText: {
          simpleText: "100 yen",
        },
        bodyBackgroundColor: 0xff1e88e5,
      },
    };
    expect(parseLiveChatPaidMessageRenderer(renderer)).toEqual({
      type: "superChat",
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
      superChat: {
        amount: "100 yen",
        color: Blue,
      },
    } satisfies ChatItemSuperChat);
  });

  test("LightBlue super chat. From LightBlue level, it can contain message.", () => {
    const renderer: LiveChatPaidMessageRenderer = {
      liveChatPaidMessageRenderer: {
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
          runs: [{ text: "superchat" }],
        },
        purchaseAmountText: {
          simpleText: "200 yen",
        },
        bodyBackgroundColor: 0xff00e5ff,
      },
    };
    expect(parseLiveChatPaidMessageRenderer(renderer)).toEqual({
      type: "superChat",
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
      messages: [{ type: "text", text: "superchat" }],
      superChat: {
        amount: "200 yen",
        color: LightBlue,
      },
    } satisfies ChatItemSuperChat);
  });

  test("YellowGreen super chat.", () => {
    const renderer: LiveChatPaidMessageRenderer = {
      liveChatPaidMessageRenderer: {
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
          runs: [{ text: "superchat" }],
        },
        purchaseAmountText: {
          simpleText: "500 yen",
        },
        bodyBackgroundColor: 0xff1de9b6,
      },
    };
    expect(parseLiveChatPaidMessageRenderer(renderer)).toEqual({
      type: "superChat",
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
      messages: [{ type: "text", text: "superchat" }],
      superChat: {
        amount: "500 yen",
        color: YellowGreen,
      },
    } satisfies ChatItemSuperChat);
  });

  test("Yellow super chat.", () => {
    const renderer: LiveChatPaidMessageRenderer = {
      liveChatPaidMessageRenderer: {
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
          runs: [{ text: "superchat" }],
        },
        purchaseAmountText: {
          simpleText: "$10.00",
        },
        bodyBackgroundColor: 0xffffca28,
      },
    };
    expect(parseLiveChatPaidMessageRenderer(renderer)).toEqual({
      type: "superChat",
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
      messages: [{ type: "text", text: "superchat" }],
      superChat: {
        amount: "$10.00",
        color: Yellow,
      },
    } satisfies ChatItemSuperChat);
  });

  test("Orange super chat.", () => {
    const renderer: LiveChatPaidMessageRenderer = {
      liveChatPaidMessageRenderer: {
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
          runs: [{ text: "superchat" }],
        },
        purchaseAmountText: {
          simpleText: "2,000 yen",
        },
        bodyBackgroundColor: 0xfff57c00,
      },
    };
    expect(parseLiveChatPaidMessageRenderer(renderer)).toEqual({
      type: "superChat",
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
      messages: [{ type: "text", text: "superchat" }],
      superChat: {
        amount: "2,000 yen",
        color: Orange,
      },
    } satisfies ChatItemSuperChat);
  });

  test("Magenta super chat.", () => {
    const renderer: LiveChatPaidMessageRenderer = {
      liveChatPaidMessageRenderer: {
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
          runs: [{ text: "superchat" }],
        },
        purchaseAmountText: {
          simpleText: "5,000 yen",
        },
        bodyBackgroundColor: 0xffe91e63,
      },
    };
    expect(parseLiveChatPaidMessageRenderer(renderer)).toEqual({
      type: "superChat",
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
      messages: [{ type: "text", text: "superchat" }],
      superChat: {
        amount: "5,000 yen",
        color: Magenta,
      },
    } satisfies ChatItemSuperChat);
  });

  test("Red super chat, by Membership member.", () => {
    const renderer: LiveChatPaidMessageRenderer = {
      liveChatPaidMessageRenderer: {
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
          runs: [{ text: "superchat" }],
        },
        purchaseAmountText: {
          simpleText: "NT$1,500.00",
        },
        bodyBackgroundColor: 0xffe62117,
      },
    };
    expect(parseLiveChatPaidMessageRenderer(renderer)).toEqual({
      type: "superChat",
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
      messages: [{ type: "text", text: "superchat" }],
      superChat: {
        amount: "NT$1,500.00",
        color: Red,
      },
    } satisfies ChatItemSuperChat);
  });
});

describe("parseLiveChatPaidStickerRenderer", () => {
  test("Blue super sticker.", () => {
    const renderer: LiveChatPaidStickerRenderer = {
      liveChatPaidStickerRenderer: {
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
        purchaseAmountText: {
          simpleText: "100 yen",
        },
        sticker: {
          thumbnails: [
            {
              url: "//example.com/sticker/1",
              width: 16,
              height: 16,
            },
          ],
        },
        backgroundColor: 0xff1e88e5,
      },
    };
    expect(parseLiveChatPaidStickerRenderer(renderer)).toEqual({
      type: "superSticker",
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
      superSticker: {
        amount: "100 yen",
        thumbnails: [
          {
            url: "https://example.com/sticker/1",
            size: {
              width: 16,
              height: 16,
            },
          },
        ],
        color: Blue,
      },
    } satisfies ChatItemSuperSticker);
  });
});

describe("parseLiveChatMembershipItemRenderer", () => {
  test("New membership", () => {
    const renderer: LiveChatMembershipItemRenderer = {
      liveChatMembershipItemRenderer: {
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
        authorBadges: [
          {
            liveChatAuthorBadgeRenderer: {
              tooltip: "New member",
              customThumbnail: {
                thumbnails: [
                  {
                    url: "https://example.com/custom/1",
                    width: 16,
                    height: 16,
                  },
                  {
                    url: "https://example.com/custom/1",
                    width: 32,
                    height: 32,
                  },
                ],
              },
            },
          },
        ],
        timestampUsec: 100000,
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon001",
        headerSubtext: {
          runs: [{ text: "welcome to " }, { text: "Membership Name." }],
        },
      },
    };
    expect(parseLiveChatMembershipItemRenderer(renderer)).toEqual({
      type: "new",
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
        memberships: {
          label: "New member",
          thumbnails: [
            {
              url: "https://example.com/custom/1",
              size: {
                width: 16,
                height: 16,
              },
            },
            {
              url: "https://example.com/custom/1",
              size: {
                width: 32,
                height: 32,
              },
            },
          ],
        },
      },
      messages: [{ type: "text", text: "welcome to Membership Name." }],
    } satisfies NewMembership);
  });

  test("New membership, headerSubtext has only simpleText.", () => {
    const renderer: LiveChatMembershipItemRenderer = {
      liveChatMembershipItemRenderer: {
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
        authorBadges: [
          {
            liveChatAuthorBadgeRenderer: {
              tooltip: "New member",
              customThumbnail: {
                thumbnails: [
                  {
                    url: "https://example.com/custom/1",
                    width: 16,
                    height: 16,
                  },
                  {
                    url: "https://example.com/custom/1",
                    width: 32,
                    height: 32,
                  },
                ],
              },
            },
          },
        ],
        timestampUsec: 100000,
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon001",
        headerSubtext: {
          simpleText: "welcome to Membership Name.",
        },
      },
    };
    expect(parseLiveChatMembershipItemRenderer(renderer)).toEqual({
      type: "new",
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
        memberships: {
          label: "New member",
          thumbnails: [
            {
              url: "https://example.com/custom/1",
              size: {
                width: 16,
                height: 16,
              },
            },
            {
              url: "https://example.com/custom/1",
              size: {
                width: 32,
                height: 32,
              },
            },
          ],
        },
      },
      messages: [{ type: "text", text: "welcome to Membership Name." }],
    } satisfies NewMembership);
  });

  test("Membership Milestone", () => {
    const renderer: LiveChatMembershipItemRenderer = {
      liveChatMembershipItemRenderer: {
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
        authorBadges: [
          {
            liveChatAuthorBadgeRenderer: {
              tooltip: "6 months",
              customThumbnail: {
                thumbnails: [
                  {
                    url: "https://example.com/custom/1",
                    width: 16,
                    height: 16,
                  },
                  {
                    url: "https://example.com/custom/1",
                    width: 32,
                    height: 32,
                  },
                ],
              },
            },
          },
        ],
        timestampUsec: 100000,
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon001",
        headerPrimaryText: {
          runs: [{ text: "Membership continues " }, { text: "11 " }, { text: "months" }],
        },
        headerSubtext: {
          simpleText: "Membership Name.",
        },
        message: {
          runs: [
            {
              text: "Hello, i am a long member.",
            },
          ],
        },
      },
    };
    expect(parseLiveChatMembershipItemRenderer(renderer)).toEqual({
      type: "milestone",
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
        memberships: {
          label: "6 months",
          thumbnails: [
            {
              url: "https://example.com/custom/1",
              size: {
                width: 16,
                height: 16,
              },
            },
            {
              url: "https://example.com/custom/1",
              size: {
                width: 32,
                height: 32,
              },
            },
          ],
        },
      },
      messages: [{ type: "text", text: "Hello, i am a long member." }],
      milestone: [{ type: "text", text: "Membership continues 11 months" }],
    } satisfies MembershipMilestone);
  });
});

describe("parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer", () => {
  test("someone purchased gift.", () => {
    const renderer: LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer = {
      liveChatSponsorshipsGiftPurchaseAnnouncementRenderer: {
        header: {
          liveChatSponsorshipsHeaderRenderer: {
            authorName: {
              simpleText: "Author Name",
            },
            authorPhoto: {
              thumbnails: [
                { url: "https://example.com/icon/1.png", width: 32, height: 32 },
                { url: "https://example.com/icon/1.png", width: 48, height: 48 },
              ],
            },
            primaryText: {
              runs: [
                { text: "Gifted " },
                { text: "1" },
                { text: " " },
                { text: "Membership Name" },
                { text: " memberships" },
              ],
            },
            authorBadges: [
              {
                liveChatAuthorBadgeRenderer: {
                  tooltip: "6 months",
                  customThumbnail: {
                    thumbnails: [
                      {
                        url: "https://example.com/custom/1",
                        width: 16,
                        height: 16,
                      },
                      {
                        url: "https://example.com/custom/1",
                        width: 32,
                        height: 32,
                      },
                    ],
                  },
                },
              },
            ],
            image: {
              thumbnails: [{ url: "https://example.com/gift" }], // don't have sizes
            },
          },
        },
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon001",
      },
    };
    expect(parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(renderer)).toEqual({
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
        memberships: {
          label: "6 months",
          thumbnails: [
            {
              url: "https://example.com/custom/1",
              size: {
                width: 16,
                height: 16,
              },
            },
            {
              url: "https://example.com/custom/1",
              size: {
                width: 32,
                height: 32,
              },
            },
          ],
        },
      },
      messages: [{ type: "text", text: "Gifted 1 Membership Name memberships" }],
      images: [{ url: "https://example.com/gift" }],
    } satisfies SponsorshipsGift);
  });
});

describe("parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer", () => {
  test("someone receive gift", () => {
    const renderer: LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer = {
      liveChatSponsorshipsGiftRedemptionAnnouncementRenderer: {
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
            {
              text: "was gifted a membership by ",
            },
            {
              text: "Gift sender name",
            },
          ],
        },
      },
    };
    expect(parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(renderer)).toEqual({
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
      messages: [{ type: "text", text: "was gifted a membership by Gift sender name" }],
    } satisfies GiftRedemption);
  });
});

describe("parseLiveChatTickerPaidMessageItemRenderer", () => {
  test("someone purchased super chat", () => {
    const renderer: LiveChatTickerPaidMessageItemRenderer = {
      liveChatTickerPaidMessageItemRenderer: {
        id: "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY001",
        authorPhoto: {
          thumbnails: [
            { url: "https://example.com/icon/1.png", width: 32, height: 32 },
            { url: "https://example.com/icon/1.png", width: 48, height: 48 },
          ],
        },
        durationSec: 300,
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatPaidMessageRenderer: {
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
                  runs: [{ text: "superchat" }],
                },
                purchaseAmountText: {
                  simpleText: "200 yen",
                },
                bodyBackgroundColor: 0xff00e5ff,
              },
            },
          },
        },
      },
    };
    expect(parseLiveChatTickerPaidMessageItemRenderer(renderer)).toEqual({
      type: "superChat",
      durationSec: 300,
      item: {
        type: "superChat",
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
        messages: [{ type: "text", text: "superchat" }],
        superChat: {
          amount: "200 yen",
          color: LightBlue,
        },
      },
    } satisfies SuperChatTicker);
  });
});

describe("parseLiveChatTickerPaidStickerItemRenderer", () => {
  test("someone purchased super sticker", () => {
    const renderer: LiveChatTickerPaidStickerItemRenderer = {
      liveChatTickerPaidStickerItemRenderer: {
        id: "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJY001",
        authorPhoto: {
          thumbnails: [
            { url: "https://example.com/icon/1.png", width: 32, height: 32 },
            { url: "https://example.com/icon/1.png", width: 48, height: 48 },
          ],
        },
        authorExternalChannelId: "UCAXPWkBVUzxCSrBiqDon001",
        durationSec: 300,
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatPaidStickerRenderer: {
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
                purchaseAmountText: {
                  simpleText: "100 yen",
                },
                sticker: {
                  thumbnails: [
                    {
                      url: "//example.com/sticker/1",
                      width: 16,
                      height: 16,
                    },
                  ],
                },
                backgroundColor: 0xff1e88e5,
              },
            },
          },
        },
      },
    };
    expect(parseLiveChatTickerPaidStickerItemRenderer(renderer)).toEqual({
      type: "superSticker",
      durationSec: 300,
      item: {
        type: "superSticker",
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
        superSticker: {
          amount: "100 yen",
          thumbnails: [
            {
              url: "https://example.com/sticker/1",
              size: {
                width: 16,
                height: 16,
              },
            },
          ],
          color: Blue,
        },
      },
    } satisfies SuperStickerTicker);
  });
});

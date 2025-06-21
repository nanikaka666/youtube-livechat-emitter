import { AddChatItemAction } from "../../src/zod/action";
import {
  LiveChatPaidMessageRenderer,
  LiveChatPaidStickerRenderer,
  LiveChatTextMessageRenderer,
} from "../../src/zod/renderer";

export const AddChatItemAction_TextMessage: AddChatItemAction = {
  addChatItemAction: {
    item: {
      liveChatTextMessageRenderer: {
        message: {
          runs: [
            { text: "MESSAGE_TEXT" },
            {
              emoji: {
                emojiId: "EMOJI_ID",
                image: {
                  thumbnails: [{ url: "IMAGE URL", width: 16, height: 16 }],
                },
              },
            },
          ],
        },
        id: "LiveChatItemId00000000000000000000000001",
        authorName: {
          simpleText: "AUTHOR_NAME",
        },
        authorPhoto: {
          thumbnails: [{ url: "AUTHOR IMAGE URL", width: 32, height: 32 }],
        },
        timestampUsec: 10000,
        authorExternalChannelId: "AUTHOR_EXTERNALCHANNELID",
      },
    } satisfies LiveChatTextMessageRenderer,
  },
};

export const AddChatItemAction_SuperChat: AddChatItemAction = {
  addChatItemAction: {
    item: {
      liveChatPaidMessageRenderer: {
        message: {
          runs: [
            { text: "MESSAGE_TEXT_SUPERCHAT" },
            {
              emoji: {
                emojiId: "EMOJI_ID",
                image: {
                  thumbnails: [{ url: "IMAGE URL", width: 16, height: 16 }],
                },
              },
            },
          ],
        },
        id: "LiveChatItemId00000000000000000000000002",
        authorName: {
          simpleText: "AUTHOR_NAME",
        },
        authorPhoto: {
          thumbnails: [{ url: "AUTHOR IMAGE URL", width: 32, height: 32 }],
        },
        authorBadges: [
          {
            liveChatAuthorBadgeRenderer: {
              icon: {
                iconType: "MODERATOR",
              },
              tooltip: "moderator",
            },
          },
        ],
        timestampUsec: 20000,
        authorExternalChannelId: "AUTHOR_EXTERNALCHANNELID",
        purchaseAmountText: {
          simpleText: "A$10.00",
        },
        bodyBackgroundColor: 4294953512,
      },
    } satisfies LiveChatPaidMessageRenderer,
  },
};

export const AddChatItemAction_SuperSticker: AddChatItemAction = {
  addChatItemAction: {
    item: {
      liveChatPaidStickerRenderer: {
        message: {
          runs: [
            { text: "MESSAGE_TEXT_SUPERCHAT" },
            {
              emoji: {
                emojiId: "EMOJI_ID",
                image: {
                  thumbnails: [{ url: "IMAGE URL", width: 16, height: 16 }],
                },
              },
            },
          ],
        },
        id: "LiveChatItemId00000000000000000000000003",
        authorName: {
          simpleText: "AUTHOR_NAME",
        },
        authorPhoto: {
          thumbnails: [{ url: "AUTHOR IMAGE URL", width: 32, height: 32 }],
        },
        timestampUsec: 20000,
        authorExternalChannelId: "AUTHOR_EXTERNALCHANNELID",
        purchaseAmountText: {
          simpleText: "¥90",
        },
        sticker: {
          thumbnails: [{ url: "STICKER URL", width: 24, height: 24 }],
        },
        moneyChipBackgroundColor: 4280191205,
        moneyChipTextColor: 4294967295,
        backgroundColor: 4280191205,
        authorNameTextColor: 3019898879,
      },
    } satisfies LiveChatPaidStickerRenderer,
  },
};

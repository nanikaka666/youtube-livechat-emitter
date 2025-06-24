import { AddLiveChatTickerItemAction } from "../../src/zod/action";
import {
  LiveChatTickerPaidMessageItemRenderer,
  LiveChatTickerPaidStickerItemRenderer,
  LiveChatTickerSponsorItemRenderer,
} from "../../src/zod/renderer";

export const AddLiveChatTickerItemAction_SuperChat: AddLiveChatTickerItemAction = {
  addLiveChatTickerItemAction: {
    item: {
      liveChatTickerPaidMessageItemRenderer: {
        id: "LiveChatItemId00000000000000000000000010",
        authorPhoto: {
          thumbnails: [{ url: "AUTHOR IMAGE URL", width: 32, height: 32 }],
        },
        durationSec: 300,
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
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
                id: "LiveChatItemId00000000000000000000000010",
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
            },
          },
        },
      },
    } satisfies LiveChatTickerPaidMessageItemRenderer,
  },
};

export const AddLiveChatTickerItemAction_SuperSticker: AddLiveChatTickerItemAction = {
  addLiveChatTickerItemAction: {
    item: {
      liveChatTickerPaidStickerItemRenderer: {
        id: "LiveChatItemId00000000000000000000000011",
        authorPhoto: {
          thumbnails: [{ url: "AUTHOR IMAGE URL", width: 32, height: 32 }],
        },
        authorExternalChannelId: "AUTHOR_EXTERNALCHANNELID",
        durationSec: 200,
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatPaidStickerRenderer: {
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
                backgroundColor: 4280191205,
              },
            },
          },
        },
      },
    } satisfies LiveChatTickerPaidStickerItemRenderer,
  },
};

export const AddLiveChatTickerItemAction_NewMembership: AddLiveChatTickerItemAction = {
  addLiveChatTickerItemAction: {
    item: {
      liveChatTickerSponsorItemRenderer: {
        id: "LiveChatItemId00000000000000000000000012",
        detailText: {
          runs: [
            {
              text: "Member",
            },
          ],
        },
        sponsorPhoto: {
          thumbnails: [{ url: "NEW MEMBER IMAGE URL", width: 32, height: 32 }],
        },
        durationSec: 500,
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatMembershipItemRenderer: {
                id: "LiveChatItemId00000000000000000000000012",
                authorName: {
                  simpleText: "AUTHOR_NAME",
                },
                authorPhoto: {
                  thumbnails: [{ url: "NEW MEMBER IMAGE URL", width: 32, height: 32 }],
                },
                authorBadges: [
                  {
                    liveChatAuthorBadgeRenderer: {
                      customThumbnail: {
                        thumbnails: [
                          { url: "membership custom thumbnail url", width: 16, height: 16 },
                        ],
                      },
                      tooltip: "New membership",
                    },
                  },
                ],
                timestampUsec: 20000,
                authorExternalChannelId: "AUTHOR_EXTERNALCHANNELID",
                headerSubtext: {
                  runs: [
                    {
                      text: "welcome to ",
                    },
                    {
                      text: "MEMBERSHIP Name",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    } satisfies LiveChatTickerSponsorItemRenderer,
  },
};

export const AddLiveChatTickerItemAction_MembershipMilestone: AddLiveChatTickerItemAction = {
  addLiveChatTickerItemAction: {
    item: {
      liveChatTickerSponsorItemRenderer: {
        id: "LiveChatItemId00000000000000000000000013",
        detailText: {
          simpleText: "11 months",
        },
        sponsorPhoto: {
          thumbnails: [{ url: "MEMBER IMAGE URL", width: 32, height: 32 }],
        },
        durationSec: 500,
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatMembershipItemRenderer: {
                id: "LiveChatItemId00000000000000000000000013",
                authorName: {
                  simpleText: "AUTHOR_NAME",
                },
                authorPhoto: {
                  thumbnails: [{ url: "MEMBER IMAGE URL", width: 32, height: 32 }],
                },
                authorBadges: [
                  {
                    liveChatAuthorBadgeRenderer: {
                      customThumbnail: {
                        thumbnails: [
                          { url: "membership custom thumbnail url", width: 16, height: 16 },
                        ],
                      },
                      tooltip: "Membership (6 months)",
                    },
                  },
                ],
                timestampUsec: 20000,
                authorExternalChannelId: "AUTHOR_EXTERNALCHANNELID",
                headerPrimaryText: {
                  runs: [{ text: "Membership continues " }, { text: "11 months" }],
                },
                headerSubtext: {
                  runs: [
                    {
                      text: "Membership Name",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    } satisfies LiveChatTickerSponsorItemRenderer,
  },
};

export const AddLiveChatTickerItemAction_GiftPurchased: AddLiveChatTickerItemAction = {
  addLiveChatTickerItemAction: {
    item: {
      liveChatTickerSponsorItemRenderer: {
        id: "LiveChatItemId00000000000000000000000014",
        detailText: {
          simpleText: "1",
        },
        sponsorPhoto: {
          thumbnails: [{ url: "MEMBER GIFT PURCHASED IMAGE URL", width: 32, height: 32 }],
        },
        durationSec: 400,
        showItemEndpoint: {
          showLiveChatItemEndpoint: {
            renderer: {
              liveChatSponsorshipsGiftPurchaseAnnouncementRenderer: {
                authorExternalChannelId: "AUTHOR_EXTERNALCHANNELID",
                header: {
                  liveChatSponsorshipsHeaderRenderer: {
                    authorName: {
                      simpleText: "AUTHOR_NAME",
                    },
                    authorPhoto: {
                      thumbnails: [
                        { url: "MEMBER GIFT PURCHASED IMAGE URL", width: 32, height: 32 },
                      ],
                    },
                    primaryText: {
                      runs: [
                        { text: "Gifted " },
                        { text: "1" },
                        { text: " " },
                        { text: "Channel Name" },
                        { text: " memberships" },
                      ],
                    },
                    image: {
                      thumbnails: [{ url: "Gift Image URL" }],
                    },
                  },
                },
              },
            },
          },
        },
      },
    } satisfies LiveChatTickerSponsorItemRenderer,
  },
};

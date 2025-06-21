import z from "zod";
import {
  thumbnailsSchema,
  iconTypeSchema,
  messageSchema,
  timestampUsecSchema,
  authorNameSchema,
} from "./common";

// LiveChat Renderer

export const liveChatAuthorBadgeRendererSchema = z.object({
  liveChatAuthorBadgeRenderer: z.object({
    tooltip: z.string(),
    customThumbnail: thumbnailsSchema.optional(),
    icon: iconTypeSchema.optional(),
  }),
});
export type LiveChatAuthorBadgeRenderer = z.infer<typeof liveChatAuthorBadgeRendererSchema>;

export const authorBadgesSchema = z.array(liveChatAuthorBadgeRendererSchema);
export type AuthorBadges = z.infer<typeof authorBadgesSchema>;

export const messageRendererBaseSchema = z.object({
  id: z.string(),
  authorName: authorNameSchema,
  authorPhoto: thumbnailsSchema,
  authorBadges: authorBadgesSchema.optional(),
  timestampUsec: timestampUsecSchema,
  authorExternalChannelId: z.string(),
});
export type MessageRendererBase = z.infer<typeof messageRendererBaseSchema>;

export const liveChatTextMessageRendererSchema = z.object({
  liveChatTextMessageRenderer: z
    .object({
      message: messageSchema,
    })
    .and(messageRendererBaseSchema),
});
export type LiveChatTextMessageRenderer = z.infer<typeof liveChatTextMessageRendererSchema>;
export const liveChatViewerEngagementMessageRendererSchema = z.object({
  liveChatViewerEngagementMessageRenderer: z.object({
    timestampUsec: timestampUsecSchema,
    icon: iconTypeSchema,
  }),
});
export type LiveChatViewerEngagementMessageRenderer = z.infer<
  typeof liveChatViewerEngagementMessageRendererSchema
>;

export const liveChatPaidMessageRendererSchema = z.object({
  liveChatPaidMessageRenderer: z
    .object({
      purchaseAmountText: z.object({
        simpleText: z.string(),
      }),
      message: messageSchema.optional(),
      bodyBackgroundColor: z.coerce.number(),
    })
    .and(messageRendererBaseSchema),
});
export type LiveChatPaidMessageRenderer = z.infer<typeof liveChatPaidMessageRendererSchema>;

export const liveChatTickerPaidMessageItemRendererSchema = z.object({
  liveChatTickerPaidMessageItemRenderer: z.object({
    id: z.string(),
    authorPhoto: thumbnailsSchema,
    durationSec: z.coerce.number(),
    showItemEndpoint: z.object({
      showLiveChatItemEndpoint: z.object({
        renderer: liveChatPaidMessageRendererSchema,
      }),
    }),
  }),
});
export type LiveChatTickerPaidMessageItemRenderer = z.infer<
  typeof liveChatTickerPaidMessageItemRendererSchema
>;

export const liveChatPaidStickerRendererSchema = z.object({
  liveChatPaidStickerRenderer: z
    .object({
      purchaseAmountText: z.object({ simpleText: z.string() }),
      sticker: thumbnailsSchema, // "https:" is always missing...?
      moneyChipBackgroundColor: z.coerce.number(),
      moneyChipTextColor: z.coerce.number(),
      backgroundColor: z.coerce.number(),
      authorNameTextColor: z.coerce.number(),
    })
    .and(messageRendererBaseSchema),
});
export type LiveChatPaidStickerRenderer = z.infer<typeof liveChatPaidStickerRendererSchema>;

export const liveChatMembershipItemRendererSchema = z.object({
  liveChatMembershipItemRenderer: z.object({
    id: z.string(),
    timestampUsec: timestampUsecSchema,
    authorExternalChannelId: z.string(),
    message: messageSchema.optional(),
    authorName: authorNameSchema,
    authorPhoto: thumbnailsSchema,
    authorBadges: authorBadgesSchema.optional(),
    headerPrimaryText: messageSchema.optional(),
    headerSubtext: z.union([
      z.object({
        simpleText: z.string(),
      }),
      messageSchema,
    ]),
  }),
});
export type LiveChatMembershipItemRenderer = z.infer<typeof liveChatMembershipItemRendererSchema>;

export const liveChatBannerHeaderRendererSchema = z.object({
  liveChatBannerHeaderRenderer: z.object({
    icon: iconTypeSchema,
    text: messageSchema,
  }),
});
export type LiveChatBannerHeaderRenderer = z.infer<typeof liveChatBannerHeaderRendererSchema>;

export const liveChatBannerRedirectRendererSchema = z.object({
  liveChatBannerRedirectRenderer: z.object({
    bannerMessage: messageSchema,
    authorPhoto: thumbnailsSchema,
  }),
});
export type LiveChatBannerRedirectRenderer = z.infer<typeof liveChatBannerRedirectRendererSchema>;

export const liveChatBannerChatSummaryRendererSchema = z.object({
  liveChatBannerChatSummaryRenderer: z.object({}),
});
export type LiveChatBannerChatSummaryRenderer = z.infer<
  typeof liveChatBannerChatSummaryRendererSchema
>;

export const liveChatBannerRendererSchema = z.object({
  liveChatBannerRenderer: z.object({
    header: liveChatBannerHeaderRendererSchema.optional(),
    contents: z.union([
      liveChatTextMessageRendererSchema,
      liveChatBannerRedirectRendererSchema,
      liveChatBannerChatSummaryRendererSchema,
    ]),
    actionId: z.string(),
    bannerType: z.union([
      z.literal("LIVE_CHAT_BANNER_TYPE_PINNED_MESSAGE"),
      z.literal("LIVE_CHAT_BANNER_TYPE_CHAT_SUMMARY"),
      z.literal("LIVE_CHAT_BANNER_TYPE_CROSS_CHANNEL_REDIRECT"),
    ]),
  }),
});
export type LiveChatBannerRenderer = z.infer<typeof liveChatBannerRendererSchema>;

export const liveChatModeChangeMessageRendererSchema = z.object({
  liveChatModeChangeMessageRenderer: z.object({
    id: z.string(),
    timestampUsec: timestampUsecSchema,
    icon: iconTypeSchema,
    text: messageSchema,
    subtext: messageSchema,
  }),
});
export type LiveChatModeChangeRenderer = z.infer<typeof liveChatModeChangeMessageRendererSchema>;

export const liveChatPlaceholderItemRendererSchema = z.object({
  liveChatPlaceholderItemRenderer: z.object({
    id: z.string(),
    timestampUsec: timestampUsecSchema,
  }),
});
export type LiveChatPlaceholderItemRenderer = z.infer<typeof liveChatPlaceholderItemRendererSchema>;

export const liveChatSponsorshipsHeaderRendererSchema = z.object({
  liveChatSponsorshipsHeaderRenderer: z.object({
    authorName: authorNameSchema,
    authorPhoto: thumbnailsSchema,
    primaryText: messageSchema,
    authorBadges: authorBadgesSchema.optional(),
    image: thumbnailsSchema,
  }),
});
export type LiveChatSponsorshipsHeaderRenderer = z.infer<
  typeof liveChatSponsorshipsHeaderRendererSchema
>;

export const liveChatSponsorshipsGiftPurchaseAnnouncementRendererSchema = z.object({
  liveChatSponsorshipsGiftPurchaseAnnouncementRenderer: z.object({
    authorExternalChannelId: z.string(),
    header: liveChatSponsorshipsHeaderRendererSchema,
  }),
});
export type LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer = z.infer<
  typeof liveChatSponsorshipsGiftPurchaseAnnouncementRendererSchema
>;

export const liveChatTickerSponsorItemRendererSchema = z.object({
  liveChatTickerSponsorItemRenderer: z.object({
    id: z.string(),
    detailText: z.union([messageSchema, z.object({ simpleText: z.string() })]),
    sponsorPhoto: thumbnailsSchema,
    durationSec: timestampUsecSchema,
    showItemEndpoint: z.object({
      showLiveChatItemEndpoint: z.object({
        renderer: z.union([
          liveChatMembershipItemRendererSchema,
          liveChatSponsorshipsGiftPurchaseAnnouncementRendererSchema,
        ]),
      }),
    }),
  }),
});
export type LiveChatTickerSponsorItemRenderer = z.infer<
  typeof liveChatTickerSponsorItemRendererSchema
>;

export const liveChatSponsorshipsGiftRedemptionAnnouncementRendererSchema = z.object({
  liveChatSponsorshipsGiftRedemptionAnnouncementRenderer: z.object({
    id: z.string(),
    timestampUsec: timestampUsecSchema,
    authorExternalChannelId: z.string(),
    authorName: authorNameSchema,
    authorPhoto: thumbnailsSchema,
    message: messageSchema,
  }),
});
export type LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer = z.infer<
  typeof liveChatSponsorshipsGiftRedemptionAnnouncementRendererSchema
>;

export const liveChatTickerPaidStickerItemRendererSchema = z.object({
  liveChatTickerPaidStickerItemRenderer: z.object({
    id: z.string(),
    authorPhoto: thumbnailsSchema,
    authorExternalChannelId: z.string(),
    durationSec: timestampUsecSchema,
    showItemEndpoint: z.object({
      showLiveChatItemEndpoint: z.object({
        renderer: liveChatPaidStickerRendererSchema,
      }),
    }),
  }),
});
export type LiveChatTickerPaidStickerItemRenderer = z.infer<
  typeof liveChatTickerPaidStickerItemRendererSchema
>;

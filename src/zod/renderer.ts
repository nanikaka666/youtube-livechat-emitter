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
export type LiveChatAuthorBadgeRenderer = z.infer<
  typeof liveChatAuthorBadgeRendererSchema.shape.liveChatAuthorBadgeRenderer
>;

export const authorBadgesSchema = z.array(liveChatAuthorBadgeRendererSchema);
export type AuthorBadges = z.infer<typeof authorBadgesSchema>;

export const liveChatTextMessageRendererSchema = z.object({
  liveChatTextMessageRenderer: z.object({
    id: z.string(),
    message: messageSchema,
    authorName: authorNameSchema,
    authorPhoto: thumbnailsSchema,
    authorBadges: authorBadgesSchema.optional(),
    timestampUsec: timestampUsecSchema,
    authorExternalChannelId: z.string(),
  }),
});
export type LiveChatTextMessageRenderer = z.infer<
  typeof liveChatTextMessageRendererSchema.shape.liveChatTextMessageRenderer
>;
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
  liveChatPaidMessageRenderer: z.object({
    id: z.string(),
    timestampUsec: timestampUsecSchema,
    authorName: authorNameSchema,
    authorPhoto: thumbnailsSchema,
    purchaseAmountText: z.object({
      simpleText: z.string(),
    }),
    message: messageSchema,
    authorExternalChannelId: z.string(),
    authorBadges: authorBadgesSchema.optional(),
  }),
});
export type LiveChatPaidMessageRenderer = z.infer<
  typeof liveChatPaidMessageRendererSchema.shape.liveChatPaidMessageRenderer
>;

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
  typeof liveChatTickerPaidMessageItemRendererSchema.shape.liveChatTickerPaidMessageItemRenderer
>;

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
export type LiveChatMembershipItemRenderer = z.infer<
  typeof liveChatMembershipItemRendererSchema.shape.liveChatMembershipItemRenderer
>;

export const liveChatBannerHeaderRendererSchema = z.object({
  liveChatBannerHeaderRenderer: z.object({
    icon: iconTypeSchema,
    text: messageSchema,
  }),
});
export type LiveChatBannerHeaderRenderer = z.infer<
  typeof liveChatBannerHeaderRendererSchema.shape.liveChatBannerHeaderRenderer
>;

export const liveChatBannerRendererSchema = z.object({
  liveChatBannerRenderer: z.object({
    header: liveChatBannerHeaderRendererSchema.optional(),
    contents: liveChatTextMessageRendererSchema,
    bannerType: z.union([
      z.literal("LIVE_CHAT_BANNER_TYPE_PINNED_MESSAGE"),
      z.literal("LIVE_CHAT_BANNER_TYPE_CHAT_SUMMARY"),
    ]),
  }),
});
export type LiveChatBannerRenderer = z.infer<
  typeof liveChatBannerRendererSchema.shape.liveChatBannerRenderer
>;

export const liveChatModeChangeMessageRendererSchema = z.object({
  liveChatModeChangeMessageRenderer: z.object({
    id: z.string(),
    timestampUsec: timestampUsecSchema,
    icon: iconTypeSchema,
    text: messageSchema,
    subtext: messageSchema,
  }),
});
export type LiveChatModeChangeRenderer = z.infer<
  typeof liveChatModeChangeMessageRendererSchema.shape.liveChatModeChangeMessageRenderer
>;

export const liveChatTickerSponsorItemRendererSchema = z.object({
  liveChatTickerSponsorItemRenderer: z.object({
    id: z.string(),
    detailText: messageSchema,
    sponsorPhoto: thumbnailsSchema,
    durationSec: z.coerce.number(),
    showItemEndpoint: z.object({
      showLiveChatItemEndpoint: z.object({
        renderer: liveChatMembershipItemRendererSchema,
      }),
    }),
  }),
});
export type LiveChatTickerSponsorItemRenderer = z.infer<
  typeof liveChatTickerSponsorItemRendererSchema.shape.liveChatTickerSponsorItemRenderer
>;

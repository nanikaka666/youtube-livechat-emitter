import z from "zod";
import {
  liveChatBannerRendererSchema,
  liveChatMembershipItemRendererSchema,
  liveChatModeChangeMessageRendererSchema,
  liveChatPaidMessageRendererSchema,
  liveChatPaidStickerRendererSchema,
  liveChatPlaceholderItemRendererSchema,
  liveChatSponsorshipsGiftPurchaseAnnouncementRendererSchema,
  liveChatSponsorshipsGiftRedemptionAnnouncementRendererSchema,
  liveChatTextMessageRendererSchema,
  liveChatTickerPaidMessageItemRendererSchema,
  liveChatTickerPaidStickerItemRendererSchema,
  liveChatTickerSponsorItemRendererSchema,
  liveChatViewerEngagementMessageRendererSchema,
} from "./renderer";

export const addChatItemActionSchema = z.object({
  addChatItemAction: z.object({
    item: z.union([
      liveChatTextMessageRendererSchema,
      liveChatViewerEngagementMessageRendererSchema,
      liveChatPaidMessageRendererSchema,
      liveChatMembershipItemRendererSchema,
      liveChatModeChangeMessageRendererSchema,
      liveChatPlaceholderItemRendererSchema,
      liveChatPaidStickerRendererSchema,
      liveChatSponsorshipsGiftPurchaseAnnouncementRendererSchema,
      liveChatSponsorshipsGiftRedemptionAnnouncementRendererSchema,
    ]),
  }),
});
export type AddChatItemAction = z.infer<typeof addChatItemActionSchema>;

export const removeChatItemActionSchema = z.object({
  removeChatItemAction: z.object({
    targetItemId: z.string(),
  }),
});
export type RemoveChatItemAction = z.infer<typeof removeChatItemActionSchema>;
export const liveChatReportModerationStateCommandSchema = z.object({
  liveChatReportModerationStateCommand: z.object({}),
});
export type LiveChatReportModerationStateCommand = z.infer<
  typeof liveChatReportModerationStateCommandSchema
>;
export const addBannerToLiveChatCommandSchema = z.object({
  addBannerToLiveChatCommand: z.object({
    bannerRenderer: liveChatBannerRendererSchema,
  }),
});
export type AddBannerToLiveChatCommand = z.infer<typeof addBannerToLiveChatCommandSchema>;

export const addLiveChatTickerItemActionSchema = z.object({
  addLiveChatTickerItemAction: z.object({
    item: z.union([
      liveChatTickerPaidMessageItemRendererSchema,
      liveChatTickerSponsorItemRendererSchema,
      liveChatTickerPaidStickerItemRendererSchema,
    ]),
  }),
});
export type AddLiveChatTickerItemAction = z.infer<typeof addLiveChatTickerItemActionSchema>;

export const removeBannerForLiveChatCommandSchema = z.object({
  removeBannerForLiveChatCommand: z.object({
    targetActionId: z.string(),
  }),
});
export type RemoveBannerForLiveChatCommand = z.infer<typeof removeBannerForLiveChatCommandSchema>;

export const removeChatItemByAuthorActionSchema = z.object({
  removeChatItemByAuthorAction: z.object({
    externalChannelId: z.string(),
  }),
});
export type RemoveChatItemByAuthorAction = z.infer<typeof removeChatItemByAuthorActionSchema>;

export const replaceChatItemActionSchema = z.object({
  replaceChatItemAction: z.object({
    targetItemId: z.string(),
  }),
});
export type ReplaceChatItemAction = z.infer<typeof replaceChatItemActionSchema>;

export const actionsSchema = z.array(
  z.union([
    addChatItemActionSchema,
    removeChatItemActionSchema,
    liveChatReportModerationStateCommandSchema,
    addBannerToLiveChatCommandSchema,
    addLiveChatTickerItemActionSchema,
    removeBannerForLiveChatCommandSchema,
    removeChatItemByAuthorActionSchema,
    replaceChatItemActionSchema,
  ]),
);
export type Actions = z.infer<typeof actionsSchema>; // Action

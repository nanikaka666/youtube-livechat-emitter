import z from "zod";
import {
  liveChatBannerRendererSchema,
  liveChatMembershipItemRendererSchema,
  liveChatModeChangeMessageRendererSchema,
  liveChatPaidMessageRendererSchema,
  liveChatTextMessageRendererSchema,
  liveChatTickerPaidMessageItemRendererSchema,
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
      z.object({}).passthrough(),
    ]),
  }),
});
export type AddChatItemAction = z.infer<typeof addChatItemActionSchema.shape.addChatItemAction>;

export const removeChatItemActionSchema = z.object({
  removeChatItemAction: z.object({
    targetItemId: z.string(),
  }),
});
export type RemoveChatItemAction = z.infer<
  typeof removeChatItemActionSchema.shape.removeChatItemAction
>;
export const liveChatReportModerationStateCommandSchema = z.object({
  liveChatReportModerationStateCommand: z.object({}),
});
export type LiveChatReportModerationStateCommand = z.infer<
  typeof liveChatReportModerationStateCommandSchema.shape.liveChatReportModerationStateCommand
>;
export const addBannerToLiveChatCommandSchema = z.object({
  addBannerToLiveChatCommand: z.object({
    bannerRenderer: liveChatBannerRendererSchema,
  }),
});
export type AddBannerToLiveChatCommand = z.infer<
  typeof addBannerToLiveChatCommandSchema.shape.addBannerToLiveChatCommand
>;

export const addLiveChatTickerItemActionSchema = z.object({
  addLiveChatTickerItemAction: z.object({
    item: z.union([
      liveChatTickerPaidMessageItemRendererSchema,
      liveChatTickerSponsorItemRendererSchema,
    ]),
  }),
});
export type AddLiveChatTickerItemAction = z.infer<
  typeof addLiveChatTickerItemActionSchema.shape.addLiveChatTickerItemAction
>;

export const actionsSchema = z.array(
  z.union([
    addChatItemActionSchema,
    removeChatItemActionSchema,
    liveChatReportModerationStateCommandSchema,
    addBannerToLiveChatCommandSchema,
    addLiveChatTickerItemActionSchema,
    z.object({}).passthrough(),
  ]),
);
export type Actions = z.infer<typeof actionsSchema>; // Action

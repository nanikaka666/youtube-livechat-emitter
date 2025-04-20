import {
  Actions,
  AddBannerToLiveChatCommand,
  addBannerToLiveChatCommandSchema,
  AddChatItemAction,
  addChatItemActionSchema,
  AddLiveChatTickerItemAction,
  addLiveChatTickerItemActionSchema,
  liveChatReportModerationStateCommandSchema,
  RemoveChatItemAction,
  removeChatItemActionSchema,
} from "./action";
import { emojiInRunsSchema, Message, textInRunsSchema } from "./common";
import { GetLiveChatApiResponse } from "./continuation";
import {
  Continuations,
  invalidationContinuationDataSchema,
  reloadContinuationDataSchema,
  timedContinuationDataSchema,
} from "./continuation";
import {
  liveChatTextMessageRendererSchema,
  liveChatViewerEngagementMessageRendererSchema,
  liveChatPaidMessageRendererSchema,
  liveChatMembershipItemRendererSchema,
  liveChatTickerPaidMessageItemRendererSchema,
  liveChatTickerSponsorItemRendererSchema,
  liveChatModeChangeMessageRendererSchema,
} from "./renderer";

export function printApiResponse(res: GetLiveChatApiResponse) {
  // console.log("API RESPONSE");
  // console.log("Raw: ", res);
  printContinuations(res.continuationContents.liveChatContinuation.continuations);
  if (res.continuationContents.liveChatContinuation.actions !== undefined) {
    printActions(res.continuationContents.liveChatContinuation.actions);
  }
}
export function printMessage(message: Message) {
  message.runs.forEach((r) => {
    const maybeText = textInRunsSchema.safeParse(r);
    if (maybeText.success) {
      console.log(maybeText.data.text);
    }
    const maybeEmoji = emojiInRunsSchema.safeParse(r);
    if (maybeEmoji.success) {
      console.log("emojiId", maybeEmoji.data.emoji.emojiId);
      // console.log("emoji thumbs", maybeEmoji.data.emoji.image.thumbnails);
    }
  });
  console.log("");
}
export function printAddChatItemAction(action: AddChatItemAction) {
  const maybeliveChatTextMessageRenderer = liveChatTextMessageRendererSchema.safeParse(action.item);
  if (maybeliveChatTextMessageRenderer.success) {
    //   console.log("LiveChatTextMessageRenderer detected.");
    //   console.log(
    //     "ChannelId",
    //     maybeliveChatTextMessageRenderer.data.liveChatTextMessageRenderer.authorExternalChannelId,
    //   );
    console.log(
      `(${maybeliveChatTextMessageRenderer.data.liveChatTextMessageRenderer.id}): ${maybeliveChatTextMessageRenderer.data.liveChatTextMessageRenderer.authorName.simpleText}`,
    );
    const authorBadges =
      maybeliveChatTextMessageRenderer.data.liveChatTextMessageRenderer.authorBadges;
    if (authorBadges !== undefined) {
      authorBadges.forEach((badge) => {
        console.log("tooltip: ", badge.liveChatAuthorBadgeRenderer.tooltip);
        // console.log("Raw:", badge.liveChatAuthorBadgeRenderer);
        if (badge.liveChatAuthorBadgeRenderer.icon !== undefined) {
          console.log("icon");
        }
        if (badge.liveChatAuthorBadgeRenderer.customThumbnail !== undefined) {
          console.log("Having custom thumb:");
        }
      });
    }
    //   console.log(
    //     "Thumbnails",
    //     maybeliveChatTextMessageRenderer.data.liveChatTextMessageRenderer.authorPhoto,
    //   );
    //   console.log(
    //     "Timestamp",
    //     maybeliveChatTextMessageRenderer.data.liveChatTextMessageRenderer.timestampUsec,
    //   );
    printMessage(maybeliveChatTextMessageRenderer.data.liveChatTextMessageRenderer.message);
  } else {
    const maybeLiveChatViewerEngagementMessageRenderer =
      liveChatViewerEngagementMessageRendererSchema.safeParse(action.item);
    if (maybeLiveChatViewerEngagementMessageRenderer.success) {
      console.log("LiveChatViewerEngagementMessageRenderer detected.");
      // console.log(
      //   maybeLiveChatViewerEngagementMessageRenderer.data.liveChatViewerEngagementMessageRenderer,
      // );
    } else {
      const maybeLiveChatPaidMessageItemRenderer = liveChatPaidMessageRendererSchema.safeParse(
        action.item,
      );
      if (maybeLiveChatPaidMessageItemRenderer.success) {
        console.log("LiveChatPaidMessageRenderer detected.");
        console.log(
          "Amount:",
          maybeLiveChatPaidMessageItemRenderer.data.liveChatPaidMessageRenderer.purchaseAmountText
            .simpleText,
        );
      } else {
        const maybeLiveChatMembershipItemRenderer = liveChatMembershipItemRendererSchema.safeParse(
          action.item,
        );
        if (maybeLiveChatMembershipItemRenderer.success) {
          console.log(
            "LiveChatMembershipItemRenderer detected. ",
            maybeLiveChatMembershipItemRenderer.data.liveChatMembershipItemRenderer.authorName,
          );
          if (
            maybeLiveChatMembershipItemRenderer.data.liveChatMembershipItemRenderer
              .headerPrimaryText
          ) {
            printMessage(
              maybeLiveChatMembershipItemRenderer.data.liveChatMembershipItemRenderer
                .headerPrimaryText,
            );
          }
        } else {
          const maybeLiveChatModeChangeMessageRenderer =
            liveChatModeChangeMessageRendererSchema.safeParse(action.item);
          if (maybeLiveChatModeChangeMessageRenderer.success) {
            console.log("LiveChatModeChangeMessageRenderer detected.");
          } else {
            console.log("UNKNOWN RENDERER TYPE: ", maybeLiveChatModeChangeMessageRenderer.error);
            console.log("Renderer Item:", action.item);
          }
        }
      }
    }
  }
}
export function printActions(actions: Actions) {
  actions.forEach((action) => {
    const maybeAddChatItemAction = addChatItemActionSchema.safeParse(action);

    if (maybeAddChatItemAction.success) {
      printAddChatItemAction(maybeAddChatItemAction.data.addChatItemAction);
    } else {
      const maybeRemoveChatItemAction = removeChatItemActionSchema.safeParse(action);
      if (maybeRemoveChatItemAction.success) {
        printRemoveChatItemAction(maybeRemoveChatItemAction.data.removeChatItemAction);
      } else {
        const maybeLiveChatReportModerationStateCommand =
          liveChatReportModerationStateCommandSchema.safeParse(action);
        if (maybeLiveChatReportModerationStateCommand.success) {
          console.log("LiveChatReportModerationStateCommand detected.");
          console.log(maybeLiveChatReportModerationStateCommand.data);
        } else {
          const maybeAddBannerToLiveChatCommand =
            addBannerToLiveChatCommandSchema.safeParse(action);
          if (maybeAddBannerToLiveChatCommand.success) {
            printAddBannerToLiveChatCommand(
              maybeAddBannerToLiveChatCommand.data.addBannerToLiveChatCommand,
            );
          } else {
            const maybeAddLiveChatTickerItemAction =
              addLiveChatTickerItemActionSchema.safeParse(action);
            if (maybeAddLiveChatTickerItemAction.success) {
              printAddLiveChatTickerItemAction(
                maybeAddLiveChatTickerItemAction.data.addLiveChatTickerItemAction,
              );
            } else {
              console.log("UNKNOWN ACTION TYPE: ", maybeAddLiveChatTickerItemAction.error);
              console.log("Action Item", action);
            }
          }
        }
      }
    }
  });
}

export function printAddLiveChatTickerItemAction(action: AddLiveChatTickerItemAction) {
  console.log("AddLiveChatTickerItemAction detected.");
  const maybeLiveChatTickerPaidMessageItemRenderer =
    liveChatTickerPaidMessageItemRendererSchema.safeParse(action.item);
  if (maybeLiveChatTickerPaidMessageItemRenderer.success) {
    console.log("Renderer: LiveChattickerPaidMessageItemRenderer");
  } else {
    const maybeLiveChatTickerSponsorItemRenderer =
      liveChatTickerSponsorItemRendererSchema.safeParse(action.item);
    if (maybeLiveChatTickerSponsorItemRenderer.success) {
      console.log("Renderer: LiveChatTickerSponsorItemRenderer");
    } else {
      console.log("UNKNOWN Renderer: ", action.item);
    }
  }
  console.log("");
}

export function printRemoveChatItemAction(action: RemoveChatItemAction) {
  console.log("RemoveChatItemAction: detected: ", action.targetItemId);
}

export function printAddBannerToLiveChatCommand(action: AddBannerToLiveChatCommand) {
  console.log(
    `AddBannerToLiveChatCommand detected. ${action.bannerRenderer.liveChatBannerRenderer.bannerType}`,
  );
  if (
    action.bannerRenderer.liveChatBannerRenderer.bannerType ===
    "LIVE_CHAT_BANNER_TYPE_PINNED_MESSAGE"
  ) {
    console.log("PINNED ACTION detected.");
  }
}

export function printContinuations(continuations: Continuations) {
  // console.log("Continuations: ", continuations.length);
  continuations.forEach((continuation) => {
    const maybeInvalidation = invalidationContinuationDataSchema.safeParse(continuation);
    if (maybeInvalidation.success) {
      // console.log(
      //   "InvalidationContinuationData",
      //   maybeInvalidation.data.invalidationContinuationData,
      // );
    } else {
      const maybeTimed = timedContinuationDataSchema.safeParse(continuation);
      if (maybeTimed.success) {
        //   console.log("TimedContinuationData", maybeTimed.data.timedContinuationData);
      } else {
        const maybeReload = reloadContinuationDataSchema.safeParse(continuation);
        if (maybeReload.success) {
          console.log("ReloadContinuationData detected.");
        } else {
          if (!maybeReload.success) {
            console.log("UNKNOWN Continuations:", continuation);
          }
        }
      }
    }
  });
}

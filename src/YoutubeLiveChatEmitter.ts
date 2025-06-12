import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
import { getRequestPayload } from "./PageParseFunctions";
import { Continuations, getLiveChatApiResponseSchema } from "./zod/continuation";
import fs from "node:fs";
import { getNextContinuation } from "./LiveChatApiResponseParseFunctions";
import {
  Actions,
  AddBannerToLiveChatCommand,
  AddChatItemAction,
  AddLiveChatTickerItemAction,
  LiveChatReportModerationStateCommand,
  RemoveChatItemAction,
} from "./zod/action";
import {
  ChatItemText,
  GiftRedemption,
  LiveChatItem,
  MembershipItem,
  SponsorshipsGift,
  TickerItem,
} from "./types/liveChat";
import {
  parseLiveChatMembershipItemRenderer,
  parseLiveChatPaidMessageRenderer,
  parseLiveChatPaidStickerRenderer,
  parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
  parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
  parseLiveChatTextMessageRenderer,
  parseLiveChatTickerPaidMessageItemRenderer,
  parseLiveChatTickerPaidStickerItemRenderer,
  parseLiveChatTickerSponsorItemRenderer,
} from "./RendererParseFunctions";
import { fetchLiveChatApi, GetLiveChatApiRequestPayload } from "./infrastructure/fetch";
import { UnknownJsonDataError } from "./core/errors";
import { ChannelId } from "./core/ChannelId";
import { LiveChatItemId } from "./core/LiveChatItemId";

export type LiveChatEvent = {
  start: () => void;
  end: () => void;
  error: (error: Error) => void;
  addChat: (item: LiveChatItem) => void;
  removeChat: (id: LiveChatItemId) => void;
  blockUser: (channelId: ChannelId) => void;
  pinned: (item: ChatItemText) => void;
  unpinned: (item?: ChatItemText) => void;
  memberships: (item: MembershipItem) => void;
  sponsorshipsGift: (item: SponsorshipsGift) => void;
  redemptionGift: (item: GiftRedemption) => void;
  addTicker: (item: TickerItem) => void;
};

type EmitterStatus = "inactivated" | "activated" | "closed";

export class YoutubeLiveChatEmitter extends (EventEmitter as new () => TypedEmitter<LiveChatEvent>) {
  readonly #channelId: ChannelId;
  readonly #timeoutMilliSeconds: number;
  readonly #isWriteFile: boolean;
  #payload?: GetLiveChatApiRequestPayload;
  #status: EmitterStatus;
  #pinnedItem: Map<string, ChatItemText>;

  constructor(
    channelId: string,
    timeoutMilliSeconds: number = 5 * 1000,
    isWriteFile: boolean = false,
  ) {
    super();
    this.#channelId = new ChannelId(channelId);
    this.#timeoutMilliSeconds = timeoutMilliSeconds;
    this.#isWriteFile = isWriteFile;
    this.#status = "inactivated";
    this.#pinnedItem = new Map();
  }

  #updateContinuation(continuations: Continuations) {
    if (this.#payload === undefined) {
      throw new Error("payload is undefined when updating continuation.");
    }
    this.#payload.continuation = getNextContinuation(continuations) ?? this.#payload.continuation;
  }

  #handleActions(actions: Actions) {
    actions.forEach((action) => {
      if ("addChatItemAction" in action) {
        this.#handleAddChatItemAction(action.addChatItemAction);
      } else if ("removeChatItemAction" in action) {
        this.#handleRemoveChatItemAction(action.removeChatItemAction);
      } else if ("liveChatReportModerationStateCommand" in action) {
        this.#handleLiveChatReportModerationStateCommand(
          action.liveChatReportModerationStateCommand,
        );
      } else if ("addBannerToLiveChatCommand" in action) {
        this.#handleAddBannerToLiveChatCommand(action.addBannerToLiveChatCommand);
      } else if ("addLiveChatTickerItemAction" in action) {
        this.#handleAddLiveChatTickerItemAction(action.addLiveChatTickerItemAction);
      } else if ("removeBannerForLiveChatCommand" in action) {
        const actionId = action.removeBannerForLiveChatCommand.targetActionId;
        this.emit("unpinned", this.#pinnedItem.get(actionId));
        this.#pinnedItem.delete(actionId);
      } else if ("removeChatItemByAuthorAction" in action) {
        this.emit(
          "blockUser",
          new ChannelId(action.removeChatItemByAuthorAction.externalChannelId),
        );
      } else if ("replaceChatItemAction" in action) {
        // do nothing
      } else {
        throw new UnknownJsonDataError(action, `Unknown action detected. ${action}`);
      }
    });
  }

  #handleAddChatItemAction(action: AddChatItemAction) {
    if ("liveChatTextMessageRenderer" in action.item) {
      this.emit(
        "addChat",
        parseLiveChatTextMessageRenderer(action.item.liveChatTextMessageRenderer),
      );
    } else if ("liveChatPaidMessageRenderer" in action.item) {
      this.emit(
        "addChat",
        parseLiveChatPaidMessageRenderer(action.item.liveChatPaidMessageRenderer),
      );
    } else if ("liveChatPaidStickerRenderer" in action.item) {
      this.emit(
        "addChat",
        parseLiveChatPaidStickerRenderer(action.item.liveChatPaidStickerRenderer),
      );
    } else if ("liveChatMembershipItemRenderer" in action.item) {
      this.emit(
        "memberships",
        parseLiveChatMembershipItemRenderer(action.item.liveChatMembershipItemRenderer),
      );
    } else if ("liveChatSponsorshipsGiftPurchaseAnnouncementRenderer" in action.item) {
      this.emit(
        "sponsorshipsGift",
        parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
          action.item.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
        ),
      );
    } else if ("liveChatSponsorshipsGiftRedemptionAnnouncementRenderer" in action.item) {
      this.emit(
        "redemptionGift",
        parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(
          action.item.liveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
        ),
      );
    } else if ("liveChatViewerEngagementMessageRenderer" in action.item) {
      // do nothing.
    } else if ("liveChatModeChangeMessageRenderer" in action.item) {
      // do nothing.
    } else if ("liveChatPlaceholderItemRenderer" in action.item) {
      // do nothing.
    } else {
      throw new UnknownJsonDataError(
        action.item,
        `Unknown addChatItemAction detected. ${action.item}`,
      );
    }
  }

  #handleRemoveChatItemAction(action: RemoveChatItemAction) {
    this.emit("removeChat", new LiveChatItemId(action.targetItemId));
  }

  #handleLiveChatReportModerationStateCommand(action: LiveChatReportModerationStateCommand) {
    // do nothing.
  }

  #handleAddBannerToLiveChatCommand(action: AddBannerToLiveChatCommand) {
    const { bannerType } = action.bannerRenderer.liveChatBannerRenderer;
    if (bannerType === "LIVE_CHAT_BANNER_TYPE_PINNED_MESSAGE") {
      if ("liveChatTextMessageRenderer" in action.bannerRenderer.liveChatBannerRenderer.contents) {
        const item = parseLiveChatTextMessageRenderer(
          action.bannerRenderer.liveChatBannerRenderer.contents.liveChatTextMessageRenderer,
        );
        this.#pinnedItem.set(action.bannerRenderer.liveChatBannerRenderer.actionId, item);
        this.emit("pinned", item);
      } else {
        this.emit("error", new Error("Unknown Pinned message type detected."));
      }
    } else if (bannerType === "LIVE_CHAT_BANNER_TYPE_CHAT_SUMMARY") {
      // do nothing.
    } else if (bannerType === "LIVE_CHAT_BANNER_TYPE_CROSS_CHANNEL_REDIRECT") {
      // do nothing.
    } else {
      throw new UnknownJsonDataError(
        bannerType,
        `Unknown addBannerToLiveChatCommand detected. ${action}`,
      );
    }
  }

  #handleAddLiveChatTickerItemAction(action: AddLiveChatTickerItemAction) {
    if ("liveChatTickerPaidMessageItemRenderer" in action.item) {
      this.emit(
        "addTicker",
        parseLiveChatTickerPaidMessageItemRenderer(
          action.item.liveChatTickerPaidMessageItemRenderer,
        ),
      );
    } else if ("liveChatTickerSponsorItemRenderer" in action.item) {
      this.emit(
        "addTicker",
        parseLiveChatTickerSponsorItemRenderer(action.item.liveChatTickerSponsorItemRenderer),
      );
    } else if ("liveChatTickerPaidStickerItemRenderer" in action.item) {
      this.emit(
        "addTicker",
        parseLiveChatTickerPaidStickerItemRenderer(
          action.item.liveChatTickerPaidStickerItemRenderer,
        ),
      );
    } else {
      throw new UnknownJsonDataError(
        action.item,
        `Unknown addLiveChatTickerItemAction detected. ${action.item}`,
      );
    }
  }

  async #execute() {
    if (!this.#payload) {
      throw new Error("missing payload.");
    }
    if (this.#status === "inactivated") {
      throw new Error("not activated.");
    }

    try {
      const res = await fetchLiveChatApi(this.#payload);

      if (this.#isWriteFile) {
        fs.writeFileSync(
          `/Users/nanikaka/dev/tmp-data/get-live-chat-raw-responses/${this.#channelId}-${new Date().getTime()}.json`,
          JSON.stringify(res),
        );
      }
      const apiResponse = getLiveChatApiResponseSchema.parse(res);

      this.#updateContinuation(apiResponse.continuationContents.liveChatContinuation.continuations);

      if (apiResponse.continuationContents.liveChatContinuation.actions) {
        this.#handleActions(apiResponse.continuationContents.liveChatContinuation.actions);
      }
    } catch (err) {
      if (err instanceof Error) {
        this.emit("error", err);
      } else {
        this.emit("error", new Error("Failed execute."));
      }
    } finally {
      if (this.#status === "activated") {
        setTimeout(() => this.#execute(), this.#timeoutMilliSeconds);
      }
    }
  }

  async start() {
    try {
      if (this.#status !== "inactivated") {
        return false;
      }
      this.#payload = await getRequestPayload(this.#channelId);
      this.#status = "activated";
      this.#execute();
      this.emit("start");
      return true;
    } catch (err) {
      if (err instanceof Error) {
        this.emit("error", err);
      } else {
        this.emit("error", new Error("Failed to starting."));
      }
      return false;
    }
  }

  close() {
    if (this.#status === "activated") {
      this.#status = "closed";
      this.emit("end");
    }
  }
}

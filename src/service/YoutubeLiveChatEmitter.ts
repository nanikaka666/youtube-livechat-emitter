import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
import { YoutubeLiveChatApi } from "./YoutubeLiveChatApi";
import {
  Actions,
  AddBannerToLiveChatCommand,
  AddChatItemAction,
  AddLiveChatTickerItemAction,
  LiveChatReportModerationStateCommand,
  RemoveChatItemAction,
} from "../zod/action";
import {
  ChatItemText,
  GiftRedemption,
  LiveChatItem,
  MembershipItem,
  SponsorshipsGift,
  TickerItem,
} from "../types/liveChat";
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
} from "../parser/RendererParser";
import { UnknownJsonDataError } from "../core/errors";
import { ChannelId } from "../core/ChannelId";
import { LiveChatItemId } from "../core/LiveChatItemId";
import { AxiosError } from "axios";

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
  readonly #timeoutMilliSeconds: number;
  readonly #isWriteFile: boolean;
  readonly #liveChatApi: YoutubeLiveChatApi;
  #status: EmitterStatus;
  #pinnedItem: Map<string, ChatItemText>;

  constructor(
    channelId: string,
    timeoutMilliSeconds: number = 5 * 1000,
    isWriteFile: boolean = false,
  ) {
    super();
    this.#timeoutMilliSeconds = timeoutMilliSeconds;
    this.#isWriteFile = isWriteFile;
    this.#liveChatApi = new YoutubeLiveChatApi(new ChannelId(channelId));
    this.#status = "inactivated";
    this.#pinnedItem = new Map();
  }

  #handleActions(actions: Actions) {
    actions.forEach((action) => {
      if ("addChatItemAction" in action) {
        this.#handleAddChatItemAction(action);
      } else if ("removeChatItemAction" in action) {
        this.#handleRemoveChatItemAction(action);
      } else if ("liveChatReportModerationStateCommand" in action) {
        this.#handleLiveChatReportModerationStateCommand(action);
      } else if ("addBannerToLiveChatCommand" in action) {
        this.#handleAddBannerToLiveChatCommand(action);
      } else if ("addLiveChatTickerItemAction" in action) {
        this.#handleAddLiveChatTickerItemAction(action);
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
    const item = action.addChatItemAction.item;
    if ("liveChatTextMessageRenderer" in item) {
      this.emit("addChat", parseLiveChatTextMessageRenderer(item));
    } else if ("liveChatPaidMessageRenderer" in item) {
      this.emit("addChat", parseLiveChatPaidMessageRenderer(item));
    } else if ("liveChatPaidStickerRenderer" in item) {
      this.emit("addChat", parseLiveChatPaidStickerRenderer(item));
    } else if ("liveChatMembershipItemRenderer" in item) {
      this.emit("memberships", parseLiveChatMembershipItemRenderer(item));
    } else if ("liveChatSponsorshipsGiftPurchaseAnnouncementRenderer" in item) {
      this.emit(
        "sponsorshipsGift",
        parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(item),
      );
    } else if ("liveChatSponsorshipsGiftRedemptionAnnouncementRenderer" in item) {
      this.emit(
        "redemptionGift",
        parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(item),
      );
    } else if ("liveChatViewerEngagementMessageRenderer" in item) {
      // do nothing.
    } else if ("liveChatModeChangeMessageRenderer" in item) {
      // do nothing.
    } else if ("liveChatPlaceholderItemRenderer" in item) {
      // do nothing.
    } else {
      throw new UnknownJsonDataError(item, `Unknown addChatItemAction detected. ${item}`);
    }
  }

  #handleRemoveChatItemAction(action: RemoveChatItemAction) {
    this.emit("removeChat", new LiveChatItemId(action.removeChatItemAction.targetItemId));
  }

  #handleLiveChatReportModerationStateCommand(action: LiveChatReportModerationStateCommand) {
    // do nothing.
  }

  #handleAddBannerToLiveChatCommand(action: AddBannerToLiveChatCommand) {
    const renderer = action.addBannerToLiveChatCommand.bannerRenderer.liveChatBannerRenderer;
    const { bannerType } = renderer;
    if (bannerType === "LIVE_CHAT_BANNER_TYPE_PINNED_MESSAGE") {
      if ("liveChatTextMessageRenderer" in renderer.contents) {
        const item = parseLiveChatTextMessageRenderer(renderer.contents);
        this.#pinnedItem.set(renderer.actionId, item);
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
    const item = action.addLiveChatTickerItemAction.item;
    if ("liveChatTickerPaidMessageItemRenderer" in item) {
      this.emit("addTicker", parseLiveChatTickerPaidMessageItemRenderer(item));
    } else if ("liveChatTickerSponsorItemRenderer" in item) {
      this.emit("addTicker", parseLiveChatTickerSponsorItemRenderer(item));
    } else if ("liveChatTickerPaidStickerItemRenderer" in item) {
      this.emit("addTicker", parseLiveChatTickerPaidStickerItemRenderer(item));
    } else {
      throw new UnknownJsonDataError(item, `Unknown addLiveChatTickerItemAction detected. ${item}`);
    }
  }

  async #execute() {
    if (this.#status === "inactivated") {
      throw new Error("not activated.");
    }

    try {
      // if (this.#isWriteFile) {
      //   fs.writeFileSync(
      //     `/Users/nanikaka/dev/tmp-data/get-live-chat-raw-responses/${this.#channelId}-${new Date().getTime()}.json`,
      //     JSON.stringify(res),
      //   );
      // }
      const actions = await this.#liveChatApi.getNextActions();

      if (actions) {
        this.#handleActions(actions);
      }
    } catch (err) {
      if (
        err instanceof Error ||
        err instanceof AxiosError ||
        err instanceof UnknownJsonDataError
      ) {
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
      await this.#liveChatApi.init();
      this.#status = "activated";
      this.#execute();
      this.emit("start");
      return true;
    } catch (err) {
      if (err instanceof Error || err instanceof AxiosError) {
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

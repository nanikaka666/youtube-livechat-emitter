import { YoutubeLiveChatEmitter } from "../../src";
import { YoutubeLiveChatApi } from "../../src/service/YoutubeLiveChatApi";
import { AxiosError } from "axios";
import { Actions } from "../../src/zod/action";
import {
  AddChatItemAction_MembershipMilestone,
  AddChatItemAction_NewMembership,
  AddChatItemAction_SponsorshipsGiftPurchase,
  AddChatItemAction_SponsorshipsGiftRedemption,
  AddChatItemAction_SuperChat,
  AddChatItemAction_SuperSticker,
  AddChatItemAction_TextMessage,
} from "../fixture/addChatItemAction";
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
} from "../../src/service/RendererParser";
import {
  LiveChatMembershipItemRenderer,
  LiveChatPaidMessageRenderer,
  LiveChatPaidStickerRenderer,
  LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
  LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
  LiveChatTextMessageRenderer,
  LiveChatTickerPaidMessageItemRenderer,
  LiveChatTickerPaidStickerItemRenderer,
  LiveChatTickerSponsorItemRenderer,
} from "../../src/zod/renderer";
import { RemoveChatItemAction_01 } from "../fixture/removeChatItemAction";
import { LiveChatItemId } from "../../src/core/LiveChatItemId";
import { RemoveChatItemByAuthorAction_01 } from "../fixture/removeChatItemByAuthorAction";
import { ChannelId } from "../../src/core/ChannelId";
import { AddBannerToLiveChatCommand_PinnedMessage } from "../fixture/addBannerToLiveChatCommand";
import { RemoveBannerForLiveChatCommand_01 } from "../fixture/removeBannerForLiveChatCommand";
import {
  AddLiveChatTickerItemAction_GiftPurchased,
  AddLiveChatTickerItemAction_MembershipMilestone,
  AddLiveChatTickerItemAction_NewMembership,
  AddLiveChatTickerItemAction_SuperChat,
  AddLiveChatTickerItemAction_SuperSticker,
} from "../fixture/addLiveChatTickerItemAction";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe("Emitter config.", () => {
  test("interval of fetching live chat api is same as input to constructor", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve(undefined));
    jest.spyOn(global, "setTimeout");
    const emitter = new YoutubeLiveChatEmitter("@test_channel", 1000);
    await emitter.start();
    expect(jest.mocked(setTimeout).mock.calls.at(0)?.[1]).toEqual(1000);
  });
});

describe("check about the start event", () => {
  test("emitting start event is well work", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve(undefined));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onStart = jest.fn();
    emitter.on("start", onStart);
    expect(onStart).toHaveBeenCalledTimes(0);
    expect(await emitter.start()).toBe(true);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  test("if start() called multiple times accidently, start event is emitted only once", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve(undefined));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onStart = jest.fn();
    emitter.on("start", onStart);
    expect(await emitter.start()).toBe(true);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(await emitter.start()).toBe(false);
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});

describe("check about the end event", () => {
  test("emitting end event is well work", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve(undefined));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onEnd = jest.fn();
    emitter.on("end", onEnd);
    await emitter.start();
    expect(onEnd).toHaveBeenCalledTimes(0);
    emitter.close();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  test("if close() called multiple times accidently, end event is emitted only once", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve(undefined));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onEnd = jest.fn();
    emitter.on("end", onEnd);
    await emitter.start();
    emitter.close();
    expect(onEnd).toHaveBeenCalledTimes(1);
    emitter.close();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });
});

describe("check about the error event", () => {
  test("error event is emitted, when throwing exception in starting", async () => {
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "init")
      .mockImplementation(() => Promise.reject(new Error("trouble")));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onError = jest.fn();
    emitter.on("error", onError);

    expect(onError).toHaveBeenCalledTimes(0);
    expect(await emitter.start()).toBe(false);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(new Error("trouble"));
  });

  test("error event is emitted, when throwing exception in execute()", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.reject(new AxiosError("connection trouble")));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onError = jest.fn();
    emitter.on("error", onError);

    await emitter.start();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(new AxiosError("connection trouble"));
  });
});

describe("check about the addChat event", () => {
  test("addChat event is emitted with normal text chat", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve([AddChatItemAction_TextMessage] satisfies Actions));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddChat = jest.fn();
    emitter.on("addChat", onAddChat);

    expect(onAddChat).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddChat).toHaveBeenCalledTimes(1);
    expect(onAddChat).toHaveBeenCalledWith(
      parseLiveChatTextMessageRenderer(
        AddChatItemAction_TextMessage.addChatItemAction.item as LiveChatTextMessageRenderer,
      ),
    );
  });
  test("addChat event is emitted with superchat", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve([AddChatItemAction_SuperChat] satisfies Actions));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddChat = jest.fn();
    emitter.on("addChat", onAddChat);

    expect(onAddChat).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddChat).toHaveBeenCalledTimes(1);
    expect(onAddChat).toHaveBeenCalledWith(
      parseLiveChatPaidMessageRenderer(
        AddChatItemAction_SuperChat.addChatItemAction.item as LiveChatPaidMessageRenderer,
      ),
    );
  });
  test("addChat event is emitted with supersticker", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddChatItemAction_SuperSticker] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddChat = jest.fn();
    emitter.on("addChat", onAddChat);

    expect(onAddChat).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddChat).toHaveBeenCalledTimes(1);
    expect(onAddChat).toHaveBeenCalledWith(
      parseLiveChatPaidStickerRenderer(
        AddChatItemAction_SuperSticker.addChatItemAction.item as LiveChatPaidStickerRenderer,
      ),
    );
  });
  test("emitted events are kept orders as receiving chat api sequences", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([
          AddChatItemAction_SuperSticker,
          AddChatItemAction_SuperChat,
        ] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddChat = jest.fn();
    emitter.on("addChat", onAddChat);

    expect(onAddChat).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddChat).toHaveBeenCalledTimes(2);
    expect(onAddChat).toHaveBeenNthCalledWith(
      1,
      parseLiveChatPaidStickerRenderer(
        AddChatItemAction_SuperSticker.addChatItemAction.item as LiveChatPaidStickerRenderer,
      ),
    );
    expect(onAddChat).toHaveBeenNthCalledWith(
      2,
      parseLiveChatPaidMessageRenderer(
        AddChatItemAction_SuperChat.addChatItemAction.item as LiveChatPaidMessageRenderer,
      ),
    );
  });
});

describe("check about the removeChat event", () => {
  test("removeChat event emitted when chat deleted", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() => Promise.resolve([RemoveChatItemAction_01] satisfies Actions));
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onRemoveChat = jest.fn();
    emitter.on("removeChat", onRemoveChat);

    expect(onRemoveChat).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onRemoveChat).toHaveBeenCalledTimes(1);
    expect(onRemoveChat).toHaveBeenCalledWith(
      new LiveChatItemId(RemoveChatItemAction_01.removeChatItemAction.targetItemId),
    );
  });
});

describe("check about the blockUser event", () => {
  test("blockUser event is emitted by owner operation", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([RemoveChatItemByAuthorAction_01] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onBlockUser = jest.fn();
    emitter.on("blockUser", onBlockUser);

    expect(onBlockUser).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onBlockUser).toHaveBeenCalledTimes(1);
    expect(onBlockUser).toHaveBeenCalledWith(
      new ChannelId(RemoveChatItemByAuthorAction_01.removeChatItemByAuthorAction.externalChannelId),
    );
  });
});

describe("check about the pinned event", () => {
  test("pinned event is emitted by owner operation", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddBannerToLiveChatCommand_PinnedMessage] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onPinned = jest.fn();
    emitter.on("pinned", onPinned);

    expect(onPinned).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onPinned).toHaveBeenCalledTimes(1);
    expect(onPinned).toHaveBeenCalledWith(
      parseLiveChatTextMessageRenderer(
        AddBannerToLiveChatCommand_PinnedMessage.addBannerToLiveChatCommand.bannerRenderer
          .liveChatBannerRenderer.contents as LiveChatTextMessageRenderer,
      ),
    );
  });
});

describe("check about the unpinned event", () => {
  test("unpinned event is emitted by owner operation, in case of without contents", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([RemoveBannerForLiveChatCommand_01] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onUnpinned = jest.fn();
    emitter.on("unpinned", onUnpinned);

    expect(onUnpinned).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onUnpinned).toHaveBeenCalledTimes(1);
    expect(onUnpinned).toHaveBeenCalledWith(undefined);
  });

  test("unpinned event is emitted by owner operation, in case of with contents", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([
          AddBannerToLiveChatCommand_PinnedMessage,
          RemoveBannerForLiveChatCommand_01,
        ] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onUnpinned = jest.fn();
    emitter.on("unpinned", onUnpinned);

    expect(onUnpinned).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onUnpinned).toHaveBeenCalledTimes(1);
    expect(onUnpinned).toHaveBeenCalledWith(
      parseLiveChatTextMessageRenderer(
        AddBannerToLiveChatCommand_PinnedMessage.addBannerToLiveChatCommand.bannerRenderer
          .liveChatBannerRenderer.contents as LiveChatTextMessageRenderer,
      ),
    );
  });
});

describe("check about the memberships event", () => {
  test("memberships event is emitted when someone joined new memberships", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddChatItemAction_NewMembership] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onMemberships = jest.fn();
    emitter.on("memberships", onMemberships);

    expect(onMemberships).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onMemberships).toHaveBeenCalledTimes(1);
    expect(onMemberships).toHaveBeenCalledWith(
      parseLiveChatMembershipItemRenderer(
        AddChatItemAction_NewMembership.addChatItemAction.item as LiveChatMembershipItemRenderer,
      ),
    );
  });

  test("memberships event is emitted when someone reached milestone.", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddChatItemAction_MembershipMilestone] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onMemberships = jest.fn();
    emitter.on("memberships", onMemberships);

    expect(onMemberships).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onMemberships).toHaveBeenCalledTimes(1);
    expect(onMemberships).toHaveBeenCalledWith(
      parseLiveChatMembershipItemRenderer(
        AddChatItemAction_MembershipMilestone.addChatItemAction
          .item as LiveChatMembershipItemRenderer,
      ),
    );
  });
});

describe("check about the sponsorshipsGift event", () => {
  test("sponsorshipsGift event is emitted when someone purchased the gift", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddChatItemAction_SponsorshipsGiftPurchase] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onSponsorshipsGift = jest.fn();
    emitter.on("sponsorshipsGift", onSponsorshipsGift);

    expect(onSponsorshipsGift).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onSponsorshipsGift).toHaveBeenCalledTimes(1);
    expect(onSponsorshipsGift).toHaveBeenCalledWith(
      parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
        AddChatItemAction_SponsorshipsGiftPurchase.addChatItemAction
          .item as LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
      ),
    );
  });
});

describe("check about the redemptionGift event", () => {
  test("redemptionGift event is emitted when someone took the gift which others purchased", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddChatItemAction_SponsorshipsGiftRedemption] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onRedemptionGift = jest.fn();
    emitter.on("redemptionGift", onRedemptionGift);

    expect(onRedemptionGift).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onRedemptionGift).toHaveBeenCalledTimes(1);
    expect(onRedemptionGift).toHaveBeenCalledWith(
      parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(
        AddChatItemAction_SponsorshipsGiftRedemption.addChatItemAction
          .item as LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
      ),
    );
  });
});

describe("check about the addTicker event", () => {
  test("addTicker event is emitted, by superchat", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddLiveChatTickerItemAction_SuperChat] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddTicker = jest.fn();
    emitter.on("addTicker", onAddTicker);

    expect(onAddTicker).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddTicker).toHaveBeenCalledTimes(1);
    expect(onAddTicker).toHaveBeenCalledWith(
      parseLiveChatTickerPaidMessageItemRenderer(
        AddLiveChatTickerItemAction_SuperChat.addLiveChatTickerItemAction
          .item as LiveChatTickerPaidMessageItemRenderer,
      ),
    );
  });

  test("addTicker event is emitted, by super sticker", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddLiveChatTickerItemAction_SuperSticker] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddTicker = jest.fn();
    emitter.on("addTicker", onAddTicker);

    expect(onAddTicker).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddTicker).toHaveBeenCalledTimes(1);
    expect(onAddTicker).toHaveBeenCalledWith(
      parseLiveChatTickerPaidStickerItemRenderer(
        AddLiveChatTickerItemAction_SuperSticker.addLiveChatTickerItemAction
          .item as LiveChatTickerPaidStickerItemRenderer,
      ),
    );
  });

  test("addTicker event is emitted, by new membership", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddLiveChatTickerItemAction_NewMembership] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddTicker = jest.fn();
    emitter.on("addTicker", onAddTicker);

    expect(onAddTicker).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddTicker).toHaveBeenCalledTimes(1);
    expect(onAddTicker).toHaveBeenCalledWith(
      parseLiveChatTickerSponsorItemRenderer(
        AddLiveChatTickerItemAction_NewMembership.addLiveChatTickerItemAction
          .item as LiveChatTickerSponsorItemRenderer,
      ),
    );
  });

  test("addTicker event is emitted, by membership milestone", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddLiveChatTickerItemAction_MembershipMilestone] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddTicker = jest.fn();
    emitter.on("addTicker", onAddTicker);

    expect(onAddTicker).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddTicker).toHaveBeenCalledTimes(1);
    expect(onAddTicker).toHaveBeenCalledWith(
      parseLiveChatTickerSponsorItemRenderer(
        AddLiveChatTickerItemAction_MembershipMilestone.addLiveChatTickerItemAction
          .item as LiveChatTickerSponsorItemRenderer,
      ),
    );
  });

  test("addTicker event is emitted, by purchased the gift", async () => {
    jest.spyOn(YoutubeLiveChatApi.prototype, "init").mockImplementation(() => Promise.resolve());
    jest
      .spyOn(YoutubeLiveChatApi.prototype, "getNextActions")
      .mockImplementation(() =>
        Promise.resolve([AddLiveChatTickerItemAction_GiftPurchased] satisfies Actions),
      );
    const emitter = new YoutubeLiveChatEmitter("@test_channel");
    const onAddTicker = jest.fn();
    emitter.on("addTicker", onAddTicker);

    expect(onAddTicker).toHaveBeenCalledTimes(0);
    await emitter.start();
    expect(onAddTicker).toHaveBeenCalledTimes(1);
    expect(onAddTicker).toHaveBeenCalledWith(
      parseLiveChatTickerSponsorItemRenderer(
        AddLiveChatTickerItemAction_GiftPurchased.addLiveChatTickerItemAction
          .item as LiveChatTickerSponsorItemRenderer,
      ),
    );
  });
});

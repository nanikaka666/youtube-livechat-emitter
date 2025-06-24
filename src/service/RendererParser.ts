import { ChannelId } from "../core/ChannelId";
import { UnknownJsonDataError } from "../core/errors";
import { LiveChatItemId } from "../core/LiveChatItemId";
import {
  Author,
  AuthorType,
  ChatItemSuperChat,
  ChatItemSuperSticker,
  ChatItemText,
  Color,
  Colors,
  GiftRedemption,
  GiftTicker,
  Image,
  MembershipItem,
  MembershipMilestone,
  Memberships,
  MembershipTicker,
  MessageItem,
  SponsorshipsGift,
  SuperChatTicker,
  SuperStickerTicker,
  TextMessage,
} from "../types/liveChat";
import { AuthorName, Message, Thumbnail, Thumbnails } from "../zod/common";
import {
  AuthorBadges,
  LiveChatMembershipItemRenderer,
  LiveChatPaidMessageRenderer,
  LiveChatPaidStickerRenderer,
  LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
  LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
  LiveChatTextMessageRenderer,
  LiveChatTickerPaidMessageItemRenderer,
  LiveChatTickerPaidStickerItemRenderer,
  LiveChatTickerSponsorItemRenderer,
} from "../zod/renderer";

export function parseLiveChatTextMessageRenderer(
  renderer: LiveChatTextMessageRenderer,
): ChatItemText {
  return {
    type: "text",
    id: new LiveChatItemId(renderer.liveChatTextMessageRenderer.id),
    timestamp: renderer.liveChatTextMessageRenderer.timestampUsec,
    author: makeAuthor(
      renderer.liveChatTextMessageRenderer.authorExternalChannelId,
      renderer.liveChatTextMessageRenderer.authorName,
      renderer.liveChatTextMessageRenderer.authorPhoto,
      renderer.liveChatTextMessageRenderer.authorBadges,
    ),
    messages: parseMessage(renderer.liveChatTextMessageRenderer.message),
  };
}

export function parseLiveChatPaidMessageRenderer(renderer: LiveChatPaidMessageRenderer) {
  const res: ChatItemSuperChat = {
    type: "superChat",
    id: new LiveChatItemId(renderer.liveChatPaidMessageRenderer.id),
    timestamp: renderer.liveChatPaidMessageRenderer.timestampUsec,
    author: makeAuthor(
      renderer.liveChatPaidMessageRenderer.authorExternalChannelId,
      renderer.liveChatPaidMessageRenderer.authorName,
      renderer.liveChatPaidMessageRenderer.authorPhoto,
      renderer.liveChatPaidMessageRenderer.authorBadges,
    ),
    superChat: {
      amount: renderer.liveChatPaidMessageRenderer.purchaseAmountText.simpleText,
      color: convertDecimalToColor(renderer.liveChatPaidMessageRenderer.bodyBackgroundColor),
    },
  };
  if (renderer.liveChatPaidMessageRenderer.message) {
    res.messages = parseMessage(renderer.liveChatPaidMessageRenderer.message);
  }

  return res;
}

export function parseLiveChatPaidStickerRenderer(renderer: LiveChatPaidStickerRenderer) {
  const res: ChatItemSuperSticker = {
    type: "superSticker",
    id: new LiveChatItemId(renderer.liveChatPaidStickerRenderer.id),
    timestamp: renderer.liveChatPaidStickerRenderer.timestampUsec,
    author: makeAuthor(
      renderer.liveChatPaidStickerRenderer.authorExternalChannelId,
      renderer.liveChatPaidStickerRenderer.authorName,
      renderer.liveChatPaidStickerRenderer.authorPhoto,
      renderer.liveChatPaidStickerRenderer.authorBadges,
    ),
    superSticker: {
      amount: renderer.liveChatPaidStickerRenderer.purchaseAmountText.simpleText,
      thumbnails: parseThumbnails(renderer.liveChatPaidStickerRenderer.sticker),
      color: convertDecimalToColor(renderer.liveChatPaidStickerRenderer.backgroundColor),
    },
  };

  return res;
}

export function parseLiveChatMembershipItemRenderer(
  renderer: LiveChatMembershipItemRenderer,
): MembershipItem {
  if (renderer.liveChatMembershipItemRenderer.headerPrimaryText) {
    // milestone
    const res: MembershipMilestone = {
      type: "milestone",
      id: new LiveChatItemId(renderer.liveChatMembershipItemRenderer.id),
      timestamp: renderer.liveChatMembershipItemRenderer.timestampUsec,
      author: makeAuthor(
        renderer.liveChatMembershipItemRenderer.authorExternalChannelId,
        renderer.liveChatMembershipItemRenderer.authorName,
        renderer.liveChatMembershipItemRenderer.authorPhoto,
        renderer.liveChatMembershipItemRenderer.authorBadges,
      ),
      milestone: parseMessage(renderer.liveChatMembershipItemRenderer.headerPrimaryText),
    };
    if (renderer.liveChatMembershipItemRenderer.message) {
      res.messages = parseMessage(renderer.liveChatMembershipItemRenderer.message);
    }
    return res;
  } else {
    const messages: MessageItem[] =
      "simpleText" in renderer.liveChatMembershipItemRenderer.headerSubtext
        ? [
            {
              type: "text",
              text: renderer.liveChatMembershipItemRenderer.headerSubtext.simpleText,
            } as TextMessage,
          ]
        : parseMessage(renderer.liveChatMembershipItemRenderer.headerSubtext);
    return {
      type: "new",
      id: new LiveChatItemId(renderer.liveChatMembershipItemRenderer.id),
      timestamp: renderer.liveChatMembershipItemRenderer.timestampUsec,
      author: makeAuthor(
        renderer.liveChatMembershipItemRenderer.authorExternalChannelId,
        renderer.liveChatMembershipItemRenderer.authorName,
        renderer.liveChatMembershipItemRenderer.authorPhoto,
        renderer.liveChatMembershipItemRenderer.authorBadges,
      ),
      messages: messages,
    };
  }
}

export function parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
  renderer: LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
): SponsorshipsGift {
  return {
    author: makeAuthor(
      renderer.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer.authorExternalChannelId,
      renderer.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer.header
        .liveChatSponsorshipsHeaderRenderer.authorName,
      renderer.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer.header
        .liveChatSponsorshipsHeaderRenderer.authorPhoto,
      renderer.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer.header
        .liveChatSponsorshipsHeaderRenderer.authorBadges,
    ),
    messages: parseMessage(
      renderer.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer.header
        .liveChatSponsorshipsHeaderRenderer.primaryText,
    ),
    images: parseThumbnails(
      renderer.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer.header
        .liveChatSponsorshipsHeaderRenderer.image,
    ),
  };
}

export function parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(
  renderer: LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
): GiftRedemption {
  return {
    id: new LiveChatItemId(renderer.liveChatSponsorshipsGiftRedemptionAnnouncementRenderer.id),
    timestamp: renderer.liveChatSponsorshipsGiftRedemptionAnnouncementRenderer.timestampUsec,
    author: makeAuthor(
      renderer.liveChatSponsorshipsGiftRedemptionAnnouncementRenderer.authorExternalChannelId,
      renderer.liveChatSponsorshipsGiftRedemptionAnnouncementRenderer.authorName,
      renderer.liveChatSponsorshipsGiftRedemptionAnnouncementRenderer.authorPhoto,
      undefined,
    ),
    messages: parseMessage(renderer.liveChatSponsorshipsGiftRedemptionAnnouncementRenderer.message),
  };
}

function makeAuthor(
  authorExternalChannelId: string,
  authorName: AuthorName,
  authorPhoto: Thumbnails,
  authorBadges?: AuthorBadges,
): Author {
  return {
    channelId: new ChannelId(authorExternalChannelId),
    name: authorName.simpleText,
    thumbnails: parseThumbnails(authorPhoto),
    authorType: getAuthorType(authorBadges),
    memberships: getMemberships(authorBadges),
  };
}

export function parseLiveChatTickerPaidMessageItemRenderer(
  renderer: LiveChatTickerPaidMessageItemRenderer,
): SuperChatTicker {
  return {
    type: "superChat",
    durationSec: renderer.liveChatTickerPaidMessageItemRenderer.durationSec,
    item: parseLiveChatPaidMessageRenderer(
      renderer.liveChatTickerPaidMessageItemRenderer.showItemEndpoint.showLiveChatItemEndpoint
        .renderer,
    ),
  };
}

export function parseLiveChatTickerPaidStickerItemRenderer(
  renderer: LiveChatTickerPaidStickerItemRenderer,
): SuperStickerTicker {
  return {
    type: "superSticker",
    durationSec: renderer.liveChatTickerPaidStickerItemRenderer.durationSec,
    item: parseLiveChatPaidStickerRenderer(
      renderer.liveChatTickerPaidStickerItemRenderer.showItemEndpoint.showLiveChatItemEndpoint
        .renderer,
    ),
  };
}

export function parseLiveChatTickerSponsorItemRenderer(
  renderer: LiveChatTickerSponsorItemRenderer,
): MembershipTicker | GiftTicker {
  const innerRenderer =
    renderer.liveChatTickerSponsorItemRenderer.showItemEndpoint.showLiveChatItemEndpoint.renderer;
  const messages: MessageItem[] =
    "simpleText" in renderer.liveChatTickerSponsorItemRenderer.detailText
      ? [
          {
            type: "text",
            text: renderer.liveChatTickerSponsorItemRenderer.detailText.simpleText,
          } as TextMessage,
        ]
      : parseMessage(renderer.liveChatTickerSponsorItemRenderer.detailText);
  if ("liveChatMembershipItemRenderer" in innerRenderer) {
    return {
      type: "membership",
      durationSec: renderer.liveChatTickerSponsorItemRenderer.durationSec,
      messages: messages,
      item: parseLiveChatMembershipItemRenderer(innerRenderer),
    };
  } else if ("liveChatSponsorshipsGiftPurchaseAnnouncementRenderer" in innerRenderer) {
    return {
      type: "gift",
      durationSec: renderer.liveChatTickerSponsorItemRenderer.durationSec,
      messages: messages,
      item: parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(innerRenderer),
    };
  } else {
    throw new UnknownJsonDataError(innerRenderer, `Unknown type detected. ${innerRenderer}`);
  }
}

function parseThumbnails(thumbnails: Thumbnails): Image[] {
  return thumbnails.thumbnails.map((thumbnail) => parseThumbnail(thumbnail));
}

function parseThumbnail(thumbnail: Thumbnail): Image {
  // by my observation, "https:" string is dropped in case of super sticker's image url.
  const res: Image = {
    url: thumbnail.url.startsWith("https:") ? thumbnail.url : "https:" + thumbnail.url,
  };

  if (thumbnail.height && thumbnail.width) {
    res.size = {
      width: thumbnail.width,
      height: thumbnail.height,
    };
  }

  return res;
}

function getAuthorType(authorBadges?: AuthorBadges): AuthorType {
  if (authorBadges) {
    for (const item of authorBadges) {
      if (item.liveChatAuthorBadgeRenderer.icon) {
        const iconType = item.liveChatAuthorBadgeRenderer.icon.iconType;
        if (iconType === "OWNER") {
          return "owner";
        } else if (iconType === "MODERATOR") {
          return "moderator";
        }
      }
    }
  }

  return "general";
}

function getMemberships(authorBadges?: AuthorBadges): Memberships | undefined {
  if (authorBadges) {
    for (const item of authorBadges) {
      if (item.liveChatAuthorBadgeRenderer.customThumbnail) {
        return {
          thumbnails: parseThumbnails(item.liveChatAuthorBadgeRenderer.customThumbnail),
          label: item.liveChatAuthorBadgeRenderer.tooltip,
        };
      }
    }
  }
  return undefined;
}

function parseMessage(message: Message): MessageItem[] {
  const res: MessageItem[] = [];
  let text = "";
  let i = 0;
  while (i < message.runs.length) {
    const item = message.runs[i];
    if ("text" in item) {
      text += item.text;
    } else {
      if (text !== "") {
        res.push({
          type: "text",
          text: text,
        });
        text = "";
      }
      res.push({
        type: "images",
        images: parseThumbnails(item.emoji.image),
      });
    }
    i++;
  }

  if (text !== "") {
    res.push({
      type: "text",
      text: text,
    });
  }

  return res;
}

function convertDecimalToColor(decimal: number): Color {
  const hex = decimal.toString(16).slice(2);
  return Colors.filter((color) => color.hex === hex)[0];
}

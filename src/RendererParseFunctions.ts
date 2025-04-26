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
} from "./types/liveChat";
import { AuthorName, Message, Thumbnail, Thumbnails } from "./zod/common";
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
} from "./zod/renderer";

export function parseLiveChatTextMessageRenderer(
  renderer: LiveChatTextMessageRenderer,
): ChatItemText {
  return {
    type: "text",
    id: renderer.id,
    timestamp: renderer.timestampUsec,
    author: makeAuthor(
      renderer.authorExternalChannelId,
      renderer.authorName,
      renderer.authorPhoto.thumbnails,
      renderer.authorBadges,
    ),
    messages: parseMessage(renderer.message),
  };
}

export function parseLiveChatPaidMessageRenderer(renderer: LiveChatPaidMessageRenderer) {
  const res: ChatItemSuperChat = {
    type: "superChat",
    id: renderer.id,
    timestamp: renderer.timestampUsec,
    author: makeAuthor(
      renderer.authorExternalChannelId,
      renderer.authorName,
      renderer.authorPhoto.thumbnails,
      renderer.authorBadges,
    ),
    superChat: {
      amount: renderer.purchaseAmountText.simpleText,
      color: convertDecimalToColor(renderer.bodyBackgroundColor),
    },
  };
  if (renderer.message) {
    res.messages = parseMessage(renderer.message);
  }

  return res;
}

export function parseLiveChatPaidStickerRenderer(renderer: LiveChatPaidStickerRenderer) {
  const res: ChatItemSuperSticker = {
    type: "superSticker",
    id: renderer.id,
    timestamp: renderer.timestampUsec,
    author: makeAuthor(
      renderer.authorExternalChannelId,
      renderer.authorName,
      renderer.authorPhoto.thumbnails,
      renderer.authorBadges,
    ),
    superSticker: {
      amount: renderer.purchaseAmountText.simpleText,
      thumbnails: parseThumbnails(renderer.sticker.thumbnails),
      color: convertDecimalToColor(renderer.backgroundColor),
    },
  };

  return res;
}

export function parseLiveChatMembershipItemRenderer(
  renderer: LiveChatMembershipItemRenderer,
): MembershipItem {
  if (renderer.headerPrimaryText) {
    // milestone
    const res: MembershipMilestone = {
      type: "milestone",
      id: renderer.id,
      timestamp: renderer.timestampUsec,
      author: makeAuthor(
        renderer.authorExternalChannelId,
        renderer.authorName,
        renderer.authorPhoto.thumbnails,
        renderer.authorBadges,
      ),
      milestone: parseMessage(renderer.headerPrimaryText),
    };
    if (renderer.message) {
      res.messages = parseMessage(renderer.message);
    }
    return res;
  } else {
    const messages: MessageItem[] =
      "simpleText" in renderer.headerSubtext
        ? [{ type: "text", text: renderer.headerSubtext.simpleText } as TextMessage]
        : parseMessage(renderer.headerSubtext);
    return {
      type: "new",
      id: renderer.id,
      timestamp: renderer.timestampUsec,
      author: makeAuthor(
        renderer.authorExternalChannelId,
        renderer.authorName,
        renderer.authorPhoto.thumbnails,
        renderer.authorBadges,
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
      renderer.authorExternalChannelId,
      renderer.header.liveChatSponsorshipsHeaderRenderer.authorName,
      renderer.header.liveChatSponsorshipsHeaderRenderer.authorPhoto.thumbnails,
      renderer.header.liveChatSponsorshipsHeaderRenderer.authorBadges,
    ),
    messages: parseMessage(renderer.header.liveChatSponsorshipsHeaderRenderer.primaryText),
    images: parseThumbnails(renderer.header.liveChatSponsorshipsHeaderRenderer.image.thumbnails),
  };
}

export function parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(
  renderer: LiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
): GiftRedemption {
  return {
    id: renderer.id,
    timestamp: renderer.timestampUsec,
    author: makeAuthor(
      renderer.authorExternalChannelId,
      renderer.authorName,
      renderer.authorPhoto.thumbnails,
      undefined,
    ),
    messages: parseMessage(renderer.message),
  };
}

function makeAuthor(
  authorExternalChannelId: string,
  authorName: AuthorName,
  authorPhoto: Thumbnails,
  authorBadges?: AuthorBadges,
): Author {
  return {
    channelId: authorExternalChannelId,
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
    durationSec: renderer.durationSec,
    item: parseLiveChatPaidMessageRenderer(
      renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer.liveChatPaidMessageRenderer,
    ),
  };
}

export function parseLiveChatTickerPaidStickerItemRenderer(
  renderer: LiveChatTickerPaidStickerItemRenderer,
): SuperStickerTicker {
  return {
    type: "superSticker",
    durationSec: renderer.durationSec,
    item: parseLiveChatPaidStickerRenderer(
      renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer.liveChatPaidStickerRenderer,
    ),
  };
}

export function parseLiveChatTickerSponsorItemRenderer(
  renderer: LiveChatTickerSponsorItemRenderer,
): MembershipTicker | GiftTicker {
  const innerRenderer = renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer;
  const messages: MessageItem[] =
    "simpleText" in renderer.detailText
      ? [{ type: "text", text: renderer.detailText.simpleText } as TextMessage]
      : parseMessage(renderer.detailText);
  if ("liveChatMembershipItemRenderer" in innerRenderer) {
    return {
      type: "membership",
      durationSec: renderer.durationSec,
      messages: messages,
      item: parseLiveChatMembershipItemRenderer(innerRenderer.liveChatMembershipItemRenderer),
    };
  } else {
    return {
      type: "gift",
      durationSec: renderer.durationSec,
      messages: messages,
      item: parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
        innerRenderer.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
      ),
    };
  }
}

function parseThumbnails(thumbnails: Thumbnails): Image[] {
  return thumbnails.map((thumbnail) => parseThumbnail(thumbnail));
}

function parseThumbnail(thumbnail: Thumbnail): Image {
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
          thumbnails: parseThumbnails(item.liveChatAuthorBadgeRenderer.customThumbnail.thumbnails),
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
        images: parseThumbnails(item.emoji.image.thumbnails),
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

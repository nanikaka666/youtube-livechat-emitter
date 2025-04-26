export interface ImageSize {
  width: number;
  height: number;
}

export interface Image {
  url: string;
  size?: ImageSize;
}

export type AuthorType = "owner" | "moderator" | "general";

export interface Author {
  channelId: string;
  name: string;
  thumbnails: Image[];
  authorType: AuthorType;
  memberships?: Memberships;
}

export interface Memberships {
  label: string;
  thumbnails: Image[];
}

export interface TextMessage {
  type: "text";
  text: string;
}

export interface ImagesMessage {
  type: "images";
  images: Image[];
}

export interface SuperChat {
  amount: string;
  color: Color;
}

export interface SuperSticker {
  amount: string;
  thumbnails: Image[];
  color: Color;
}

export type MessageItem = TextMessage | ImagesMessage;

export const Blue = {
  level: 1,
  label: "BLUE",
  hex: "1e88e5",
} as const;

export const LightBlue = {
  level: 2,
  label: "LIGHT BLUE",
  hex: "00e5ff",
} as const;

export const YellowGreen = {
  level: 3,
  label: "YELLOW GREEN",
  hex: "1de9b6",
} as const;

export const Yellow = {
  level: 4,
  label: "YELLOW",
  hex: "ffca28",
} as const;

export const Orange = {
  level: 5,
  label: "ORANGE",
  hex: "f57c00",
} as const;

export const Magenta = {
  level: 6,
  label: "MAGENTA",
  hex: "e91e63",
} as const;

export const Red = {
  level: 7,
  label: "RED",
  hex: "e62117",
} as const;

export const Colors: Color[] = [Blue, LightBlue, YellowGreen, Yellow, Orange, Magenta, Red];

export type Color =
  | typeof Blue
  | typeof LightBlue
  | typeof YellowGreen
  | typeof Yellow
  | typeof Orange
  | typeof Magenta
  | typeof Red;

export interface ChatItemText {
  type: "text";
  id: string;
  timestamp: number;
  author: Author;
  messages: MessageItem[];
}

export interface ChatItemSuperChat {
  type: "superChat";
  id: string;
  timestamp: number;
  author: Author;
  messages?: MessageItem[];
  superChat: SuperChat;
}

export interface ChatItemSuperSticker {
  type: "superSticker";
  id: string;
  timestamp: number;
  author: Author;
  messages?: MessageItem[];
  superSticker: SuperSticker;
}

export type LiveChatItem = ChatItemText | ChatItemSuperChat | ChatItemSuperSticker;

export interface NewMembership {
  type: "new";
  id: string;
  timestamp: number;
  author: Author;
  messages: MessageItem[];
}

export interface MembershipMilestone {
  type: "milestone";
  id: string;
  timestamp: number;
  author: Author;
  messages?: MessageItem[];
  milestone: MessageItem[];
}

export type MembershipItem = NewMembership | MembershipMilestone;

export interface SponsorshipsGift {
  author: Author;
  messages?: MessageItem[];
  images: Image[];
}

export interface GiftRedemption {
  id: string;
  timestamp: number;
  author: Author;
  messages: MessageItem[];
}

export interface SuperChatTicker {
  type: "superChat";
  durationSec: number;
  item: ChatItemSuperChat;
}

export interface SuperStickerTicker {
  type: "superSticker";
  durationSec: number;
  item: ChatItemSuperSticker;
}

export interface MembershipTicker {
  type: "membership";
  durationSec: number;
  messages: MessageItem[];
  item: MembershipItem;
}

export interface GiftTicker {
  type: "gift";
  durationSec: number;
  messages: MessageItem[];
  item: SponsorshipsGift;
}

export type TickerItem = SuperChatTicker | SuperStickerTicker | MembershipTicker | GiftTicker;

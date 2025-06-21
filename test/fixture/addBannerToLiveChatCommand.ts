import { AddBannerToLiveChatCommand } from "../../src/zod/action";
import { LiveChatTextMessageRenderer } from "../../src/zod/renderer";
import { AddChatItemAction_TextMessage } from "./addChatItemAction";

export const AddBannerToLiveChatCommand_PinnedMessage: AddBannerToLiveChatCommand = {
  addBannerToLiveChatCommand: {
    bannerRenderer: {
      liveChatBannerRenderer: {
        header: {
          liveChatBannerHeaderRenderer: {
            icon: {
              iconType: "KEEP",
            },
            text: {
              runs: [
                {
                  text: "Pinned by ",
                },
                {
                  text: "AUTHOR_NAME",
                },
              ],
            },
          },
        },
        contents: AddChatItemAction_TextMessage.addChatItemAction
          .item as LiveChatTextMessageRenderer,
        actionId: "ACTION_ID",
        bannerType: "LIVE_CHAT_BANNER_TYPE_PINNED_MESSAGE",
      },
    },
  },
};

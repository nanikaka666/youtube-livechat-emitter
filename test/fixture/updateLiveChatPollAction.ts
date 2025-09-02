import { UpdateLiveChatPollAction } from "../../src/zod/action";

export const UpdateLiveChatPollAction_01: UpdateLiveChatPollAction = {
  updateLiveChatPollAction: {
    pollToUpdate: {
      pollRenderer: {
        choices: [
          {
            text: {
              runs: [
                {
                  text: "Choice 1",
                },
              ],
            },
            selected: false,
            voteRatio: 0.37336796522140503,
            votePercentage: {
              simpleText: "37%",
            },
            selectServiceEndpoint: {
              commandMetadata: {
                webCommandMetadata: {
                  sendPost: true,
                  apiUrl: "/youtubei/v1/live_chat/send_live_chat_vote",
                },
              },
              sendLiveChatVoteEndpoint: {
                params:
                  "Q2lrcUp3b1lWVU9xTWtaNGNXWXpOMFJCV2pCYWFFbHpaREZHV25kQkVndDZiMjE1Y0hOclgzSkRRUkllQ2h3S0drTk1ka295U25GSWMwazRSRVpTVFMxeVVWbGtaSGcwZEUxUklnQXFHZ29ZVlVOMU1rWjRjV1l6TjBSQldqQmFhRWx6WkRGR1duZEJNQUU0QkVBQVNpUlZaMnQ0VjNWMk1rdDNjRkJvTFRsSmIxUnlRbmRZWXpSM1dsWmpkV1ZHVmtKTmJtOCUzRA==",
              },
            },
          },
          {
            text: {
              runs: [
                {
                  text: "Choice 2",
                },
              ],
            },
            selected: false,
            voteRatio: 0.626632034778595,
            votePercentage: {
              simpleText: "63%",
            },
            selectServiceEndpoint: {
              commandMetadata: {
                webCommandMetadata: {
                  sendPost: true,
                  apiUrl: "/youtubei/v1/live_chat/send_live_chat_vote",
                },
              },
              sendLiveChatVoteEndpoint: {
                params:
                  "Q2lrcUp3b1lWVU9xTWtaNGNXWXpOMFJCV2pCYWFFbHpaREZHV25kQkVndDZiMjE1Y0hOclgzSkRRUkllQ2h3S0drTk1ka295U25GSWMwazRSRVpTVFMxeVVWbGtaSGcwZEUxUklnSUlBU29hQ2hoVlEzVXlSbmh4WmpNM1JFRmFNRnBvU1hOa01VWmFkMEV3QVRnRVFBQktKRlZuYTNoWGRYWXlTM2R3VUdndE9VbHZWSEpDZDFoak5IZGFWbU4xWlVaV1FrMXVidyUzRCUzRA==",
              },
            },
          },
        ],
        liveChatPollId: "ChwKGkNMdkoySnFIc0k4REZSTS1yUVlkZHg0dE2R",
        header: {
          pollHeaderRenderer: {
            pollQuestion: {
              runs: [
                {
                  text: "Question",
                },
              ],
            },
            thumbnail: {
              thumbnails: [
                {
                  url: "https://yt4.ggpht.com/U0CaG8nlGBNuyJj679CHNz_GdTdaweo0Ybf91ZUnQYIMyRWh7gUp13tIW4qQgIxAcCZKZKur=s32-c-k-c0x00ffffff-no-rj",
                  width: 32,
                  height: 32,
                },
                {
                  url: "https://yt4.ggpht.com/U0CaG8nlGBNuyJj679CHNz_GdTdaweo0Ybf91ZUnQYIMyRWh7gUp13tIW4qQgIxAcCZKZKur=s64-c-k-c0x00ffffff-no-rj",
                  width: 64,
                  height: 64,
                },
              ],
            },
            metadataText: {
              runs: [
                {
                  text: "Author name",
                },
                {
                  text: " • ",
                },
                {
                  text: "2 分前",
                },
                {
                  text: " • ",
                },
                {
                  text: "31,173 票",
                },
              ],
            },
            liveChatPollType: "LIVE_CHAT_POLL_TYPE_CREATOR",
            contextMenuButton: {
              buttonRenderer: {
                icon: {
                  iconType: "MORE_VERT",
                },
                accessibility: {
                  label: "チャットの操作",
                },
                accessibilityData: {
                  accessibilityData: {
                    label: "チャットの操作",
                  },
                },
                targetId: "live-chat-action-panel-poll-context-menu",
                command: {
                  commandMetadata: {
                    webCommandMetadata: {
                      ignoreNavigation: true,
                    },
                  },
                  liveChatItemContextMenuEndpoint: {
                    params:
                      "Q2g0S0hBb2FRMHgyU3pKS2NVaHpTVGhFUmxKTkxYSlJXV1JrZURSMFRWRWFLU29uQ2hoVlEzVXlSbmh4WmpNM1JFRmFNRnBvU1hOa01VWmFkMEVTQzNwdmJYbHdjMnRmY2tOQklBRW9CRElhQ2hoVlEzVXlSbmh4WmpNM1JFRmFNRnBvU1hOa01VWmFkMEU0QTBnQVVCVSUzRA==",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

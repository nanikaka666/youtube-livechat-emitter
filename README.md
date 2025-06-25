# youtube-livechat-emitter

The simple emitter to emit the events of YouTube LiveChat.

# Getting Started

Install

```bash
npm i youtube-livechat-emitter
```

Import and create instance

```typescript
import { YoutubeLiveChatEmitter } from "youtube-livechat-emitter";

const channelId = "@channelHandle"; // not handle style is also valid.
const timeoutMilliSeconds = 1 * 1000; // polling interval to fetch live chat data

const emitter = new YoutubeLiveChatEmitter(channelId, timeoutMilliSeconds);
```

Set event listeners you want to observe.
There are 12 kind of events.

1. start

`start` event will be emitted when emitter starts successfully.
No parameters passed to listener function.

```typescript
emitter.on("start", () => {
  // do something.
});
```

2. end

`end` event will be emitted when emitter stops the job.
No parameters passed to listener function.

```typescript
emitter.on("end", () => {
  // do something.
});
```

3. error

`error` event will be emitted when something wrong caused in emitter's job.
`Error` parameter passed to listener function.

```typescript
emitter.on("error", (err: Error) => {
  // do something.
});
```

4. addChat

`addChat` event will be emitted when someone chats, do super chat or do super sticker.
`LiveChatItem` parameter passed to listener function.

You can know what kind of item via `type` field.

```typescript
emitter.on("error", (item: LiveChatItem) => {
  // do something.
});
```

5. removeChat

`removeChat` event will be emitted when a chat removed.
`LiveChatItemId` parameter passed to listener function. It is identifier of which `LiveChatItem` instance.

```typescript
emitter.on("removeChat", (id: LiveChatItemId) => {
  // do something.
});
```

6. blockUser

`blockUser` event will be emitted when streaming owner bans someone.
`ChannelId` parameter passed to listener function. It is Youtube channel id whose banned.

```typescript
emitter.on("blockUser", (channelId: ChannelId) => {
  // do something.
});
```

7. pinned

`pinned` event will be emitted when chat item pinned by streaming owner.
`ChatItemText` parameter passed to listener function. It is item which pinned. `ChatItemText` is one of `LiveChatItem`.

```typescript
emitter.on("pinned", (item: ChatItemText) => {
  // do something.
});
```

8. unpinned

`unpinned` event will be emitted when pinned item is removed.
Optionally `ChatItemText` parameter passed to listener function.

```typescript
emitter.on("unpinned", (item?: ChatItemText) => {
  // do something.
});
```

9. memberships

`memberships` event will be emitted when someone becomes member or someone reaches member's milestone.
`MembershipItem` parameter passed to listener function.
You can distinguish which event occurred by its `type` field.

```typescript
emitter.on("memberships", (item: MembershipItem) => {
  // do something.
});
```

10. sponsorshipsGift

`sponsorshipsGift` event will be emitted when someone purchases the gift.
`SponsorshipsGift` parameter passed to listener function.

```typescript
emitter.on("sponsorshipsGift", (item: SponsorshipsGift) => {
  // do something.
});
```

11. redemptionGift

`redemptionGift` event will be emitted when someone consumes gift purchased by others.
`GiftRedemption` parameter passed to listener function.

```typescript
emitter.on("redemptionGift", (item: GiftRedemption) => {
  // do something.
});
```

12. addTicker

`addTicker` event will be emitted when ticker item fixed to chat window.
`TickerItem` parameter passed to listener function.

You can distinguish which kind of ticker by its `type` field.

The ticker items are belows:

- purchased super chat
- purchased super sticker
- someone became new membership
- purchased gift

```typescript
emitter.on("addTicker", (item: TickerItem) => {
  // do something.
});
```

After registering listener functions, call `start()`.
Since this time, emitter starts connection to external server.

```typescript
emitter.start();
```

If you want to finish this emitter, call `close()`.

```typescript
emitter.close();
```

Here is a complete sample:

```typescript
import { YoutubeLiveChatEmitter } from "youtube-livechat-emitter";

const channelId = "@CHANNEL_HANDLE";
const timeoutMilliSeconds = 1 * 1000;

const emitter = new YoutubeLiveChatEmitter(channelId, timeoutMilliSeconds);

emitter.on("error", (err) => {
  console.log("Error occurred.", err);
});

emitter.on("addChat", (item) => {
  switch (item.type) {
    case "text":
      console.log("Text", item);
      break;
    case "superChat":
      console.log("SuperChat", item);
      break;
    case "superSticker":
      console.log("SuperSticker", item);
      break;
  }
});

emitter.start();

setTimeout(() => {
  emitter.close();
}, 60 * 1000);
```

export class LiveChatItemId {
  id: string;
  constructor(id: string) {
    if (id === "") {
      throw new Error("LiveChatItemId is empty.");
    }
    if (id.match(/^[0-9a-zA-Z]{40}$/) === null) {
      throw new Error("format is invalid.");
    }
    this.id = id;
  }
}

import { LiveChatItemId } from "../../src/core/LiveChatItemId";

describe("valid cases", () => {
  test("create instance successfully", () => {
    const id = "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJYzBr";
    const actual = new LiveChatItemId(id);
    expect(actual.id).toEqual(id);
  });
});

describe("invalid cases", () => {
  test("throw exception with empty parameter", () => {
    expect(() => new LiveChatItemId("")).toThrow();
  });
  test.each([
    "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJYzB",
    "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJYzBrA",
  ])("if id consisted with not 40 letters then fails", (input) => {
    expect(() => new LiveChatItemId(input)).toThrow();
  });
  test.each([
    "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJYzB@",
    "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJYzB~",
    "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJYzB ",
  ])("if id consisted with not alphabetical or number letters then fails", (input) => {
    expect(() => new LiveChatItemId(input)).toThrow();
  });
});

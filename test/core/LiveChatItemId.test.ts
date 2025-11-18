import { LiveChatItemId } from "../../src/core/LiveChatItemId";

describe("valid cases", () => {
  test.each([
    "ChwKGkNMREs2Tk9FMTR3REZjalR3Z1FkNVRJYzBr",
    "Ci8KLUNMU2VxYURxMTVBREZhbEwtd1FkcDJVd0JBLUxveU1lc0lELTM1MjY4NzE1OA%3D%3D", // 72 characters case
  ])("create instance successfully", (input) => {
    const actual = new LiveChatItemId(input);
    expect(actual.id).toEqual(input);
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

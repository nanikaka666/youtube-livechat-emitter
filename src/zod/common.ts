import z from "zod";

export const textInRunsSchema = z.object({ text: z.string() });
export type TextInRuns = z.infer<typeof textInRunsSchema>;

export const thumbnailSchema = z.object({
  url: z.string(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
});
export type Thumbnail = z.infer<typeof thumbnailSchema>;

export const thumbnailsSchema = z.object({
  thumbnails: z.array(thumbnailSchema),
});
export type Thumbnails = z.infer<typeof thumbnailsSchema>;

export const emojiInRunsSchema = z.object({
  emoji: z.object({
    emojiId: z.string(),
    image: thumbnailsSchema,
  }),
});
export type EmojiInRuns = z.infer<typeof emojiInRunsSchema>;

export const iconTypeSchema = z.object({
  iconType: z.union([
    z.literal("MODERATOR"),
    z.literal("KEEP"),
    z.literal("OWNER"),
    z.literal("YOUTUBE_ROUND"),
    z.literal("VERIFIED"),
    z.literal("SLOW_MODE"),
    z.literal("POLL"),
  ]),
});
export type IconType = z.infer<typeof iconTypeSchema>;

export const messageSchema = z.object({
  runs: z.array(z.union([textInRunsSchema, emojiInRunsSchema])),
});
export type Message = z.infer<typeof messageSchema>;

export const timestampUsecSchema = z.coerce.number();
export type TimestampUsec = z.infer<typeof timestampUsecSchema>;

export const authorNameSchema = z
  .object({
    simpleText: z.string(),
  })
  .default({ simpleText: "" }); // if username is empty, then authorName property will be omitted. to handle this case easier, use default value with blank.
export type AuthorName = z.infer<typeof authorNameSchema>;

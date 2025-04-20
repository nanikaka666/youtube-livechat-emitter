import z from "zod";

export const textInRunsSchema = z.object({ text: z.string() });
export type TextInRuns = z.infer<typeof textInRunsSchema>;

export const thumbnailsSchema = z.object({
  thumbnails: z.array(
    z.object({
      url: z.string(),
      width: z.coerce.number().optional(),
      height: z.coerce.number().optional(),
    }),
  ),
});
export type Thumbnails = z.infer<typeof thumbnailsSchema.shape.thumbnails>;

export const emojiInRunsSchema = z.object({
  emoji: z.object({
    emojiId: z.string(),
    image: thumbnailsSchema,
  }),
});
export type EmojiInRuns = z.infer<typeof emojiInRunsSchema.shape.emoji>;

export const iconTypeSchema = z.object({
  iconType: z.union([
    z.literal("MODERATOR"),
    z.literal("KEEP"),
    z.literal("OWNER"),
    z.literal("YOUTUBE_ROUND"),
    z.literal("VERIFIED"),
    z.literal("SLOW_MODE"),
  ]),
});
export type IconType = z.infer<typeof iconTypeSchema.shape.iconType>;

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
  .default({ simpleText: "" }); // if username is empty, then authorName property will be omitted.
export type AuthorName = z.infer<typeof authorNameSchema>;

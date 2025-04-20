import z from "zod";
import { actionsSchema } from "./action";

// Zod definition

export const invalidationContinuationDataSchema = z.object({
  invalidationContinuationData: z.object({
    timeoutMs: z.number(),
    continuation: z.string(),
  }),
});
export type InvalidationContinuationData = z.infer<
  typeof invalidationContinuationDataSchema.shape.invalidationContinuationData
>;

export const timedContinuationDataSchema = z.object({
  timedContinuationData: z.object({
    continuation: z.string(),
    timeoutMs: z.number(),
  }),
});
export type TimedContinuationData = z.infer<
  typeof timedContinuationDataSchema.shape.timedContinuationData
>;

export const reloadContinuationDataSchema = z.object({
  reloadContinuationData: z.object({
    continuation: z.string(),
  }),
});
export type reloadContinuationData = z.infer<
  typeof reloadContinuationDataSchema.shape.reloadContinuationData
>;

export const continuationsSchema = z
  .array(
    z.union([
      invalidationContinuationDataSchema,
      timedContinuationDataSchema,
      reloadContinuationDataSchema,
      z.object({}).passthrough(), // for debug
    ]),
  )
  .nonempty();
export type Continuations = z.infer<typeof continuationsSchema>;

export const liveChatContinuationSchema = z.object({
  liveChatContinuation: z.object({
    continuations: continuationsSchema,
    actions: actionsSchema.optional(),
  }),
});
export type LiveChatContinuationData = z.infer<
  typeof liveChatContinuationSchema.shape.liveChatContinuation
>;
export const getLiveChatApiResponseSchema = z.object({
  continuationContents: liveChatContinuationSchema,
});
export type GetLiveChatApiResponse = z.infer<typeof getLiveChatApiResponseSchema>;

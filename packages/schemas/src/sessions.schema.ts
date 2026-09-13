import z from "zod";

export const postSessionsSchema = z.object({
  request: z.object({
    body: z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
  }),
  response: z.object({
    body: z.object({ token: z.string() }),
  }),
});

export const getSessionsSchema = z.object({
  response: z.object({
    body: z
      .object({
        id: z.uuid(),
        ipAddress: z.string().nullable(),
        userAgent: z.string().nullable(),
        createdAt: z.coerce.date(),
        lastSyncBefore: z.coerce.date(),
      })
      .array(),
  }),
});

export type PostSessions = z.infer<typeof postSessionsSchema>;
export type GetSessions = z.infer<typeof getSessionsSchema>;

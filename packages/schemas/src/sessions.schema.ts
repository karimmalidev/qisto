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

export type PostSessions = z.infer<typeof postSessionsSchema>;

import { z } from "zod";

export const userValidator = z.object({
  email: z.string().email(),
  username: z.string(),
});

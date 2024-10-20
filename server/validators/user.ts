import { z } from "zod";

export const signUpValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  walletAddress: z.string(),
});

export const signInValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});
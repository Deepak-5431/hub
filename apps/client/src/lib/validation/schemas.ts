import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email('invalid email'),
  password: z.string().min(6,'password must have minimum 6 char')
});

export const registerSchema = z.object({
  email: z.email('invalid email'),
  password: z.string().min(6,'password must have minimum 6 char')
})
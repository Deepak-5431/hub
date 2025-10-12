import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email('invalid email'),
  password: z.string().min(6,'password must have minimum 6 char')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  //username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
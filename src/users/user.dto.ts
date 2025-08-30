import { z } from 'zod';




// Schema for an ADMIN to create a new user (like a COACH)
export const CreateUserDto = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
export const UpdateUserDto = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
}).refine(data => data.name || data.email, {
  message: "Either name or email must be provided for an update",
});

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;
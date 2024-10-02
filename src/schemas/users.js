import { z } from 'zod'

const newSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})

export const validateUser = (user) => {
  return newSchema.safeParse(user)
}

export const validatePartialUser = (user) => {
  return newSchema.partial().safeParse(user)
}

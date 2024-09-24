import { z } from 'zod'

const newSchema = z.object({
  title: z.string({
    required_error: 'Title is a required field.'
  }).min(3, 'Title must be at least 3 characters long')
})

export const validateProduct = (product) => {
  return newSchema.safeParse(product)
}

export const validatePartialProduct = (product) => {
  return newSchema.partial().safeParse(product)
}

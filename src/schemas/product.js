import { z } from 'zod'

const newSchema = z.object({
  sku: z.string().min(1, 'SKU is required and must be a non-empty string'),
  title: z.string({
    required_error: 'Title is a required field.'
  }).min(3, 'Title must be at least 3 characters long'),
  description: z.string({
    required_error: 'Description is a required field.'
  }).min(10, 'Description must be at least 10 characters long'),
  category_id: z.number().int().positive({
    message: 'Category ID must be a positive integer'
  }),
  brand_id: z.number().int().positive({
    message: 'Brand ID must be a positive integer'
  }),
  quantity: z.number().int().nonnegative({
    message: 'Quantity must be a non-negative integer'
  })
})

export const validateProduct = (product) => {
  return newSchema.safeParse(product)
}

export const validatePartialProduct = (product) => {
  return newSchema.partial().safeParse(product)
}

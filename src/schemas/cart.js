import { z } from 'zod'

const newSchema = z.object({
  user_email: z.string().email({
    message: 'Invalid email format.'
  }),
  product_id: z.number({
    required_error: 'Product ID is required.'
  }).positive('Product ID must be a positive number.'),
  quantity: z.number({
    required_error: 'Quantity is required.'
  }).int().positive('Quantity must be a positive integer.')
})

export const validateCart = (cart) => {
  return newSchema.safeParse(cart)
}

export const validatePartialCart = (cart) => {
  return newSchema.partial().safeParse(cart)
}

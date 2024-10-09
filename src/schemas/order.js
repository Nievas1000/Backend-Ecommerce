import { z } from 'zod'

const newSchema = z.object({
  user_email: z.string().email({ message: 'Invalid email address' }),
  status: z.string().min(3, { message: 'Status must be at least 3 characters long' }),
  total_price: z.number().positive({
    message: 'Price must be a positive number'
  }),
  payment_method_id: z.number().int().positive('Invalid payment method ID'),
  items: z.array(
    z.object({
      product_id: z.number().int().positive('Invalid product ID'),
      quantity: z.number().int().positive('Quantity must be a positive integer'),
      price: z.number().positive('Price must be a positive number')
    })
  ),
  shipping_address: z.object({
    street_address: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required')
  })
})

export const validateOrder = (order) => {
  return newSchema.safeParse(order)
}

export const validatePartialOrder = (order) => {
  return newSchema.partial().safeParse(order)
}

import { z } from 'zod'

const newSchema = z.object({
  order_id: z.number({
    required_error: 'Order ID is required.'
  }).int().positive('Order ID must be a positive integer.'),
  payment_method_id: z.number({
    required_error: 'Payment method ID is required.'
  }).int().positive('Payment method ID must be a positive integer.'),
  amount: z.number({
    required_error: 'Amount is required.'
  }).positive('Amount must be a positive number.')
})

export const validatePayment = (payment) => {
  return newSchema.safeParse(payment)
}

export const validatePartialPayment = (payment) => {
  return newSchema.partial().safeParse(payment)
}

import { z } from 'zod'

const newSchema = z.object({
  product_id: z.number({
    required_error: 'Product id is a required field.'
  }),
  stock: z.coerce.number().int().nonnegative({
    message: 'Quantity must be a non-negative integer'
  })
})

export const validateInventory = (inventory) => {
  return newSchema.safeParse(inventory)
}

export const validatePartialInventory = (inventory) => {
  return newSchema.partial().safeParse(inventory)
}

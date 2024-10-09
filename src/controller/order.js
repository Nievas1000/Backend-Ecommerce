import { OrderModel } from '../model/order.js'
import { validateOrder } from '../schemas/order.js'

export class OrderController {
  static async createOrder (req, res) {
    try {
      const result = validateOrder(req.body)

      if (!result.success) {
        return res.status(400).json({ message: result.error.errors })
      }

      const order = await OrderModel.createOrder(result.data)

      res.status(200).json({
        message: 'Order  created successfully',
        order
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while creating the order',
        error: error.message
      })
    }
  }
}

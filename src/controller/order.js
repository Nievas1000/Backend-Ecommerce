import { OrderModel } from '../model/order.js'
import { validateOrder, validatePartialOrder } from '../schemas/order.js'

export class OrderController {
  static async createOrder (req, res) {
    try {
      const result = validateOrder(req.body)

      if (!result.success) {
        return res.status(400).json({ message: result.error.errors })
      }

      const order = await OrderModel.createOrder(result.data)

      res.status(200).json({
        message: 'Order created successfully',
        data: order
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while creating the order',
        error: error.message
      })
    }
  }

  static async getAllOrders (req, res) {
    try {
      const orders = await OrderModel.getAllOrders()

      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' })
      }

      res.status(200).json({
        message: 'Orders retrieved successfully',
        data: orders
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve orders',
        error: error.message
      })
    }
  }

  static async getOrdersByEmail (req, res) {
    try {
      const { email } = req.body

      const orders = await OrderModel.getOrdersByEmail(email)

      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' })
      }

      res.status(200).json({
        message: 'Orders retrieved successfully',
        data: orders
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve orders by email',
        error: error.message
      })
    }
  }

  static async getOrderById (req, res) {
    try {
      const { id } = req.params

      const order = await OrderModel.getOrderById(id)

      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }

      res.status(200).json({
        message: 'Order retrieved successfully',
        data: order
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve the order',
        error: error.message
      })
    }
  }

  static async updateOrder (req, res) {
    try {
      const { id } = req.params
      const result = validatePartialOrder(req.body)

      if (!result.success) {
        return res.status(400).json({ message: result.error.errors })
      }

      const updatedOrder = await OrderModel.updateOrder(id, result.data)

      res.status(200).json({
        message: 'Order updated successfully',
        order: updatedOrder
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update order',
        error: error.message
      })
    }
  }

  static async deleteOrder (req, res) {
    try {
      const { id } = req.params

      const result = await OrderModel.deleteOrder(id)

      if (!result) {
        return res.status(404).json({ message: 'Order not found' })
      }

      res.status(200).json({ message: 'Order deleted successfully' })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete order',
        error: error.message
      })
    }
  }
}

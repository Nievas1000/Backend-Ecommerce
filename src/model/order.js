import db from '../utils/db.js'
import { InventoryModel } from './inventory.js'

export class OrderModel {
  static async createOrder (order) {
    try {
      for (const item of order.items) {
        const product = await InventoryModel.getInventoryByProduct(item.product_id)

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} does not exist`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for product with ID ${item.product_id}`)
        }

        await db.query(
          'UPDATE inventory SET stock = stock - ? WHERE product_id = ?',
          [item.quantity, item.product_id]
        )
      }

      const [orderResult] = await db.query(
        'INSERT INTO orders (user_email, status, total_price, payment_method_id, created_at, updated_at) VALUES (?,?,?,?,?,?)',
        [order.user_email, order.status, order.total_price, order.payment_method_id, new Date(), new Date()]
      )

      const orderId = orderResult.insertId

      for (const item of order.items) {
        await db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
          [orderId, item.product_id, item.quantity, item.price]
        )
      }

      await db.query(
        'INSERT INTO shipping_addresses (user_email, order_id, address_line1, city, postal_code, country) VALUES (?,?,?,?,?,?)',
        [order.user_email, orderId, order.shipping_address.street_address, order.shipping_address.city, order.shipping_address.postal_code, order.shipping_address.country]
      )

      return order
    } catch (error) {
      console.log(error)
      throw new Error('Failed to create order: ' + error.message)
    }
  }
}

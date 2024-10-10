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

  static async getAllOrders () {
    try {
      const [orders] = await db.query(`
        SELECT o.id AS order_id, o.user_email, o.total_price, o.status, o.payment_method_id, o.created_at,
               oi.product_id, oi.quantity, oi.price,
               s.address_line1, s.city, s.postal_code, s.country
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN shipping_addresses s ON o.id = s.order_id
        ORDER BY o.created_at DESC
      `)

      return orders
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve orders.')
    }
  }

  static async getOrdersByEmail (userEmail) {
    try {
      const [orders] = await db.query(`
        SELECT o.id AS order_id, o.user_email, o.total_price, o.status, o.payment_method_id, o.created_at,
               oi.product_id, oi.quantity, oi.price,
               s.address_line1, s.city, s.postal_code, s.country
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN shipping_addresses s ON o.id = s.order_id
        WHERE o.user_email = ?
        ORDER BY o.created_at DESC
      `, [userEmail])

      return orders
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve orders by email.')
    }
  }

  static async getOrderById (orderId) {
    try {
      const [order] = await db.query(`
        SELECT o.id AS order_id, o.user_email, o.total_price, o.status, o.payment_method_id, o.created_at,
               oi.product_id, oi.quantity, oi.price,
               s.address_line1, s.city, s.postal_code, s.country
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN shipping_addresses s ON o.id = s.order_id
        WHERE o.id = ?
      `, [orderId])

      if (order.length === 0) {
        return null
      }

      return order
    } catch (error) {
      throw new Error('Failed to retrieve the order: ' + error.message)
    }
  }

  static async updateOrder (id, order) {
    try {
      const updateFields = Object.keys(order)

      const setClause = updateFields.map(field => `${field} = ?`).join(', ')

      const values = Object.values(order)
      values.push(id)

      const query = `UPDATE orders SET ${setClause} WHERE id = ?`

      const [result] = await db.query(query, values)

      if (!result.affectedRows || result.affectedRows === 0) {
        throw new Error('Order not found or nothing to update')
      }

      return await this.getOrderById(id)
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async deleteOrder (orderId) {
    try {
      await db.query('DELETE FROM order_items WHERE order_id = ?', [orderId])

      await db.query('DELETE FROM shipping_addresses WHERE order_id = ?', [orderId])

      const [result] = await db.query('DELETE FROM orders WHERE id = ?', [orderId])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete order.')
    }
  }
}

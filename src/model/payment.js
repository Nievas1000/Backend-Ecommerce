import db from '../utils/db.js'

export class PaymentModel {
  static async createPaymentMethod (methodName) {
    try {
      const [result] = await db.query(
        'INSERT INTO payment_methods (method_name) VALUES (?)',
        [methodName]
      )
      if (result.affectedRows < 1) {
        return []
      }

      return methodName
    } catch (error) {
      console.log(error)
      throw new Error('Failed to create payment method.')
    }
  }

  static async getAllPaymentMethods () {
    try {
      const [paymentMethods] = await db.query('SELECT * FROM payment_methods')

      return paymentMethods
    } catch (error) {
      throw new Error('Failed to retrieve payment methods: ' + error.message)
    }
  }

  static async getPaymentMethod (id) {
    try {
      const [paymentMethod] = await db.query('SELECT * FROM payment_methods WHERE id = ?', [id])

      return paymentMethod.length > 0 ? paymentMethod[0] : null
    } catch (error) {
      throw new Error('Failed to retrieve payment method: ' + error.message)
    }
  }

  static async updatePaymentMethod (id, paymentData) {
    try {
      const [result] = await db.query(
        'UPDATE payment_methods SET method_name = ? WHERE id = ?',
        [paymentData.method_name, id]
      )

      return result.affectedRows > 0
    } catch (error) {
      throw new Error('Failed to update payment method: ' + error.message)
    }
  }

  static async deletePaymentMethod (id) {
    try {
      const [result] = await db.query('DELETE FROM payment_methods WHERE id = ?', [id])

      return result.affectedRows > 0
    } catch (error) {
      throw new Error('Failed to delete payment method: ' + error.message)
    }
  }

  static async createPayment (payment) {
    try {
      const [result] = await db.query(`
        INSERT INTO payments (order_id, payment_method_id, amount, payment_date) 
        VALUES (?, ?, ?, ?)
      `, [payment.order_id, payment.payment_method_id, payment.amount, new Date()])

      if (result.affectedRows === 0) {
        throw new Error('Failed to register payment')
      }

      return payment
    } catch (error) {
      console.log(error)
      throw new Error('Failed to register payment.')
    }
  }

  static async getPaymentsByOrder (orderId) {
    try {
      const [payments] = await db.query(`
        SELECT * FROM payments WHERE order_id = ?
      `, [orderId])

      return payments
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve payments for the order: ' + error.message)
    }
  }

  static async updatePayment (paymentId, paymentData) {
    try {
      const [result] = await db.query(`
        UPDATE payments
        SET payment_method_id = ?, amount = ?
        WHERE id = ?
      `, [paymentData.payment_method_id, paymentData.amount, paymentId])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to update the payment: ' + error.message)
    }
  }
}

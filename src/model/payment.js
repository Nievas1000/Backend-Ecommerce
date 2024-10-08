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
}

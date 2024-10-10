import { PaymentModel } from '../model/payment.js'
import { validatePartialPayment, validatePayment } from '../schemas/payment.js'

export class PaymentController {
  static async createPaymentMethod (req, res) {
    try {
      const paymentMethod = await PaymentModel.createPaymentMethod(req.body.method_name)

      res.status(201).json({ message: 'Payment method created successfully', data: paymentMethod })
    } catch (error) {
      res.status(500).json({ message: 'Failed to create payment method', error: error.message })
    }
  }

  static async getAllPaymentMethods (req, res) {
    try {
      const paymentMethods = await PaymentModel.getAllPaymentMethods()

      res.status(200).json(paymentMethods)
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve payment methods', error: error.message })
    }
  }

  static async getPaymentMethodBy (req, res) {
    try {
      const { id } = req.params

      const paymentMethod = await PaymentModel.getPaymentMethod(id)
      if (!paymentMethod) {
        return res.status(404).json({ message: 'Payment method not found' })
      }

      res.status(200).json({ message: 'Payment method retrivied successfully', data: paymentMethod })
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve payment method', error: error.message })
    }
  }

  static async updatePaymentMethod (req, res) {
    try {
      const { id } = req.params

      const updated = await PaymentModel.updatePaymentMethod(id, req.body)

      if (!updated) {
        return res.status(404).json({ message: 'Payment method not found' })
      }

      res.status(200).json({ message: 'Payment method updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to update payment method', error: error.message })
    }
  }

  static async deletePaymentMethod (req, res) {
    try {
      const { id } = req.params

      const deleted = await PaymentModel.deletePaymentMethod(id)

      if (!deleted) {
        return res.status(404).json({ message: 'Payment method not found' })
      }

      res.status(200).json({ message: 'Payment method deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete payment method', error: error.message })
    }
  }

  static async createPayment (req, res) {
    try {
      const result = validatePayment(req.body)

      if (!result.success) {
        return res.status(400).json({ message: result.error.errors })
      }

      const payment = await PaymentModel.createPayment(result.data)

      res.status(201).json({ message: 'Payment created successfully', data: payment })
    } catch (error) {
      res.status(500).json({ message: 'Failed to register payment', error: error.message })
    }
  }

  static async getPaymentsByOrder (req, res) {
    try {
      const { id } = req.params

      const payments = await PaymentModel.getPaymentsByOrder(id)

      if (!payments.length > 0) {
        return res.status(404).json({ message: 'No payments found for this order' })
      }

      res.status(200).json({ message: 'Payments retrivied successfully', data: payments })
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve payments', error: error.message })
    }
  }

  static async updatePayment (req, res) {
    try {
      const { id } = req.params
      const result = validatePartialPayment(req.body)

      if (!result.success) {
        return res.status(400).json({ message: result.error.errors })
      }

      const updatedPayment = await PaymentModel.updatePayment(id, result.data)

      if (!updatedPayment) {
        return res.status(404).json({ message: 'Payment not found or nothing to update' })
      }

      res.status(200).json({ message: 'Payment updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to update payment', error: error.message })
    }
  }
}

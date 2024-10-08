import { PaymentModel } from '../model/payment.js'

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
}

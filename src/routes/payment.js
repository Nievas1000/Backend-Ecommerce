import express from 'express'
import { PaymentController } from '../controller/payment.js'

const router = express.Router()

router.post('/', PaymentController.createPayment)
router.get('/:id', PaymentController.getPaymentsByOrder)
router.put('/:id', PaymentController.updatePayment)
router.get('/method', PaymentController.getAllPaymentMethods)
router.post('/method', PaymentController.createPaymentMethod)
router.get('/method/:id', PaymentController.getPaymentMethodBy)
router.put('/method/:id', PaymentController.updatePaymentMethod)
router.delete('/method/:id', PaymentController.deletePaymentMethod)

export default router

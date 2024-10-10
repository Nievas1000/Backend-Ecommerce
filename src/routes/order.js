import express from 'express'
import { OrderController } from '../controller/order.js'

const router = express.Router()

router.post('/', OrderController.createOrder)
router.get('/', OrderController.getAllOrders)
router.post('/user', OrderController.getOrdersByEmail)
router.get('/:id', OrderController.getOrderById)
router.put('/:id', OrderController.updateOrder)
router.delete('/:id', OrderController.deleteOrder)

export default router

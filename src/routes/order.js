import express from 'express'
import { OrderController } from '../controller/order.js'

const router = express.Router()

router.post('/', OrderController.createOrder)

export default router

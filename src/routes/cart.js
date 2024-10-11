import express from 'express'
import { CartController } from '../controller/cart.js'

const router = express.Router()

router.post('/', CartController.addItemToCart)
router.post('/user', CartController.getCartByUser)
router.put('/', CartController.updateItemQuantity)
router.delete('/', CartController.removeItemFromCart)
router.post('/clear', CartController.clearCart)

export default router

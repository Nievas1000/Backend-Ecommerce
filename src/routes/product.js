import express from 'express'
import { ProductController } from '../controller/product.js'

const router = express.Router()

router.post('/', ProductController.createProduct)
router.get('/:id', ProductController.getProduct)
router.get('/category/:id', ProductController.getProductsByCategory)
router.get('/brand/:id', ProductController.getProductsByBrand)

export default router

import express from 'express'
import { ProductController } from '../controller/product.js'

const router = express.Router()

router.post('/', ProductController.createProduct)
router.get('/:id', ProductController.getProduct)
router.get('/category/:id', ProductController.getProductsByCategory)
router.post('/category', ProductController.saveCategory)
router.get('/brand/:id', ProductController.getProductsByBrand)
router.post('/brand', ProductController.saveBrand)

export default router

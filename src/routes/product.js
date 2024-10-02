import express from 'express'
import { ProductController } from '../controller/product.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }
}).single('image')

router.get('/search', ProductController.searchProduct)
router.post('/', upload, ProductController.createProduct)
router.get('/:id', ProductController.getProduct)
router.get('/category/:id', ProductController.getProductsByCategory)
router.get('/brand/:id', ProductController.getProductsByBrand)
router.put('/:id', ProductController.updateProduct)
router.put('/image/:id', upload, ProductController.updateProductImage)

export default router

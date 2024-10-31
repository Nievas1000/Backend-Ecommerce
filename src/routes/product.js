import express from 'express'
import { ProductController } from '../controller/product.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    fieldSize: 1024 * 1024 * 20,
    files: 10
  }
}).array('images', 6)

router.post('/', upload, ProductController.createProduct)
router.get('/search', ProductController.searchProduct)
router.get('/:id', ProductController.getProduct)
router.get('/category/:id', ProductController.getProductsByCategory)
router.get('/brand/:id', ProductController.getProductsByBrand)
router.put('/:id', ProductController.updateProduct)
router.put('/image/:id', upload, ProductController.updateProductImage)
router.delete('/:id', ProductController.deleteProduct)

export default router

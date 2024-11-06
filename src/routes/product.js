import express from 'express'
import { ProductController } from '../controller/product.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()

const uploadMultilple = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    fieldSize: 1024 * 1024 * 20,
    files: 10
  }
}).array('images', 6)

const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    fieldSize: 1024 * 1024 * 20,
    files: 10
  }
}).single('image')

router.post('/', uploadMultilple, ProductController.createProduct)
router.get('/', ProductController.getAllProducts)
router.get('/search', ProductController.searchProduct)
router.get('/:id', ProductController.getProduct)
router.get('/category/:id', ProductController.getProductsByCategory)
router.get('/brand/:id', ProductController.getProductsByBrand)
router.put('/:id', ProductController.updateProduct)
router.put('/image/:id', uploadSingle, ProductController.updateProductImage)
router.post('/image/:id', uploadSingle, ProductController.addProductImage);
router.delete('/:id', ProductController.deleteProduct)
router.delete('/image/:id', ProductController.deleteProductImage);

export default router

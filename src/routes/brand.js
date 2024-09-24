import express from 'express'
import { BrandController } from '../controller/brand.js'

const router = express.Router()

router.post('/', BrandController.saveBrand)
router.get('/', BrandController.getAllBrands)
router.get('/:id', BrandController.getBrand)

export default router

import express from 'express'
import { CategoryController } from '../controller/category.js'

const router = express.Router()

router.get('/', CategoryController.getAllCategories)
router.post('/', CategoryController.saveCategory)
router.get('/:id', CategoryController.getCategory)
router.delete('/:id', CategoryController.deleteCategory)

export default router

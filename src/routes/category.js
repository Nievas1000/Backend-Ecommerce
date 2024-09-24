import express from 'express'
import { CategoryController } from '../controller/category.js'

const router = express.Router()

router.post('/', CategoryController.saveCategory)

export default router

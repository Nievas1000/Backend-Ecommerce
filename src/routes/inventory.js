import express from 'express'
import { InventoryController } from '../controller/inventory.js'

const router = express.Router()

router.post('/', InventoryController.createInventory)
router.get('/', InventoryController.getAllInventory)
router.get('/sizes', InventoryController.getSizes)
router.get('/:id', InventoryController.getInventoryByProduct)
router.put('/:id', InventoryController.updateStock)

export default router

import { InventoryModel } from '../model/inventory.js'
import { validateInventory, validatePartialInventory } from '../schemas/inventory.js'

export class InventoryController {
  static async createInventory(req, res) {
    try {
      const result = validateInventory(req.body)

      if (!result.success) {
        return res.status(400).json({ error: result.error.errors })
      }

      const inventory = await InventoryModel.createInventory(req.body)

      if (inventory.length > 0) {
        return res.status(404).json({
          message: 'It was not possible to create the inventory'
        })
      }

      res.status(200).json({
        message: 'Inventory was created succesfully',
        data: inventory
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while creating the inventory',
        error: error.message
      })
    }
  }

  static async getAllInventory(req, res) {
    try {
      const inventory = await InventoryModel.getAllInventory()

      if (inventory.length === 0) {
        return res.status(404).json({ message: 'No inventory found' })
      }

      res.status(200).json({
        message: 'All Inventory was retrieving succesfully',
        data: inventory
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the inventory',
        error: error.message
      })
    }
  }

  static async getInventoryByProduct(req, res) {
    try {
      const { id } = req.params

      const inventory = await InventoryModel.getInventoryByProduct(id)

      if (!inventory) {
        return res.status(404).json({ message: 'No inventory found for the specified product' })
      }

      res.status(200).json({
        message: 'Inventory was retrieving succesfully',
        data: inventory
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the inventory',
        error: error.message
      })
    }
  }

  static async updateStock(req, res) {
    try {
      const { id } = req.params
      const result = validatePartialInventory(req.body)

      if (!result.success) {
        return res.status(400).json({ error: result.error.errors })
      }

      const inventory = await InventoryModel.updateStock(id, req.body.stock)

      if (!inventory) {
        return res.status(404).json({ message: 'Product not found or stock not updated' })
      }

      res.status(200).json({ message: 'Stock updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the stock', error: error.message })
    }
  }

  static async getSizes(req, res) {
    try {
      const sizes = await InventoryModel.getSizes()

      if (sizes.length === 0) {
        return res.status(404).json({
          message: 'No sizes available'
        })
      }

      res.status(200).json({
        message: 'Sizes retrieved successfully',
        data: sizes
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the sizes',
        error: error.message
      })
    }
  }
}

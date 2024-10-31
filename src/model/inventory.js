import db from '../utils/db.js'

export class InventoryModel {
  static async getInventoryByProduct(productId) {
    try {
      const [inventory] = await db.query('SELECT * FROM inventory WHERE product_id = ?', [productId])

      return inventory.length > 0 ? inventory[0] : null
    } catch (error) {
      throw new Error('Failed to retrieve that inventory. Please try again later.')
    }
  }

  static async createInventory(inventory) {
    try {
      const inventoryExist = await this.getInventoryByProduct(inventory.product_id)

      if (inventoryExist) {
        throw new Error('Inventory already exist.')
      }

      const [result] = await db.query('INSERT INTO inventory (product_id, stock, size_id) VALUES (?,?,?)', [inventory.product_id, inventory.stock, inventory.size_id])

      if (result.affectedRows < 1) {
        return []
      }

      return inventory
    } catch (error) {
      console.log(error)
      throw new Error('Failed to create the inventory. Please try again later.')
    }
  }

  static async getAllInventory() {
    try {
      const [inventory] = await db.query('SELECT * FROM inventory')

      return inventory
    } catch (error) {
      throw new Error('Failed to retrieve inventory: ' + error.message)
    }
  }

  static async updateStock(productId, stock) {
    try {
      const [result] = await db.query('UPDATE inventory SET stock = ? WHERE product_id = ?', [stock, productId])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to update stock.')
    }
  }

  static async deleteInventory(productId) {
    try {
      const [result] = await db.query('DELETE FROM inventory WHERE product_id = ?', [productId])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete inventory.')
    }
  }

  static async getSizes() {
    try {
      const [sizes] = await db.query('SELECT * FROM sizes')

      if (!sizes || sizes.length === 0) {
        return []
      }

      return sizes
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

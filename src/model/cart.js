import db from '../utils/db.js'

export class CartModel {
  static async addItemToCart (cart) {
    try {
      const [existingItem] = await db.query(`
            SELECT * FROM cart WHERE user_email = ? AND product_id = ?
          `, [cart.user_email, cart.product_id])

      if (existingItem.length > 0) {
        const newQuantity = existingItem[0].quantity + cart.quantity

        const [result] = await db.query('UPDATE cart SET quantity = ? WHERE user_email = ? AND product_id = ?', [newQuantity, cart.user_email, cart.product_id])

        return result.affectedRows > 0
      } else {
        const [result] = await db.query('INSERT INTO cart (user_email, product_id, quantity, created_At) VALUES (?, ?, ?, ?)', [cart.user_email, cart.product_id, cart.quantity, new Date()])

        return result.affectedRows > 0
      }
    } catch (error) {
      console.log(error)
      throw new Error('Failed to add item to cart.')
    }
  }

  static async getCartByUser (userEmail) {
    try {
      const [cart] = await db.query(`
        SELECT c.product_id, p.title, p.price, c.quantity 
        FROM cart c
        JOIN product p ON c.product_id = p.id
        WHERE c.user_email = ?
      `, [userEmail])

      return cart
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve cart: ' + error.message)
    }
  }

  static async updateItemQuantity (cart) {
    try {
      const [result] = await db.query(`
        UPDATE cart 
        SET quantity = ?
        WHERE user_email = ? AND product_id = ?
      `, [cart.quantity, cart.user_email, cart.product_id])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to update cart item.')
    }
  }

  static async removeItemFromCart (cart) {
    try {
      const [result] = await db.query(`
        DELETE FROM cart 
        WHERE user_email = ? AND product_id = ?
      `, [cart.user_email, cart.product_id])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to remove item from cart.')
    }
  }

  static async clearCart (userEmail) {
    try {
      const [result] = await db.query(`
        DELETE FROM cart WHERE user_email = ?
      `, [userEmail])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to clear cart: ' + error.message)
    }
  }
}

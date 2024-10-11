import { CartModel } from '../model/cart.js'
import { validateCart, validatePartialCart } from '../schemas/cart.js'

export class CartController {
  static async addItemToCart (req, res) {
    try {
      const result = validateCart(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const created = await CartModel.addItemToCart(result.data)

      if (!created) {
        return res.status(404).json({ message: 'It was not possible to add the item to the cart' })
      }

      res.status(201).json({ message: 'Item added successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to add item to cart', error: error.message })
    }
  }

  static async getCartByUser (req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { user_email } = req.body

      const cart = await CartModel.getCartByUser(user_email)

      if (!cart.length) {
        return res.status(404).json({ message: 'Cart is empty' })
      }

      res.status(200).json({
        message: 'Cart retrieved succesfully',
        data: cart
      })
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve cart', error: error.message })
    }
  }

  static async updateItemQuantity (req, res) {
    try {
      const result = validateCart(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const updatedCart = await CartModel.updateItemQuantity(result.data)

      if (!updatedCart) {
        return res.status(404).json({ message: 'Cart  not found' })
      }

      res.status(200).json({ message: 'Cart updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to update cart item', error: error.message })
    }
  }

  static async removeItemFromCart (req, res) {
    try {
      const result = validatePartialCart(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const deleted = await CartModel.removeItemFromCart(result.data)

      if (!deleted) {
        return res.status(404).json({ message: 'Item not found' })
      }

      res.status(200).json({ message: 'Item deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove item from cart', error: error.message })
    }
  }

  static async clearCart (req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { user_email } = req.body

      const isClear = await CartModel.clearCart(user_email)

      if (!isClear) {
        return res.status(404).json({ message: 'Cart not found' })
      }

      res.status(200).json({ message: 'Cart cleared successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to clear cart', error: error.message })
    }
  }
}

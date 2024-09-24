import { ProductModel } from '../model/product.js'
import { validateProduct } from '../schemas/product.js'

export class ProductController {
  static async createProduct (req, res) {
    try {
      const result = validateProduct(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const product = await ProductModel.createProduct(result.data)
      if (product.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to save the product'
        })
      }

      res.status(200).json({
        message: 'Product saved successfully',
        product
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while saving the product',
        error: error.message
      })
    }
  }

  static async getProduct (req, res) {
    try {
      const { id } = req.params
      const product = await ProductModel.getProduct(id)

      if (!product || product.length === 0) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }

      res.status(200).json({
        message: 'Product retrieved succesfully',
        data: product
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the product',
        error: error.message
      })
    }
  }

  static async getProductsByCategory (req, res) {
    try {
      const { id } = req.params
      const products = await ProductModel.getProductsByCategory(id)

      if (products.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to retrieved the products'
        })
      }

      res.status(200).json({
        message: 'Products retrieved succesfully',
        data: products
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the category',
        error: error.message
      })
    }
  }

  static async getProductsByBrand (req, res) {
    try {
      const { id } = req.params
      const products = await ProductModel.getProductsByBrand(id)

      if (products.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to retrieved the products'
        })
      }

      res.status(200).json({
        message: 'Products retrieved succesfully',
        data: products
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the brand',
        error: error.message
      })
    }
  }
}

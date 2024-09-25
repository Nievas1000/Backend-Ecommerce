import { ProductModel } from '../model/product.js'
import { validatePartialProduct, validateProduct } from '../schemas/product.js'
import { upload } from '../utils/imageHelper.js'

export class ProductController {
  // TODO: Validaciones con zod, ya que con formdata recibimos todos strings
  static async createProduct (req, res) {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message })
      }

      try {
        const result = validateProduct(req.body)
        console.log(result)

        if (!result.success) {
          return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
        const productData = {
          ...result.data,
          image_url: imageUrl
        }

        const product = await ProductModel.createProduct(productData)

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
    })
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

  static async updateProduct (req, res) {
    try {
      const { id } = req.params
      const result = validatePartialProduct(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const news = await ProductModel.updateProduct(id, result.data)

      if (news.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to update the product'
        })
      }

      res.status(200).json({
        message: 'Product updated successfully',
        news
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while updating the product',
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

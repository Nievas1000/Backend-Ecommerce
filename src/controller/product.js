import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { ProductModel } from '../model/product.js'
import { validatePartialProduct, validateProduct } from '../schemas/product.js'
import { fileURLToPath } from 'url'
dotenv.config()

export const __filename = fileURLToPath(import.meta.url)
export const __customDirname = path.dirname(__filename)

export class ProductController {
  static async createProduct (req, res) {
    try {
      const result = validateProduct(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const filename = Date.now() + '-' + req.file.originalname

      const productData = {
        ...result.data,
        image_url: filename
      }
      const product = await ProductModel.createProduct(productData)

      if (product.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to save the product'
        })
      }

      const filepath = path.join(__customDirname, '../uploads', filename)

      fs.writeFile(filepath, req.file.buffer, (err) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to save the image',
            error: err.message
          })
        }
      })

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

  static async updateProduct (req, res) {
    try {
      const { id } = req.params
      const result = validatePartialProduct(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const product = await ProductModel.updateProduct(id, result.data)

      if (product.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to update the product'
        })
      }

      res.status(200).json({
        message: 'Product updated successfully',
        product
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while updating the product',
        error: error.message
      })
    }
  }

  static async deleteProduct (req, res) {
    try {
      const token = req.cookies.session_token

      if (!token) {
        return res.status(400).json({ error: 'Access denied.' })
      }

      jwt.verify(token, process.env.JWT_SECRET)

      const product = await ProductModel.getProduct(req.params.id)

      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      await ProductModel.deleteProduct(req.params.id)

      res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid or expired token' })
      }
      res.status(500).json({ message: 'An error occurred while deleting the product', error: error.message })
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

  static async updateProductImage (req, res) {
    try {
      const { id } = req.params

      if (!req.file) {
        return res.status(400).json({
          message: 'No image file provided'
        })
      }

      const product = await ProductModel.getProduct(id)

      if (product.length === 0) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }

      const oldImageUrl = product[0].image_url

      if (oldImageUrl) {
        const oldImagePath = path.join(__customDirname, '../uploads', oldImageUrl)
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(`Failed to delete old image: ${err.message}`)
          }
        })
      }

      const filename = Date.now() + '-' + req.file.originalname
      const filepath = path.join(__customDirname, '../uploads', filename)

      fs.writeFile(filepath, req.file.buffer, async (err) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to save the image',
            error: err.message
          })
        }

        const imageUrl = filename
        const updatedProduct = await ProductModel.updateImage(id, imageUrl)

        if (updatedProduct.length === 0) {
          return res.status(404).json({
            message: 'Product not found or could not be updated'
          })
        }

        res.status(200).json({
          message: 'Product image updated successfully',
          product: updatedProduct
        })
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while updating the product image',
        error: error.message
      })
    }
  }

  static async searchProduct (req, res) {
    try {
      const { q } = req.query

      if (!q) {
        return res.status(400).json({ message: 'Search query is required' })
      }

      const products = await ProductModel.searchProduct(q)

      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found matching the search query' })
      }

      res.status(200).json({
        message: 'Products was retrieved successfully',
        product: products
      })
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while searching for products' })
    }
  }
}

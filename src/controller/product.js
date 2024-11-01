import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { ProductModel } from '../model/product.js'
import { validatePartialProduct, validateProduct } from '../schemas/product.js'
import { fileURLToPath } from 'url'
import { promisify } from 'util'
const writeFileAsync = promisify(fs.writeFile)
dotenv.config()

export const __filename = fileURLToPath(import.meta.url)
export const __customDirname = path.dirname(__filename)

export class ProductController {
  static async createProduct(req, res) {
    try {
      const result = validateProduct(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const filenames = req.files.map((file) => Date.now() + '-' + file.originalname)
      const productData = {
        ...result.data,
        images: filenames
      }

      const product = await ProductModel.createProduct(productData)

      if (product.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to save the product'
        })
      }

      const imageSavePromises = req.files.map((file, index) => {
        const filepath = path.join(__customDirname, '../uploads', filenames[index])
        return writeFileAsync(filepath, file.buffer)
      })

      await Promise.all(imageSavePromises)

      res.status(200).json({
        message: 'Product saved successfully with images',
        product
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while saving the product',
        error: error.message
      })
    }
  }

  static async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getAllProducts()

      if (products.length === 0) {
        return res.status(404).json({
          message: 'No products found'
        })
      }

      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`
      const productsWithFullImageUrls = products.map((product) => ({
        ...product,
        images: product.images.map((image) => `${baseUrl}${image}`)
      }))

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: productsWithFullImageUrls
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving products',
        error: error.message
      })
    }
  }

  static async getProduct(req, res) {
    try {
      const { id } = req.params
      const product = await ProductModel.getProduct(id)

      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }

      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`

      const productWithFullImageUrls = {
        ...product,
        images: product.images.map(image => ({
          id: image.id,
          url: `${baseUrl}${image.url}`
        }))
      }

      res.status(200).json({
        message: 'Product retrieved successfully',
        data: productWithFullImageUrls
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'An error occurred while retrieving the product',
        error: error.message
      })
    }
  }

  static async updateProduct(req, res) {
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

  static async deleteProduct(req, res) {
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

  static async getProductsByCategory(req, res) {
    try {
      const { id } = req.params
      const products = await ProductModel.getProductsByCategory(id)

      if (products.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to retrieve the products'
        })
      }

      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`
      const productsWithFullImageUrls = products.map((product) => ({
        ...product,
        images: product.images.map((image) => `${baseUrl}${image}`)
      }))

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: productsWithFullImageUrls
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the category',
        error: error.message
      })
    }
  }

  static async getProductsByBrand(req, res) {
    try {
      const { id } = req.params
      const products = await ProductModel.getProductsByBrand(id)

      if (products.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to retrieve the products'
        })
      }

      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`
      const productsWithFullImageUrls = products.map((product) => ({
        ...product,
        images: product.images.map((image) => `${baseUrl}${image}`)
      }))

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: productsWithFullImageUrls
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the brand',
        error: error.message
      })
    }
  }

  static async updateProductImage(req, res) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          message: 'No image file provided'
        });
      }

      const currentImage = await ProductModel.getProductImageById(id);
      if (!currentImage) {
        return res.status(404).json({
          message: 'Product or image not found'
        });
      }

      const oldImageUrl = currentImage.image_url;
      if (oldImageUrl) {
        const oldImagePath = path.join(__customDirname, '../uploads', path.basename(oldImageUrl));
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(`Failed to delete old image: ${err.message}`);
          }
        });
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(__customDirname, '../uploads', filename);

      fs.writeFile(filepath, req.file.buffer, async (err) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to save the image',
            error: err.message
          });
        }

        // 4. Update the image URL in the database
        const imageUrl = filename;
        const updatedImage = await ProductModel.updateImage(id, imageUrl);

        res.status(200).json({
          message: 'Product image updated successfully',
          image: updatedImage
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while updating the product image',
        error: error.message
      })
    }
  }

  static async searchProduct(req, res) {
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

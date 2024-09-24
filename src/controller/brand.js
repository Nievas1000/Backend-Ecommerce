import { BrandModel } from '../model/brand.js'
import { validateProduct } from '../schemas/category.js'

export class BrandController {
  static async getAllBrands (req, res) {
    try {
      const brands = await BrandModel.getAllBrands()

      if (brands.length === 0) {
        return res.status(404).json({
          message: 'No brands available'
        })
      }

      res.status(200).json({
        message: 'Brands retrieved successfully',
        brands
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the brands',
        error: error.message
      })
    }
  }

  static async getBrand (req, res) {
    try {
      const { id } = req.params
      const brand = await BrandModel.getBrand(id)

      if (!brand || Object.keys(brand).length === 0) {
        return res.status(404).json({
          message: 'Brand not found'
        })
      }

      res.status(200).json({
        message: 'Brand retrieved successfully',
        brand
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the brand',
        error: error.message
      })
    }
  }

  static async saveBrand (req, res) {
    try {
      const result = validateProduct(req.body)
      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const brand = await BrandModel.saveBrand(result.data.title)

      if (brand.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to save the brand'
        })
      }

      res.status(200).json({
        message: 'Brand saved successfully',
        brand
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while saving the brand',
        error: error.message
      })
    }
  }
}

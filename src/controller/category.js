import { CategoryModel } from '../model/category.js'
import { validateCategory } from '../schemas/category.js'

export class CategoryController {
  static async getAllBrands (req, res) {
    try {
      const brands = await CategoryModel.getAllCategories()

      if (brands.length === 0) {
        return res.status(404).json({
          message: 'No categories available'
        })
      }

      res.status(200).json({
        message: 'Categories retrieved successfully',
        brands
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the categories',
        error: error.message
      })
    }
  }

  static async getCategory (req, res) {
    try {
      const { id } = req.params
      const category = await CategoryModel.getCategory(id)

      if (!category || Object.keys(category).length === 0) {
        return res.status(404).json({
          message: 'Category not found'
        })
      }

      res.status(200).json({
        message: 'Category retrieved successfully',
        category
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the category',
        error: error.message
      })
    }
  }

  static async saveCategory (req, res) {
    try {
      const result = validateCategory(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
      const category = await CategoryModel.saveCategory(result.data.title)

      if (category.length === 0) {
        return res.status(404).json({
          message: 'It was not possible to save the category'
        })
      }

      res.status(200).json({
        message: 'Category saved successfully',
        category
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while saving the category',
        error: error.message
      })
    }
  }

  static async deleteCategory (req, res) {
    try {
      const { id } = req.params

      const result = await CategoryModel.deleteCategory(id)

      if (!result) {
        return res.status(404).json({
          message: 'It was not possible to delete the category'
        })
      }

      res.status(200).json({
        message: 'Category deleted successfully'
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while deleting the category',
        error: error.message
      })
    }
  }
}

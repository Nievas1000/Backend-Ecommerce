import { CategoryModel } from '../model/category.js'

export class CategoryController {
  static async saveCategory (req, res) {
    try {
      const { title } = req.body
      const category = await CategoryModel.saveCategory(title)

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
}

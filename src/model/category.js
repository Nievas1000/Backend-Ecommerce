import db from '../utils/db.js'
import { ProductModel } from './product.js'

export class CategoryModel {
  static async getAllCategories () {
    try {
      const [categories] = await db.query('SELECT * FROM category')

      if (!categories || categories.length === 0) {
        return []
      }

      return categories
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async getCategory (id) {
    try {
      const [category] = await db.query('SELECT * FROM category WHERE id = ?', [id])

      if (!category || category.length === 0) {
        return []
      }

      return category[0]
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve that category. Please try again later.')
    }
  }

  static async saveCategory (title) {
    try {
      const [categoryExist] = await db.query('SELECT * FROM category WHERE title = ?', [title])

      if (categoryExist && categoryExist.length > 0) {
        throw new Error('Category already exist.')
      }

      const [result] = await db.query('INSERT INTO category (title) VALUES (?)', title)

      if (result.affectedRows < 1) {
        return []
      }

      return title
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async deleteCategory (id) {
    try {
      const products = await ProductModel.getProductsByCategory(id)

      if (products.length > 0) {
        throw new Error('Cannot delete category. There are products associated with this category.')
      }

      const [result] = await db.query('DELETE FROM category WHERE id = ?', [id])

      if (result.affectedRows === 0) {
        throw new Error('category not found or already deleted.')
      }

      return true
    } catch (error) {
      console.error(error)
      throw new Error(error.message || 'Failed to delete category. Please try again later.')
    }
  }
}

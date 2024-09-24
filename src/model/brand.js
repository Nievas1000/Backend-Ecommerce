import db from '../utils/db.js'

export class BrandModel {
  static async getAllBrands () {
    try {
      const [brands] = await db.query('SELECT * FROM brand')

      if (!brands || brands.length === 0) {
        return []
      }

      return brands
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async getBrand (id) {
    try {
      const [brand] = await db.query('SELECT * FROM brand WHERE id = ?', [id])

      if (!brand || brand.length === 0) {
        return []
      }

      return brand[0]
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve that brand. Please try again later.')
    }
  }

  static async saveBrand (title) {
    try {
      const [brandExist] = await db.query('SELECT * FROM brand WHERE title = ?', [title])

      if (brandExist && brandExist.length > 0) {
        throw new Error('Category already exist.')
      }

      const [result] = await db.query('INSERT INTO brand (title) VALUES (?)', title)

      if (result.affectedRows < 1) {
        return []
      }

      return title
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

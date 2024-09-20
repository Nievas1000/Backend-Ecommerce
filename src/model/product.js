import db from '../utils/db.js'

export class ProductModel {
  static async createProduct (product) {
    try {
      const [existingSku] = await db.query('SELECT sku FROM product WHERE sku = ?', [product.sku])
      if (existingSku.length > 0) {
        throw new Error('A product with this SKU already exists.')
      }

      const [existingTitle] = await db.query('SELECT title FROM product WHERE title = ?', [product.title])
      if (existingTitle.length > 0) {
        throw new Error('A product with this title already exists.')
      }

      const [result] = await db.query('INSERT INTO product (sku, title, description, category_id, brand_id, quantity) VALUES (?,?,?,?,?,?)', [product.sku, product.title, product.description, product.category_id, product.brand_id, product.quantity])

      if (result.affectedRows < 1) {
        return []
      }
      return product
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async getProduct (id) {
    try {
      const [product] = await db.query('SELECT * FROM product WHERE id = ?', [id])

      if (!product || product.length === 0) {
        return []
      }

      return product
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve that product. Please try again later.')
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

      // Si la categoría existe, retornamos true
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

  static async getProductsByCategory (id) {
    try {
      const category = await this.getCategory(id)

      if (!category.id) {
        throw new Error('Category does not exist.')
      }

      const [products] = await db.query('SELECT * FROM product WHERE category_id = ?', [id])

      if (!products || products.length === 0) {
        return []
      }

      return products
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

      // Si la categoría existe, retornamos true
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

  static async getProductsByBrand (id) {
    try {
      const brand = await this.getBrand(id)

      if (!brand.id) {
        throw new Error('Brand does not exist.')
      }

      const [products] = await db.query('SELECT * FROM product WHERE category_id = ?', [id])

      if (!products || products.length === 0) {
        return []
      }

      return products
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

import db from '../utils/db.js'
import { BrandModel } from './brand.js'
import { CategoryModel } from './category.js'
import { InventoryModel } from './inventory.js'

export class ProductModel {
  static async createProduct(product) {
    try {
      const [existingSku] = await db.query('SELECT sku FROM product WHERE sku = ?', [product.sku])
      if (existingSku.length > 0) {
        throw new Error('A product with this SKU already exists.')
      }

      const [existingTitle] = await db.query('SELECT title FROM product WHERE title = ?', [product.title])
      if (existingTitle.length > 0) {
        throw new Error('A product with this title already exists.')
      }

      const [resultProduct] = await db.query(
        'INSERT INTO product (sku, title, description, category_id, brand_id, price) VALUES (?,?,?,?,?,?)',
        [product.sku, product.title, product.description, product.category_id, product.brand_id, product.price]
      )

      const productId = resultProduct.insertId

      const imageInsertPromises = product.images.map((image) => {
        return db.query('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [productId, image])
      })

      await Promise.all(imageInsertPromises)

      const resultInventory = await InventoryModel.createInventory({
        product_id: productId,
        size_id: product.size_id,
        stock: product.quantity
      })

      if (resultProduct.affectedRows < 1 || !resultInventory) {
        return []
      }

      return { productId, ...product }
    } catch (error) {
      console.log(error)
      throw new Error('Failed to save the product. Please try again later.')
    }
  }

  static async getAllProducts() {
    try {
      const [products] = await db.query('SELECT * FROM product')

      if (!products || products.length === 0) {
        return []
      }

      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await this.getProductImages(product.id)
          return {
            ...product,
            images
          }
        })
      )

      return productsWithImages
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve products. Please try again later.')
    }
  }

  static async getProduct(id) {
    try {
      const [result] = await db.query(`
        SELECT 
          p.*,
          SUM(i.stock) AS stock,
          (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pi.id, 'url', pi.image_url))
            FROM product_images pi
            WHERE pi.product_id = p.id
          ) AS images,
          (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('inventory_id', i.id, 'size_id', s.id, 'size_name', s.size_name, 'stock', i.stock))
            FROM inventory i
            LEFT JOIN sizes s ON i.size_id = s.id
            WHERE i.product_id = p.id
          ) AS sizes
        FROM product p
        LEFT JOIN inventory i ON p.id = i.product_id
        WHERE p.id = ?
        GROUP BY p.id
      `, [id])

      if (!result || result.length === 0) {
        return null
      }
      const product = result[0]
      return product
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve that product. Please try again later.')
    }
  }

  static async updateProduct(id, product) {
    try {
      const updateFields = Object.keys(product)

      const setClause = updateFields.map(field => `${field} = ?`).join(', ')

      const values = Object.values(product)
      values.push(id)

      const query = `UPDATE product SET ${setClause} WHERE id = ?`

      const [result] = await db.query(query, values)

      if (!result.affectedRows || result.affectedRows === 0) {
        throw new Error('Product not found or nothing to update')
      }

      return await this.getProduct(id)
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async deleteProduct(id) {
    try {
      const deleteInventoryResult = await InventoryModel.deleteInventory(id)

      if (!deleteInventoryResult) {
        throw new Error('Failed to delete inventory for the specified product')
      }

      const [result] = await db.query('DELETE FROM product WHERE id = ?', [id])

      return result.affectedRows > 0
    } catch (error) {
      throw new Error('Failed to delete product.')
    }
  }

  static async getProductsByCategory(id) {
    try {
      const category = await CategoryModel.getCategory(id)
      if (!category.id) {
        throw new Error('Category does not exist.')
      }

      const [products] = await db.query('SELECT * FROM product WHERE category_id = ?', [id])
      if (!products || products.length === 0) {
        return []
      }

      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await this.getProductImages(product.id)
          return {
            ...product,
            images
          }
        })
      )

      return productsWithImages
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async getProductsByBrand(id) {
    try {
      const brand = await BrandModel.getBrand(id)
      if (!brand.id) {
        throw new Error('Brand does not exist.')
      }

      const [products] = await db.query('SELECT * FROM product WHERE brand_id = ?', [id])
      if (!products || products.length === 0) {
        return []
      }

      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await this.getProductImages(product.id)
          return {
            ...product,
            images
          }
        })
      )

      return productsWithImages
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async getProductImageById(imageId) {
    try {
      const query = `
        SELECT image_url
        FROM product_images
        WHERE id = ?
      `;
      const [rows] = await db.query(query, [imageId]);

      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error retrieving image: ${error.message}`);
    }
  }

  static async updateImage(imageId, newImageUrl) {
    try {
      const query = `
        UPDATE product_images
        SET image_url = ?
        WHERE id = ?
      `;
      const [result] = await db.query(query, [newImageUrl, imageId]);

      if (result.affectedRows === 0) {
        throw new Error('Image not found');
      }

      return {
        id: imageId,
        image_url: newImageUrl
      };
    } catch (error) {
      throw new Error(`Error updating image: ${error.message}`);
    }
  }

  static async searchProduct(query) {
    try {
      const [products] = await db.query('SELECT * FROM product WHERE title LIKE ? or description LIKE ?', [`%${query}%`, `%${query}%`])

      return products
    } catch (error) {
      console.log(error)
      throw new Error('Failed to search products')
    }
  }

  static async getProductImages(productId) {
    const [images] = await db.query('SELECT image_url FROM product_images WHERE product_id = ?', [productId])
    return images.map(img => img.image_url)
  }
}

import db from '../utils/db.js'

export class UserModel {
  static async getUserByEmail (email) {
    try {
      const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email])
      return user.length > 0 ? user[0] : null
    } catch (error) {
      console.log(error)
      throw new Error('Failed to check if email exists.')
    }
  }

  static async getUserById (id) {
    try {
      const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id])
      return user.length > 0 ? user[0] : null
    } catch (error) {
      throw new Error('Failed to get user by ID: ' + error.message)
    }
  }

  static async getAllUsers () {
    try {
      const [users] = await db.query('SELECT id, name, email, created_at FROM users')

      return users
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve the users.')
    }
  }

  static async createUser (user) {
    try {
      const { name, email, password } = user

      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
        [name, email, password, '2']
      )

      if (result.affectedRows > 0) {
        return {
          id: result.insertId,
          name,
          email
        }
      }

      return null
    } catch (error) {
      console.log(error)
      throw new Error('Failed to create user.')
    }
  }

  static async getUser (id) {
    try {
      const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id])

      return user
    } catch (error) {
      console.log(error)
      throw new Error('Failed to retrieve that product. Please try again later.')
    }
  }

  static async deleteUser (id) {
    try {
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id])

      return result.affectedRows > 0
    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete user.')
    }
  }

  static async updatePassword (id, newPassword) {
    try {
      await db.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, id])
    } catch (error) {
      throw new Error('Failed to update password: ' + error.message)
    }
  }
}

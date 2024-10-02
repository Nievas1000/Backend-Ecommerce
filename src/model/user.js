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

  static async createUser (user) {
    try {
      const { name, email, password } = user

      const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
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
}

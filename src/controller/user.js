import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { UserModel } from '../model/user.js'
import { validatePartialUser, validateUser } from '../schemas/users.js'
dotenv.config()

export class UserController {
  static async createUser (req, res) {
    try {
      const result = validateUser(req.body)

      if (!result.success) {
        return res.status(400).json({ error: result.error.errors })
      }

      const { name, email, password } = result.data

      const existingUser = await UserModel.getUserByEmail(email)

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await UserModel.createUser({
        name,
        email,
        password: hashedPassword
      })

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

      res.cookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
      })

      res.status(201).json({
        message: 'User registered succesfully',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'An error occurred during registration', error: error.message })
    }
  }

  static async login (req, res) {
    try {
      const result = validatePartialUser(req.body)

      if (!result.success) {
        return res.status(400).json({ errors: result.error.errors })
      }

      const { email, password } = result.data

      const user = await UserModel.getUserByEmail(email)

      if (!user) {
        return res.status(400).json({ message: 'This email is not registered.' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' })
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

      res.cookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
      })

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'An error occurred during login', error: error.message })
    }
  }

  static async auth (req, res) {
    const token = req.cookies.session_token
    if (!token) {
      return res.status(400).json({ error: 'Access denied.' })
    }

    try {
      const user = jwt.decode(token, process.env.JWT_SECRET)

      res.status(200).json({
        message: 'User retrieved successfully',
        user: {
          id: user.id,
          email: user.email
        }
      })
    } catch (error) {
      res.status(500).json({
        message: 'Invalid token.',
        error: error.message
      })
      res.clearCookie('session_token')
      return res.status(403).json({ message: 'Invalid or expired token.' })
    }
  }

  static async logout (req, res) {
    res.clearCookie('session_token')
    res.status(200).json({
      message: 'Logout successfully'
    })
  }

  static async getAllUsers (req, res) {
    try {
      const users = await UserModel.getAllUsers()

      if (users.length === 0) {
        return res.status(404).json({
          message: 'No users found'
        })
      }

      res.status(200).json({
        message: 'Users retrieved successfully',
        users
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the users',
        error: error.message
      })
    }
  }

  static async getUser (req, res) {
    try {
      const { id } = req.params
      const user = await UserModel.getUser(id)

      if (!user || user.length === 0) {
        return res.status(404).json({
          message: 'User not found'
        })
      }

      res.status(200).json({
        message: 'User retrieved succesfully',
        data: {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name
        }
      })
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the user',
        error: error.message
      })
    }
  }

  static async deleteUser (req, res) {
    try {
      const token = req.cookies.session_token

      if (!token) {
        return res.status(400).json({ error: 'Access denied.' })
      }

      jwt.verify(token, process.env.JWT_SECRET)

      const user = await UserModel.getUserById(req.params.id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      await UserModel.deleteUser(req.params.id)

      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid or expired token' })
      }
      res.status(500).json({ message: 'An error occurred while deleting the user', error: error.message })
    }
  }

  static async updatePassword (req, res) {
    try {
      const token = req.cookies.session_token

      if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const userId = decoded.id

      const result = validatePartialUser(req.body)
      if (!result.success) {
        return res.status(400).json({ errors: result.error.errors })
      }

      const user = await UserModel.getUserByEmail(req.body.email)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password)

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10)

      await UserModel.updatePassword(userId, hashedNewPassword)

      res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid or expired token' })
      }
      res.status(500).json({ message: 'An error occurred while changing the password', error: error.message })
    }
  }
}

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
        user
      })
    } catch (error) {
      res.status(500).json({
        message: 'Invalid token.',
        error: error.message
      })
      res.clearCookie('login_token')
      return res.status(403).json({ message: 'Invalid or expired token.' })
    }
  }
}

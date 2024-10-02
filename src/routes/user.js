import express from 'express'
import { UserController } from '../controller/user.js'

const router = express.Router()

router.post('/', UserController.createUser)
router.get('/login', UserController.login)

export default router

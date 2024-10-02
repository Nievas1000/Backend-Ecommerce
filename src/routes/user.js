import express from 'express'
import { UserController } from '../controller/user.js'

const router = express.Router()

router.post('/', UserController.createUser)
router.get('/', UserController.getAllUsers)
router.get('/login', UserController.login)
router.get('/auth', UserController.auth)
router.get('/logout', UserController.logout)
router.get('/:id', UserController.getUser)
router.delete('/:id', UserController.deleteUser)
router.put('/change-password', UserController.updatePassword)

export default router

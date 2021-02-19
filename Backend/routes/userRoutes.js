import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
 
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect,admin,registerUser).get(protect,admin,getUsers)
router.post('/login', authUser)

 
router
  .route('/:id')
  .delete(protect,admin,deleteUser)
  .get(protect,admin,getUserById)
  .put(protect,admin,updateUserProfile)

export default router
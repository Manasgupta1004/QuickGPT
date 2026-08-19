import express from 'express'
import { protect } from '../middlewares/auth.js'
import { createChat, deleteChats, getChats } from '../controllers/chatController.js'


const router = express.Router()

router.get('/create', protect, createChat)
router.get('/get', protect, getChats)
router.post('/delete', protect, deleteChats)

export default router
import express from 'express'
import { protect } from '../middlewares/auth.js'
import { textMessageController, imageMessageController } from '../controllers/messageController.js'


const router = express.Router()

router.put('/text', protect, textMessageController)
router.put('/image', protect, imageMessageController)



export default router
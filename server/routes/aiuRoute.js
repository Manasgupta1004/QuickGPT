import express from 'express'
import { protect } from '../middlewares/auth.js'
import { textMessageController, imageMessageContoller } from '../controllers/messageController.js'


const router = express.Router()

router.put('/text', protect, textMessageController)
router.put('/image', protect, imageMessageContoller)



export default router
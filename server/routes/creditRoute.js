import express from 'express'
import { getPlans, purchasePlan } from '../controllers/creditController.js'
import { protect } from '../middlewares/auth.js'


const router = express.Router()

router.get('/plan', getPlans)
router.post('/purchase', protect, purchasePlan)

export default router
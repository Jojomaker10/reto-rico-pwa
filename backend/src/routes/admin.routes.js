import { Router } from 'express'
import { adminOnly } from '../middlewares/admin.js'
import { getStats } from '../controllers/admin.controller.js'
import { apiLimiter } from '../middlewares/rateLimit.js'

const router = Router()
router.get('/stats', apiLimiter, adminOnly, getStats)
export default router



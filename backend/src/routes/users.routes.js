import { Router } from 'express'
import { creditLocked } from '../controllers/users.controller.js'
import { apiLimiter } from '../middlewares/rateLimit.js'

const router = Router()
router.post('/credit-locked', apiLimiter, creditLocked)
export default router



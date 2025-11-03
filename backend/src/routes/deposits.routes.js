import { Router } from 'express'
import { requestDepositAddress, getDepositHistory } from '../controllers/deposits.controller.js'
import { reportDepositTx } from '../controllers/deposits.report.controller.js'
import { apiLimiter } from '../middlewares/rateLimit.js'

const router = Router()
router.post('/request', apiLimiter, requestDepositAddress)
router.get('/history', apiLimiter, getDepositHistory)
router.post('/report', apiLimiter, reportDepositTx)
export default router



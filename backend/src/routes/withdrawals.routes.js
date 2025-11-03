import { Router } from 'express'
import { requestWithdrawal, getWithdrawalHistory, adminListPending, adminApprove, adminProcessSend } from '../controllers/withdrawals.controller.js'
import { apiLimiter } from '../middlewares/rateLimit.js'

const router = Router()
router.post('/request', apiLimiter, requestWithdrawal)
router.get('/history', apiLimiter, getWithdrawalHistory)
router.get('/admin/pending', apiLimiter, adminListPending)
router.post('/admin/:id/approve', apiLimiter, adminApprove)
router.post('/admin/:id/process', apiLimiter, adminProcessSend)
export default router



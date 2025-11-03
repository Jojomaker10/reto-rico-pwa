import { Router } from 'express'
import { requestWithdrawal, getWithdrawalHistory, adminListPending, adminApprove, adminProcessSend } from '../controllers/withdrawals.controller.js'
import { apiLimiter } from '../middlewares/rateLimit.js'
import { adminOnly } from '../middlewares/admin.js'

const router = Router()
router.post('/request', apiLimiter, requestWithdrawal)
router.get('/history', apiLimiter, getWithdrawalHistory)
router.get('/admin/pending', apiLimiter, adminOnly, adminListPending)
router.post('/admin/:id/approve', apiLimiter, adminOnly, adminApprove)
router.post('/admin/:id/process', apiLimiter, adminOnly, adminProcessSend)
export default router



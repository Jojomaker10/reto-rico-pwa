import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'
import depositsRoutes from './routes/deposits.routes.js'
import withdrawalsRoutes from './routes/withdrawals.routes.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }))
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/deposits', depositsRoutes)
app.use('/api/withdrawals', withdrawalsRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))

export default app



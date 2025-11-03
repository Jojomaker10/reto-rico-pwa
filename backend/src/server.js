import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import { sequelize } from './config/db.js'

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN || '*' } })
global.io = io

io.on('connection', () => {})

async function start() {
  await sequelize.authenticate()
  await sequelize.sync()
  const port = process.env.PORT || 4000
  server.listen(port, () => console.log(`API listening on ${port}`))
}

start()



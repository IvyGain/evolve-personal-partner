/**
 * EVOLVE - Personal Evolution Partner API Server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { initializeDatabase } from './database/database.js'
import authRoutes from './routes/auth.js'
import coachingRoutes from './routes/coaching.js'
import goalsRoutes from './routes/goals.js'
import dashboardRoutes from './routes/dashboard.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()
const server = createServer(app)

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// Initialize database
initializeDatabase()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // 音声チャンクの処理
  socket.on('audio_chunk', (data) => {
    // 音声データの処理ロジック（後で実装）
    console.log('Received audio chunk from:', socket.id)
  })

  // 文字起こしリクエスト
  socket.on('transcription_request', (data) => {
    // 文字起こし処理（後で実装）
    console.log('Transcription request from:', socket.id)
  })

  // AI応答リクエスト
  socket.on('ai_coaching_request', (data) => {
    // AIコーチング応答処理（後で実装）
    console.log('AI coaching request from:', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/coaching', coachingRoutes)
app.use('/api/goals', goalsRoutes)
app.use('/api/dashboard', dashboardRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

// Export both app and server for Socket.IO support
export default app
export { server, io }

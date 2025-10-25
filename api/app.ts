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
import { initializeDatabase, db } from './database/database.js'
import { BytePlusAIService } from './services/byteplusAI.js'
import { v4 as uuidv4 } from 'uuid'
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
  socket.on('ai_coaching_request', async (data) => {
    try {
      console.log('AI coaching request from:', socket.id, data);
      
      const { sessionId, userInput, userId = 'demo-user-001' } = data;
      
      // ユーザー情報を取得
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
      if (!user) {
        socket.emit('ai_coaching_error', { error: 'User not found' });
        return;
      }
      
      // セッション履歴を取得
      const sessionHistory = db.prepare(`
        SELECT * FROM session_messages 
        WHERE session_id = ? 
        ORDER BY created_at ASC
      `).all(sessionId) as any[];
      
      // ユーザーの目標を取得
      const userGoals = db.prepare('SELECT * FROM goals WHERE user_id = ? AND status = ?').all(user.id, 'active') as any[] || [];
      
      // BytePlus AIサービスを使用
      const aiService = BytePlusAIService.getInstance();
      
      // 行動変容ステージを判定
      const behaviorStage = await aiService.assessBehaviorChangeStage(userInput, { sessionHistory });
      
      // コーチングコンテキストを構築
      const coachingContext = {
        sessionHistory,
        userProfile: user,
        behaviorStage,
        userGoals: userGoals,
        currentGoals: userGoals
      };
      
      // リアルタイムでAI応答を生成
      socket.emit('ai_coaching_thinking', { 
        message: 'AIが応答を考えています...',
        stage: behaviorStage 
      });
      
      // BytePlus AIを使用してコーチング応答を生成
      const aiResponse = await aiService.generateCoachingResponse(userInput, coachingContext);
      
      // ユーザーメッセージを記録
      if (sessionId) {
        const messageId = uuidv4();
        const insertMessage = db.prepare(`
          INSERT INTO session_messages (id, session_id, speaker, content) 
          VALUES (?, ?, ?, ?)
        `);
        insertMessage.run(messageId, sessionId, 'user', userInput);
        
        // AI応答を記録
        const aiMessageId = uuidv4();
        const insertAIMessage = db.prepare(`
          INSERT INTO session_messages (id, session_id, speaker, content) 
          VALUES (?, ?, ?, ?)
        `);
        insertAIMessage.run(aiMessageId, sessionId, 'ai', aiResponse.content);
      }
      
      // リアルタイムでAI応答を送信
      socket.emit('ai_coaching_response', {
        sessionId,
        content: aiResponse.content,
        nextQuestions: aiResponse.nextQuestions,
        emotionalTone: aiResponse.emotionalTone,
        confidence: aiResponse.confidence,
        behaviorStage,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('AI coaching WebSocket error:', error);
      socket.emit('ai_coaching_error', { 
        error: 'AI応答の生成に失敗しました。しばらく後にもう一度お試しください。' 
      });
    }
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

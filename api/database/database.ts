import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データベースファイルのパス
const dbPath = path.join(__dirname, '../../data/evolve.db');

// データベース接続
export const db = new Database(dbPath);

// WALモードを有効にしてパフォーマンスを向上
db.pragma('journal_mode = WAL');

// 外部キー制約を有効化
db.pragma('foreign_keys = ON');

// データベース初期化関数
export function initializeDatabase() {
  console.log('Initializing EVOLVE database...');

  // ユーザーテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      personality_profile TEXT DEFAULT '{}',
      preferences TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // インデックス作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
  `);

  // コーチングセッションテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS coaching_sessions (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL,
      session_type TEXT DEFAULT 'general',
      context_data TEXT DEFAULT '{}',
      duration_minutes INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // インデックス作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON coaching_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON coaching_sessions(started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sessions_status ON coaching_sessions(status);
  `);

  // セッションメッセージテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS session_messages (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      session_id TEXT NOT NULL,
      speaker TEXT NOT NULL CHECK (speaker IN ('user', 'ai')),
      content TEXT NOT NULL,
      audio_url TEXT,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES coaching_sessions(id)
    );
  `);

  // インデックス作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_session_id ON session_messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON session_messages(created_at);
  `);

  // 感情分析テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS emotion_analysis (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      session_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      emotion_scores TEXT DEFAULT '{}',
      dominant_emotion TEXT,
      confidence_score REAL DEFAULT 0.0,
      analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES coaching_sessions(id),
      FOREIGN KEY (message_id) REFERENCES session_messages(id)
    );
  `);

  // インデックス作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_emotion_session_id ON emotion_analysis(session_id);
    CREATE INDEX IF NOT EXISTS idx_emotion_analyzed_at ON emotion_analysis(analyzed_at DESC);
  `);

  // 目標テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL,
      raw_goal TEXT NOT NULL,
      smart_goal TEXT DEFAULT '{}',
      category TEXT DEFAULT 'general',
      priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
      target_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // インデックス作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
    CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
    CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority DESC);
    CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);
  `);

  // アクションアイテムテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS action_items (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      goal_id TEXT NOT NULL,
      description TEXT NOT NULL,
      sequence_order INTEGER DEFAULT 0,
      estimated_minutes INTEGER DEFAULT 30,
      difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
      due_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (goal_id) REFERENCES goals(id)
    );
  `);

  // インデックス作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_actions_goal_id ON action_items(goal_id);
    CREATE INDEX IF NOT EXISTS idx_actions_status ON action_items(status);
    CREATE INDEX IF NOT EXISTS idx_actions_due_date ON action_items(due_date);
    CREATE INDEX IF NOT EXISTS idx_actions_sequence ON action_items(sequence_order);
  `);

  // 進捗記録テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS progress_records (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL,
      goal_id TEXT,
      action_item_id TEXT,
      completed BOOLEAN DEFAULT FALSE,
      reflection TEXT,
      emotional_state INTEGER CHECK (emotional_state BETWEEN 1 AND 10),
      metadata TEXT DEFAULT '{}',
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (goal_id) REFERENCES goals(id),
      FOREIGN KEY (action_item_id) REFERENCES action_items(id)
    );
  `);

  // インデックス作成
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress_records(user_id);
    CREATE INDEX IF NOT EXISTS idx_progress_goal_id ON progress_records(goal_id);
    CREATE INDEX IF NOT EXISTS idx_progress_recorded_at ON progress_records(recorded_at DESC);
    CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress_records(completed);
  `);

  console.log('Database tables created successfully!');
  
  // サンプルデータの挿入
  insertSampleData();
}

// サンプルデータ挿入関数
function insertSampleData() {
  console.log('Inserting sample data...');

  // サンプルユーザーが存在するかチェック
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get('demo-user-001');
  
  if (!existingUser) {
    // サンプルユーザー
    db.prepare(`
      INSERT INTO users (id, name, personality_profile, preferences) VALUES 
      (?, ?, ?, ?)
    `).run(
      'demo-user-001', 
      'Demo User',
      JSON.stringify({
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.6,
        agreeableness: 0.9,
        neuroticism: 0.3
      }),
      JSON.stringify({
        coaching_style: 'supportive',
        session_length: 30,
        reminder_frequency: 'daily'
      })
    );

    // サンプル目標
    const goalId = 'demo-goal-001';
    db.prepare(`
      INSERT INTO goals (id, user_id, raw_goal, smart_goal, category, priority, target_date) VALUES 
      (?, ?, ?, ?, ?, ?, ?)
    `).run(
      goalId,
      'demo-user-001',
      '健康的な生活習慣を身につけたい',
      JSON.stringify({
        specific: '毎日30分の運動と8時間の睡眠',
        measurable: '週5日以上実行',
        achievable: '段階的に習慣化',
        relevant: '健康改善',
        timebound: '21日間'
      }),
      'health',
      5,
      new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    // サンプルアクションアイテム
    const actionItems = [
      {
        description: '朝の10分ストレッチ',
        sequence_order: 1,
        estimated_minutes: 10,
        difficulty_level: 'easy'
      },
      {
        description: '夜23時までにベッドに入る',
        sequence_order: 2,
        estimated_minutes: 5,
        difficulty_level: 'medium'
      },
      {
        description: '水を1日2リットル飲む',
        sequence_order: 3,
        estimated_minutes: 2,
        difficulty_level: 'easy'
      }
    ];

    const insertAction = db.prepare(`
      INSERT INTO action_items (goal_id, description, sequence_order, estimated_minutes, difficulty_level, due_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    actionItems.forEach(action => {
      insertAction.run(
        goalId,
        action.description,
        action.sequence_order,
        action.estimated_minutes,
        action.difficulty_level,
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      );
    });

    console.log('Sample data inserted successfully!');
  } else {
    console.log('Sample data already exists, skipping insertion.');
  }
}

// データベース接続を閉じる関数
export function closeDatabase() {
  db.close();
}

// プロセス終了時にデータベースを閉じる
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});
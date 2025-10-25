// EVOLVE MVP - 共通型定義

// ユーザー関連
export interface User {
  id: string;
  name: string;
  email: string;
  personality_profile: PersonalityProfile;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface PersonalityProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface UserPreferences {
  coaching_style: 'supportive' | 'challenging' | 'balanced';
  session_length: number;
  reminder_frequency: 'daily' | 'weekly' | 'none';
}

// コーチングセッション関連
export interface CoachingSession {
  id: string;
  user_id: string;
  session_type: string;
  context_data?: Record<string, any>;
  duration_minutes?: number;
  status: 'active' | 'completed' | 'paused';
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionMessage {
  id: string;
  session_id: string;
  speaker: 'user' | 'ai';
  sender: 'user' | 'ai';  // フロントエンドで使用されているプロパティ
  content: string;
  audio_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  timestamp: string;  // フロントエンドで使用されているプロパティ
  message_type: 'text' | 'audio';  // フロントエンドで使用されているプロパティ
}

export interface EmotionAnalysis {
  id: string;
  session_id: string;
  message_id: string;
  emotion_scores: EmotionScores;
  dominant_emotion: string;
  confidence_score: number;
  analyzed_at: string;
}

export interface EmotionScores {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  neutral: number;
}

// 目標管理関連
export interface Goal {
  id: string;
  user_id: string;
  raw_goal: string;
  smart_goal: SmartGoal;
  category: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  target_date?: string;
  completion_rate: number;
  completed_actions: number;
  total_actions: number;
  created_at: string;
  updated_at: string;
}

export interface SmartGoal {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
}

export interface ActionItem {
  id: string;
  goal_id: string;
  description: string;
  raw_goal: string;
  priority: 1 | 2 | 3 | 4 | 5;
  sequence_order: number;
  estimated_minutes: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  due_date?: string;
  created_at: string;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  goal_id?: string;
  action_item_id?: string;
  completed: boolean;
  reflection?: string;
  emotional_state?: number;
  metadata: Record<string, any>;
  recorded_at: string;
}

// API関連
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// コーチング関連
export interface CoachingRequest {
  audioData?: Blob;
  textInput?: string;
  sessionContext?: Record<string, any>;
}

export interface CoachingResponse {
  sessionId: string;
  aiResponse: string;
  emotionAnalysis: EmotionAnalysis;
  nextQuestions: string[];
  suggestions?: string[];
}

// 行動変容5段階理論
export type BehaviorChangeStage = 
  | 'precontemplation'  // 無関心期
  | 'contemplation'     // 関心期
  | 'preparation'       // 準備期
  | 'action'           // 実行期
  | 'maintenance';     // 維持期

export interface BehaviorChangeAssessment {
  stage: BehaviorChangeStage;
  current_stage: BehaviorChangeStage;
  stage_description: string;
  next_stage_tips: string[];
  confidence_level: number;
  motivation_level: number;
  barriers: string[];
  facilitators: string[];
}

// GROWモデル関連
export interface GrowModelSession {
  goal: string;
  reality: string;
  options: string[];
  will: string;
}

// 音声関連
export interface VoiceSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

export interface AudioProcessingResult {
  transcript: string;
  confidence: number;
  emotion_detected?: string;
  sentiment_score?: number;
}

// ダッシュボード関連
export interface DashboardData {
  user: User;
  activeGoals: Goal[];
  todayActions: ActionItem[];
  progressSummary: ProgressSummary;
  recentSessions: CoachingSession[];
  overview: ProgressSummary;
  today_actions: ActionItem[];
  active_goals: Goal[];
  recent_achievements: MicroAchievement[];
  emotional_trend: EmotionTrend[];
  behavior_stage: BehaviorChangeAssessment;
  habit_progress: HabitProgress[];
  motivational_message: string;
}

export interface ProgressSummary {
  total_goals: number;
  completed_goals: number;
  active_goals: number;
  completion_rate: number;
  streak_days: number;
  current_streak: number;
  total_sessions: number;
  total_points: number;
  average_session_duration: number;
}

// WebSocket関連
export interface WebSocketMessage {
  type: 'audio_chunk' | 'transcription' | 'ai_response' | 'emotion_update' | 'error';
  data: any;
  timestamp: string;
}

// 21日間習慣形成関連
export interface HabitFormationPlan {
  goal_id: string;
  week1_actions: ActionItem[];  // 意識的実行期
  week2_actions: ActionItem[];  // 抵抗期
  week3_actions: ActionItem[];  // 習慣化期
  daily_reminders: string[];
  success_metrics: string[];
}

// マイクロ達成システム
export interface MicroAchievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  action_description: string;
  raw_goal: string;
  points: number;
  achieved_at: string;
  recorded_at: string;
  category: 'daily' | 'weekly' | 'milestone' | 'breakthrough';
}

// エラー関連
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// 追加の型定義
export interface EmotionTrend {
  date: string;
  dominant_emotion: string;
  average_score: number;
  avg_emotional_state: number;
}

export interface HabitProgress {
  goal_id: string;
  habit_name: string;
  goal_title: string;
  current_streak: number;
  target_days: number;
  completion_rate: number;
  days_since_start: number;
  habit_strength: number;
  phase_description: string;
}
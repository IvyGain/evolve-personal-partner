import express from 'express';
import { db } from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
import type { 
  CoachingRequest, 
  CoachingResponse, 
  ApiResponse,
  BehaviorChangeStage,
  GrowModelSession 
} from '../../shared/types.js';

const router = express.Router();

// コーチングセッション開始
router.post('/session/start', async (req, res) => {
  try {
    const { textInput, sessionContext }: CoachingRequest = req.body;
    
    // デモユーザーを取得または作成
    let user = db.prepare('SELECT * FROM users WHERE id = ?').get('demo-user-001');
    
    if (!user) {
      // デモユーザーを作成
      const insertUser = db.prepare(`
        INSERT INTO users (id, name, personality_profile, preferences) 
        VALUES (?, ?, ?, ?)
      `);
      
      insertUser.run(
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
      
      user = db.prepare('SELECT * FROM users WHERE id = ?').get('demo-user-001');
    }

    // 新しいコーチングセッションを作成
    const sessionId = uuidv4();
    const insertSession = db.prepare(`
      INSERT INTO coaching_sessions (id, user_id, session_type, context_data, status) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertSession.run(
      sessionId,
      user.id,
      'ai_coaching',
      JSON.stringify(sessionContext || {}),
      'active'
    );

    // ユーザーメッセージを記録
    if (textInput) {
      const messageId = uuidv4();
      const insertMessage = db.prepare(`
        INSERT INTO session_messages (id, session_id, speaker, content) 
        VALUES (?, ?, ?, ?)
      `);
      
      insertMessage.run(messageId, sessionId, 'user', textInput);
    }

    // AIコーチング応答を生成
    const aiResponse = await generateCoachingResponse(textInput || '', user, sessionContext);
    
    // AI応答を記録
    const aiMessageId = uuidv4();
    const insertAIMessage = db.prepare(`
      INSERT INTO session_messages (id, session_id, speaker, content) 
      VALUES (?, ?, ?, ?)
    `);
    
    insertAIMessage.run(aiMessageId, sessionId, 'ai', aiResponse.aiResponse);

    // 感情分析を記録（簡易版）
    const emotionAnalysis = analyzeEmotion(textInput || '');
    const insertEmotion = db.prepare(`
      INSERT INTO emotion_analysis (id, session_id, message_id, emotion_scores, dominant_emotion, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertEmotion.run(
      uuidv4(),
      sessionId,
      aiMessageId,
      JSON.stringify(emotionAnalysis.emotion_scores),
      emotionAnalysis.dominant_emotion,
      emotionAnalysis.confidence_score
    );

    const response: ApiResponse<CoachingResponse> = {
      success: true,
      data: {
        sessionId,
        aiResponse: aiResponse.aiResponse,
        emotionAnalysis,
        nextQuestions: aiResponse.nextQuestions
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Coaching session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start coaching session'
    });
  }
});

// セッション継続
router.post('/session/:sessionId/continue', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { textInput }: CoachingRequest = req.body;

    // セッション存在確認
    const session = db.prepare('SELECT * FROM coaching_sessions WHERE id = ?').get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // ユーザー情報取得
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id);

    // ユーザーメッセージを記録
    const messageId = uuidv4();
    const insertMessage = db.prepare(`
      INSERT INTO session_messages (id, session_id, speaker, content) 
      VALUES (?, ?, ?, ?)
    `);
    
    insertMessage.run(messageId, sessionId, 'user', textInput);

    // セッション履歴を取得
    const sessionHistory = db.prepare(`
      SELECT * FROM session_messages 
      WHERE session_id = ? 
      ORDER BY created_at ASC
    `).all(sessionId);

    // AIコーチング応答を生成
    const aiResponse = await generateCoachingResponse(textInput, user, { sessionHistory });
    
    // AI応答を記録
    const aiMessageId = uuidv4();
    const insertAIMessage = db.prepare(`
      INSERT INTO session_messages (id, session_id, speaker, content) 
      VALUES (?, ?, ?, ?)
    `);
    
    insertAIMessage.run(aiMessageId, sessionId, 'ai', aiResponse.aiResponse);

    // 感情分析
    const emotionAnalysis = analyzeEmotion(textInput);
    const insertEmotion = db.prepare(`
      INSERT INTO emotion_analysis (id, session_id, message_id, emotion_scores, dominant_emotion, confidence_score) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertEmotion.run(
      uuidv4(),
      sessionId,
      aiMessageId,
      JSON.stringify(emotionAnalysis.emotion_scores),
      emotionAnalysis.dominant_emotion,
      emotionAnalysis.confidence_score
    );

    const response: ApiResponse<CoachingResponse> = {
      success: true,
      data: {
        sessionId,
        aiResponse: aiResponse.aiResponse,
        emotionAnalysis,
        nextQuestions: aiResponse.nextQuestions
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Session continue error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to continue session'
    });
  }
});

// セッション履歴取得
router.get('/session/:sessionId/history', (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = db.prepare(`
      SELECT sm.*, ea.dominant_emotion, ea.confidence_score
      FROM session_messages sm
      LEFT JOIN emotion_analysis ea ON sm.id = ea.message_id
      WHERE sm.session_id = ?
      ORDER BY sm.created_at ASC
    `).all(sessionId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get session history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session history'
    });
  }
});

// AIコーチング応答生成関数
async function generateCoachingResponse(userInput: string, user: any, context: any = {}) {
  // 行動変容ステージを判定
  const behaviorStage = assessBehaviorChangeStage(userInput, context);
  
  // GROWモデルに基づく質問生成
  const growQuestions = generateGrowQuestions(userInput, behaviorStage);
  
  // コーチング応答を生成
  let aiResponse = '';
  let nextQuestions: string[] = [];

  // 簡易的なルールベースの応答生成（実際のAI統合は後で実装）
  if (userInput.includes('目標') || userInput.includes('ゴール')) {
    aiResponse = generateGoalFocusedResponse(userInput, behaviorStage);
    nextQuestions = growQuestions.goal;
  } else if (userInput.includes('現状') || userInput.includes('今')) {
    aiResponse = generateRealityFocusedResponse(userInput, behaviorStage);
    nextQuestions = growQuestions.reality;
  } else if (userInput.includes('方法') || userInput.includes('どうすれば')) {
    aiResponse = generateOptionsFocusedResponse(userInput, behaviorStage);
    nextQuestions = growQuestions.options;
  } else if (userInput.includes('やります') || userInput.includes('実行')) {
    aiResponse = generateWillFocusedResponse(userInput, behaviorStage);
    nextQuestions = growQuestions.will;
  } else {
    // 初回または一般的な応答
    aiResponse = generateWelcomeResponse(userInput, behaviorStage);
    nextQuestions = growQuestions.goal;
  }

  return {
    aiResponse,
    nextQuestions
  };
}

// 行動変容ステージ判定
function assessBehaviorChangeStage(userInput: string, context: any): BehaviorChangeStage {
  const input = userInput.toLowerCase();
  
  if (input.includes('変わりたくない') || input.includes('必要ない')) {
    return 'precontemplation';
  } else if (input.includes('考えている') || input.includes('悩んでいる')) {
    return 'contemplation';
  } else if (input.includes('準備') || input.includes('計画')) {
    return 'preparation';
  } else if (input.includes('始めた') || input.includes('実行中')) {
    return 'action';
  } else if (input.includes('続けている') || input.includes('習慣')) {
    return 'maintenance';
  }
  
  return 'contemplation'; // デフォルト
}

// GROWモデル質問生成
function generateGrowQuestions(userInput: string, stage: BehaviorChangeStage) {
  return {
    goal: [
      'あなたが本当に達成したいことは何ですか？',
      'その目標が実現したとき、どんな気持ちになりますか？',
      '具体的にはどのような状態を目指していますか？'
    ],
    reality: [
      '現在の状況を詳しく教えてください',
      'これまでにどんな取り組みをされましたか？',
      '今、一番の課題は何だと感じていますか？'
    ],
    options: [
      'どのような方法が考えられますか？',
      '過去に成功した経験から学べることはありますか？',
      '他にどんな選択肢がありそうですか？'
    ],
    will: [
      '具体的に何から始めますか？',
      'いつまでに実行しますか？',
      'どうやって進捗を確認しますか？'
    ]
  };
}

// 各種応答生成関数
function generateGoalFocusedResponse(userInput: string, stage: BehaviorChangeStage): string {
  const responses = {
    precontemplation: 'まずは、なぜその目標が大切なのか、一緒に考えてみませんか？',
    contemplation: '素晴らしい目標ですね。その目標があなたにとってどんな意味を持つのか、もう少し詳しく聞かせてください。',
    preparation: 'その目標に向けて、具体的な計画を立てていきましょう。',
    action: '目標に向けて行動されているのですね。現在の進捗はいかがですか？',
    maintenance: '継続されているのは素晴らしいことです。さらに発展させる方法を考えてみましょう。'
  };
  
  return responses[stage];
}

function generateRealityFocusedResponse(userInput: string, stage: BehaviorChangeStage): string {
  const responses = {
    precontemplation: '現状について、客観的に見つめてみることから始めましょう。',
    contemplation: '現在の状況を整理することで、次のステップが見えてくるかもしれません。',
    preparation: '現状を踏まえて、実現可能な計画を立てていきましょう。',
    action: '現在の取り組みの効果はいかがですか？',
    maintenance: '継続できている要因は何だと思いますか？'
  };
  
  return responses[stage];
}

function generateOptionsFocusedResponse(userInput: string, stage: BehaviorChangeStage): string {
  const responses = {
    precontemplation: '様々な選択肢があることを知ることから始めてみませんか？',
    contemplation: 'いくつかの選択肢を比較検討してみましょう。',
    preparation: 'あなたに最も適した方法を選んでいきましょう。',
    action: '現在の方法以外にも、試してみたい方法はありますか？',
    maintenance: '新しいアプローチを取り入れることで、さらに効果を高められるかもしれません。'
  };
  
  return responses[stage];
}

function generateWillFocusedResponse(userInput: string, stage: BehaviorChangeStage): string {
  const responses = {
    precontemplation: '小さな一歩から始めてみることを考えてみませんか？',
    contemplation: '実際に行動に移すために、何が必要だと思いますか？',
    preparation: '素晴らしい決意ですね。具体的な行動計画を立てましょう。',
    action: 'その意欲、とても素晴らしいです。継続のコツを一緒に考えましょう。',
    maintenance: '継続する意志の強さが感じられます。さらなる成長を目指しましょう。'
  };
  
  return responses[stage];
}

function generateWelcomeResponse(userInput: string, stage: BehaviorChangeStage): string {
  return `こんにちは！EVOLVEへようこそ。私はあなたの成長をサポートするAIコーチです。
  
今日はどのようなことについてお話ししましょうか？あなたの目標や現在の状況、お悩みなど、何でもお聞かせください。

一緒に、あなたらしい成長の道筋を見つけていきましょう。`;
}

// 簡易感情分析
function analyzeEmotion(text: string) {
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    neutral: 0.5
  };

  // 簡易的なキーワードベースの感情分析
  const joyWords = ['嬉しい', '楽しい', '幸せ', '良い', '素晴らしい'];
  const sadnessWords = ['悲しい', '辛い', '落ち込む', '憂鬱'];
  const angerWords = ['怒り', 'イライラ', '腹立つ', 'ムカつく'];
  const fearWords = ['不安', '心配', '怖い', '恐れ'];

  joyWords.forEach(word => {
    if (text.includes(word)) emotions.joy += 0.3;
  });

  sadnessWords.forEach(word => {
    if (text.includes(word)) emotions.sadness += 0.3;
  });

  angerWords.forEach(word => {
    if (text.includes(word)) emotions.anger += 0.3;
  });

  fearWords.forEach(word => {
    if (text.includes(word)) emotions.fear += 0.3;
  });

  // 最も高いスコアの感情を特定
  const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
    emotions[a[0]] > emotions[b[0]] ? a : b
  )[0];

  return {
    id: uuidv4(),
    session_id: '',
    message_id: '',
    emotion_scores: emotions,
    dominant_emotion: dominantEmotion,
    confidence_score: Math.max(...Object.values(emotions)),
    analyzed_at: new Date().toISOString()
  };
}

export default router;
import express from 'express';
import { db } from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
import { BytePlusAIService } from '../services/byteplusAI.js';
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
    console.log('🚀 Starting new coaching session:', req.body);
    const { goal_focus, preferred_style } = req.body;
    
    // デモユーザーを取得または作成
    let user = db.prepare('SELECT * FROM users WHERE id = ?').get('demo-user-001');
    
    if (!user) {
      console.log('📝 Creating demo user...');
      try {
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
            coaching_style: preferred_style || 'supportive',
            session_length: 30,
            reminder_frequency: 'daily'
          })
        );
        
        user = db.prepare('SELECT * FROM users WHERE id = ?').get('demo-user-001');
        console.log('✅ Demo user created:', user);
      } catch (userError) {
        console.error('❌ Error creating demo user:', userError);
        throw new Error('Failed to create demo user');
      }
    }

    // 新しいコーチングセッションを作成
    const sessionId = uuidv4();
    console.log('🎯 Creating session with ID:', sessionId);
    
    try {
      const insertSession = db.prepare(`
        INSERT INTO coaching_sessions (id, user_id, session_type, context_data, status) 
        VALUES (?, ?, ?, ?, ?)
      `);
      
      insertSession.run(
        sessionId,
        (user as any).id,
        'ai_coaching',
        JSON.stringify({ goal_focus, preferred_style }),
        'active'
      );
      console.log('✅ Session created successfully');
    } catch (sessionError) {
      console.error('❌ Error creating session:', sessionError);
      throw new Error('Failed to create coaching session');
    }

    // 初期AIメッセージを生成
    try {
      const initialResponse = generateWelcomeResponse('', 'precontemplation');
      console.log('💬 Generated initial response:', initialResponse);
      
      // AI応答を記録
      const aiMessageId = uuidv4();
      const insertAIMessage = db.prepare(`
        INSERT INTO session_messages (id, session_id, speaker, content) 
        VALUES (?, ?, ?, ?)
      `);
      
      insertAIMessage.run(aiMessageId, sessionId, 'ai', initialResponse.aiResponse);
      console.log('✅ Initial AI message recorded');

      // セッション情報を取得
      const session = db.prepare('SELECT * FROM coaching_sessions WHERE id = ?').get(sessionId);
      console.log('📋 Session retrieved:', session);

      // レスポンスを返す
      const response = {
        success: true,
        data: {
          session: {
            id: sessionId,
            user_id: (user as any).id,
            session_type: 'ai_coaching',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          initial_message: {
            id: aiMessageId,
            session_id: sessionId,
            speaker: 'ai',
            content: initialResponse.aiResponse,
            timestamp: new Date().toISOString(),
            sender: 'ai',
            created_at: new Date().toISOString()
          }
        }
      };

      console.log('🎉 Session start successful, sending response:', response);
      res.json(response);
    } catch (messageError) {
      console.error('❌ Error generating/recording initial message:', messageError);
      throw new Error('Failed to generate initial message');
    }

  } catch (error) {
    console.error('💥 Session start error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start coaching session'
    });
  }
});

// セッション継続
router.post('/session/:sessionId/continue', async (req, res) => {
  try {
    console.log('🔄 Continuing session:', req.params.sessionId, req.body);
    const { sessionId } = req.params;
    const { user_message, emotional_state } = req.body;

    // セッション存在確認
    const session = db.prepare('SELECT * FROM coaching_sessions WHERE id = ?').get(sessionId);
    if (!session) {
      console.log('❌ Session not found:', sessionId);
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // ユーザー情報取得
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get((session as any).user_id);

    // ユーザーメッセージを記録
    const messageId = uuidv4();
    const insertMessage = db.prepare(`
      INSERT INTO session_messages (id, session_id, speaker, content) 
      VALUES (?, ?, ?, ?)
    `);
    
    insertMessage.run(messageId, sessionId, 'user', user_message);
    console.log('💬 User message recorded:', user_message);

    // セッション履歴を取得
    const sessionHistory = db.prepare(`
      SELECT * FROM session_messages 
      WHERE session_id = ? 
      ORDER BY created_at ASC
    `).all(sessionId);

    // AIコーチング応答を生成
    const aiResponse = await generateCoachingResponse(user_message, user, { sessionHistory });
    console.log('🤖 AI response generated:', aiResponse.aiResponse);
    
    // AI応答を記録
    const aiMessageId = uuidv4();
    const insertAIMessage = db.prepare(`
      INSERT INTO session_messages (id, session_id, speaker, content) 
      VALUES (?, ?, ?, ?)
    `);
    
    insertAIMessage.run(aiMessageId, sessionId, 'ai', aiResponse.aiResponse);

    // 感情分析
    const emotionAnalysis = analyzeEmotion(user_message);
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

    // AI応答メッセージオブジェクトを作成（フロントエンドの期待に合わせる）
    const ai_response = {
      id: aiMessageId,
      session_id: sessionId,
      sender: 'ai',
      content: aiResponse.aiResponse,
      timestamp: new Date().toISOString(),
      message_type: 'text'
    };

    console.log('📤 Sending AI response');

    const response = {
      success: true,
      data: {
        ai_response,
        emotion_analysis: emotionAnalysis,
        next_questions: aiResponse.nextQuestions
      }
    };

    res.json(response);
  } catch (error) {
    console.error('❌ Session continue error:', error);
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
  try {
    console.log('🤖 Generating coaching response for user:', user.id);
    
    // BytePlus AIサービスのインスタンスを取得
    const aiService = BytePlusAIService.getInstance();
    
    // セッション履歴を取得
    const sessionHistory = context.sessionHistory || [];
    
    // セッション履歴を分析
    const conversationAnalysis = analyzeConversationHistory(sessionHistory);
    console.log('📊 Conversation analysis:', conversationAnalysis);
    
    // ユーザーの目標を取得
    const userGoals = db.prepare('SELECT * FROM goals WHERE user_id = ? AND status = ?').all(user.id, 'active') as any[] || [];
    
    // 行動変容ステージを判定（AI使用）
    const behaviorStage = await aiService.assessBehaviorChangeStage(userInput, context);
    
    // コーチングコンテキストを構築
    const coachingContext = {
      sessionHistory,
      userProfile: user,
      behaviorStage,
      userGoals: userGoals,
      currentGoals: userGoals,
      conversationAnalysis
    };
    
    // BytePlus AIを使用してコーチング応答を生成
    const aiResponse = await aiService.generateCoachingResponse(userInput, coachingContext);
    
    return {
      aiResponse: aiResponse.content,
      nextQuestions: aiResponse.nextQuestions,
      emotionalTone: aiResponse.emotionalTone,
      confidence: aiResponse.confidence,
      behaviorStage
    };
  } catch (error) {
    console.error('AI coaching response generation failed, falling back to rule-based system:', error);
    
    // フォールバック: ルールベースシステム
    const sessionHistory = context.sessionHistory || [];
    const conversationAnalysis = analyzeConversationHistory(sessionHistory);
    const behaviorStage = assessBehaviorChangeStage(userInput, context, conversationAnalysis);
    const currentGrowPhase = determineGrowPhase(conversationAnalysis, userInput);
    
    console.log('🎯 Current GROW phase:', currentGrowPhase);
    
    const response = generateContextualResponse(
      userInput, 
      behaviorStage, 
      currentGrowPhase, 
      conversationAnalysis,
      user
    );

    return response;
  }
}

// セッション履歴分析関数
function analyzeConversationHistory(sessionHistory: any[]) {
  if (!sessionHistory || sessionHistory.length === 0) {
    return {
      messageCount: 0,
      topics: [],
      userGoals: [],
      challenges: [],
      emotions: [],
      growPhaseHistory: [],
      lastUserMessage: null,
      conversationFlow: 'initial'
    };
  }

  const userMessages = sessionHistory.filter(msg => msg.sender === 'user');
  const aiMessages = sessionHistory.filter(msg => msg.sender === 'ai');
  
  // トピック抽出
  const topics = extractTopics(userMessages);
  
  // 目標抽出
  const userGoals = extractGoals(userMessages);
  
  // 課題抽出
  const challenges = extractChallenges(userMessages);
  
  // 感情分析履歴
  const emotions = userMessages.map(msg => analyzeEmotion(msg.content));
  
  // GROWフェーズ履歴
  const growPhaseHistory = trackGrowPhases(sessionHistory);
  
  // 最後のユーザーメッセージ
  const lastUserMessage = userMessages[userMessages.length - 1];
  
  // 会話の流れを判定
  const conversationFlow = determineConversationFlow(sessionHistory);

  return {
    messageCount: sessionHistory.length,
    userMessageCount: userMessages.length,
    topics,
    userGoals,
    challenges,
    emotions,
    growPhaseHistory,
    lastUserMessage,
    conversationFlow,
    recentContext: sessionHistory.slice(-6) // 直近6メッセージ
  };
}

// トピック抽出
function extractTopics(userMessages: any[]): string[] {
  const topics = new Set<string>();
  const topicKeywords = {
    'キャリア': ['仕事', 'キャリア', '転職', '昇進', '職場'],
    '健康': ['健康', '運動', 'ダイエット', '食事', '睡眠'],
    '人間関係': ['人間関係', '友人', '家族', '恋人', 'コミュニケーション'],
    '学習': ['勉強', '学習', 'スキル', '資格', '成長'],
    'ライフスタイル': ['生活', '習慣', '時間管理', 'バランス']
  };

  userMessages.forEach(msg => {
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => msg.content.includes(keyword))) {
        topics.add(topic);
      }
    });
  });

  return Array.from(topics);
}

// 目標抽出
function extractGoals(userMessages: any[]): string[] {
  const goals = [];
  const goalPatterns = [
    /(.+)したい/g,
    /(.+)になりたい/g,
    /目標は(.+)/g,
    /達成したいのは(.+)/g
  ];

  userMessages.forEach(msg => {
    goalPatterns.forEach(pattern => {
      const matches = msg.content.match(pattern);
      if (matches) {
        goals.push(...matches);
      }
    });
  });

  return goals.slice(0, 5); // 最大5個まで
}

// 課題抽出
function extractChallenges(userMessages: any[]): string[] {
  const challenges = [];
  const challengeKeywords = ['困っている', '悩んでいる', '問題', '課題', 'うまくいかない', '難しい'];

  userMessages.forEach(msg => {
    challengeKeywords.forEach(keyword => {
      if (msg.content.includes(keyword)) {
        challenges.push(msg.content);
      }
    });
  });

  return challenges.slice(0, 3); // 最大3個まで
}

// GROWフェーズ追跡
function trackGrowPhases(sessionHistory: any[]): string[] {
  const phases = [];
  const phaseKeywords = {
    'Goal': ['目標', 'ゴール', '達成したい', 'なりたい'],
    'Reality': ['現状', '今', '現在', '実際'],
    'Options': ['方法', 'やり方', 'どうすれば', '選択肢'],
    'Will': ['やります', '実行', '始める', 'コミット']
  };

  sessionHistory.forEach(msg => {
    if (msg.sender === 'ai') return;
    
    Object.entries(phaseKeywords).forEach(([phase, keywords]) => {
      if (keywords.some(keyword => msg.content.includes(keyword))) {
        phases.push(phase);
      }
    });
  });

  return phases;
}

// 会話の流れ判定
function determineConversationFlow(sessionHistory: any[]): string {
  if (sessionHistory.length <= 2) return 'initial';
  if (sessionHistory.length <= 6) return 'exploration';
  if (sessionHistory.length <= 12) return 'deepening';
  return 'action_planning';
}

// GROWフェーズ判定
function determineGrowPhase(analysis: any, userInput: string): string {
  const input = userInput.toLowerCase();
  
  // 履歴に基づく判定
  const recentPhases = analysis.growPhaseHistory.slice(-3);
  
  // 現在の入力に基づく判定
  if (input.includes('目標') || input.includes('ゴール') || input.includes('達成したい')) {
    return 'Goal';
  } else if (input.includes('現状') || input.includes('今') || input.includes('実際')) {
    return 'Reality';
  } else if (input.includes('方法') || input.includes('どうすれば') || input.includes('やり方')) {
    return 'Options';
  } else if (input.includes('やります') || input.includes('実行') || input.includes('始める')) {
    return 'Will';
  }
  
  // 履歴に基づく次のフェーズ推定
  if (recentPhases.length > 0) {
    const lastPhase = recentPhases[recentPhases.length - 1];
    switch (lastPhase) {
      case 'Goal': return 'Reality';
      case 'Reality': return 'Options';
      case 'Options': return 'Will';
      case 'Will': return 'Goal';
    }
  }
  
  // デフォルトは Goal から開始
  return 'Goal';
}

// コンテキスト活用応答生成
function generateContextualResponse(
  userInput: string, 
  behaviorStage: BehaviorChangeStage, 
  growPhase: string, 
  analysis: any,
  user: any
) {
  console.log('🎨 Generating contextual response:', { growPhase, behaviorStage, messageCount: analysis.messageCount });

  // 初回セッションの場合
  if (analysis.messageCount === 0) {
    return generateWelcomeResponse(userInput, behaviorStage);
  }

  // 継続セッションの場合、前回の内容を参照
  let aiResponse = '';
  let nextQuestions: string[] = [];

  switch (growPhase) {
    case 'Goal':
      aiResponse = generateGoalFocusedResponseWithContext(userInput, behaviorStage, analysis);
      nextQuestions = generateGoalQuestions(analysis);
      break;
    case 'Reality':
      aiResponse = generateRealityFocusedResponseWithContext(userInput, behaviorStage, analysis);
      nextQuestions = generateRealityQuestions(analysis);
      break;
    case 'Options':
      aiResponse = generateOptionsFocusedResponseWithContext(userInput, behaviorStage, analysis);
      nextQuestions = generateOptionsQuestions(analysis);
      break;
    case 'Will':
      aiResponse = generateWillFocusedResponseWithContext(userInput, behaviorStage, analysis);
      nextQuestions = generateWillQuestions(analysis);
      break;
    default:
      aiResponse = generateAdaptiveResponse(userInput, behaviorStage, analysis);
      nextQuestions = generateAdaptiveQuestions(analysis);
  }
  
  return {
    aiResponse,
    nextQuestions,
    emotionalTone: 'supportive',
    confidence: 0.8,
    behaviorStage
  };
}

// コンテキスト活用Goal応答
function generateGoalFocusedResponseWithContext(userInput: string, stage: BehaviorChangeStage, analysis: any): string {
  const { userGoals, topics, conversationFlow } = analysis;
  
  if (userGoals.length > 0) {
    return `これまでお話しいただいた「${userGoals[0]}」について、もう少し具体的に教えてください。その目標が達成されたとき、あなたの生活はどのように変わっていると思いますか？`;
  }
  
  if (topics.length > 0) {
    return `${topics[0]}に関する目標について、より明確にしていきましょう。あなたが本当に実現したいことは何でしょうか？`;
  }
  
  return generateGoalFocusedResponse(userInput, stage);
}

// コンテキスト活用Reality応答
function generateRealityFocusedResponseWithContext(userInput: string, stage: BehaviorChangeStage, analysis: any): string {
  const { challenges, lastUserMessage, conversationFlow } = analysis;
  
  if (challenges.length > 0) {
    return `先ほどお話しいただいた課題について、現在の状況をもう少し詳しく教えてください。どのような点で特に困難を感じていますか？`;
  }
  
  if (lastUserMessage && analysis.messageCount > 2) {
    return `お話しいただいた内容から、現在の状況をより深く理解したいと思います。これまでにどのような取り組みをされてきましたか？`;
  }
  
  return generateRealityFocusedResponse(userInput, stage);
}

// コンテキスト活用Options応答
function generateOptionsFocusedResponseWithContext(userInput: string, stage: BehaviorChangeStage, analysis: any): string {
  const { userGoals, challenges, topics } = analysis;
  
  if (userGoals.length > 0 && challenges.length > 0) {
    return `「${userGoals[0]}」を実現するために、これまでお話しいただいた課題を踏まえて、どのような方法が考えられるでしょうか？過去の成功体験も参考にしてみてください。`;
  }
  
  return generateOptionsFocusedResponse(userInput, stage);
}

// コンテキスト活用Will応答
function generateWillFocusedResponseWithContext(userInput: string, stage: BehaviorChangeStage, analysis: any): string {
  const { userGoals, recentContext } = analysis;
  
  if (userGoals.length > 0) {
    return `素晴らしいですね！「${userGoals[0]}」に向けて、具体的に何から始めますか？今週中に実行できる小さな一歩を決めましょう。`;
  }
  
  return generateWillFocusedResponse(userInput, stage);
}

// 適応的応答生成
function generateAdaptiveResponse(userInput: string, stage: BehaviorChangeStage, analysis: any): string {
  const { emotions, conversationFlow, messageCount } = analysis;
  
  // 感情に基づく応答調整
  const latestEmotion = emotions[emotions.length - 1];
  if (latestEmotion && latestEmotion.dominant_emotion === 'sadness') {
    return `お話しいただき、ありがとうございます。少し辛い気持ちを感じていらっしゃるようですね。まずは今の気持ちを大切にしながら、一緒に前向きな方向を見つけていきましょう。`;
  }
  
  if (latestEmotion && latestEmotion.dominant_emotion === 'joy') {
    return `とても前向きな気持ちが伝わってきます！この良い流れを活かして、さらに具体的な行動につなげていきましょう。`;
  }
  
  // 会話の流れに基づく応答
  switch (conversationFlow) {
    case 'initial':
      return `お話しいただき、ありがとうございます。あなたの状況をより深く理解するために、いくつか質問させてください。`;
    case 'exploration':
      return `これまでのお話から、あなたの考えがより明確になってきましたね。さらに掘り下げて考えてみましょう。`;
    case 'deepening':
      return `お話しいただいた内容を整理すると、いくつかの重要なポイントが見えてきました。これらを踏まえて次のステップを考えてみましょう。`;
    case 'action_planning':
      return `これまでの対話を通じて、あなたの目標と現状がよく理解できました。具体的な行動計画を立てていきましょう。`;
  }
  
  return `お話しいただき、ありがとうございます。あなたの状況をより深く理解するために、いくつか質問させてください。`;
}

// コンテキスト活用質問生成
function generateGoalQuestions(analysis: any): string[] {
  const { topics, userGoals } = analysis;
  
  if (userGoals.length > 0) {
    return [
      'その目標が実現したとき、どんな気持ちになりますか？',
      '目標達成によって、周りの人にはどんな影響がありそうですか？',
      'なぜその目標が重要だと感じるのですか？'
    ];
  }
  
  return [
    'あなたが本当に達成したいことは何ですか？',
    'その目標が実現したとき、どんな気持ちになりますか？',
    '具体的にはどのような状態を目指していますか？'
  ];
}

function generateRealityQuestions(analysis: any): string[] {
  return [
    '現在の状況を詳しく教えてください',
    'これまでにどんな取り組みをされましたか？',
    '今、一番の課題は何だと感じていますか？'
  ];
}

function generateOptionsQuestions(analysis: any): string[] {
  return [
    'どのような方法が考えられますか？',
    '過去に成功した経験から学べることはありますか？',
    '他にどんな選択肢がありそうですか？'
  ];
}

function generateWillQuestions(analysis: any): string[] {
  return [
    '具体的に何から始めますか？',
    'いつまでに実行しますか？',
    'どのように進捗を確認しますか？'
  ];
}

function generateAdaptiveQuestions(analysis: any): string[] {
  const { conversationFlow } = analysis;
  
  switch (conversationFlow) {
    case 'initial':
      return [
        'どのようなことでお悩みですか？',
        '今日はどんなことをお話ししたいですか？',
        'どのような変化を求めていますか？'
      ];
    default:
      return generateGoalQuestions(analysis);
  }
}

// 行動変容ステージ判定（履歴考慮版）
function assessBehaviorChangeStage(userInput: string, context: any, analysis: any): BehaviorChangeStage {
  const input = userInput.toLowerCase();
  
  // 履歴からの判定も考慮
  const { emotions, messageCount } = analysis;
  
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
  
  // 感情分析に基づく判定
  if (emotions.length > 0) {
    const latestEmotion = emotions[emotions.length - 1];
    if (latestEmotion.dominant_emotion === 'joy' && messageCount > 5) {
      return 'action';
    }
  }
  
  return 'contemplation'; // デフォルト
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

function generateWelcomeResponse(userInput: string, stage: BehaviorChangeStage): { aiResponse: string; nextQuestions: string[] } {
  const welcomeMessage = 'こんにちは！あなたの目標達成をサポートするパーソナルコーチです。今日はどのようなことについてお話ししたいですか？';
  const initialQuestions = [
    'どのようなことでお悩みですか？',
    '今日はどんなことをお話ししたいですか？',
    'どのような変化を求めていますか？'
  ];
  
  return {
    aiResponse: welcomeMessage,
    nextQuestions: initialQuestions
  };
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
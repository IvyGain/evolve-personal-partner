/**
 * BytePlus ModelArk AI Service
 * OpenAI互換のAPIを使用してBytePlusのAIモデルと統合
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// 型定義
export interface CoachingContext {
  sessionHistory: Array<{
    speaker: string;
    content: string;
    created_at: string;
  }>;
  userGoals: Array<{
    id: string;
    raw_goal: string;
    smart_goal: string;
    category: string;
    priority: number;
    status: string;
  }>;
  behaviorStage: string;
  userProfile?: any;
  currentGoals?: any[];
}

export interface AIResponse {
  content: string;
  nextQuestions: string[];
  emotionalTone: string;
  confidence: number;
}

export class BytePlusAIService {
  private static instance: BytePlusAIService;
  private client: OpenAI;
  private modelEndpoint: string;

  private constructor() {
    this.client = new OpenAI({
      apiKey: process.env.BYTEPLUS_API_KEY,
      baseURL: process.env.BYTEPLUS_BASE_URL || 'https://ark.ap-southeast.bytepluses.com/api/v3',
    });
    
    this.modelEndpoint = process.env.BYTEPLUS_MODEL_ENDPOINT || 'doubao-lite-4k';
  }

  public static getInstance(): BytePlusAIService {
    if (!BytePlusAIService.instance) {
      BytePlusAIService.instance = new BytePlusAIService();
    }
    return BytePlusAIService.instance;
  }

  /**
   * コーチング応答を生成
   */
  async generateCoachingResponse(
    userInput: string,
    context: CoachingContext
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const conversationHistory = this.buildConversationHistory(context.sessionHistory);

      const completion = await this.client.chat.completions.create({
        model: this.modelEndpoint, // BytePlusのDoubaoモデル
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userInput }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
      });

      const aiContent = completion.choices[0]?.message?.content || '';
      
      // AI応答を解析して構造化
      const response = this.parseAIResponse(aiContent, context);
      
      return response;
    } catch (error) {
      console.error('BytePlus AI API Error:', error);
      
      // フォールバック応答
      return {
        content: '申し訳ございません。現在AIサービスに接続できません。しばらく後にもう一度お試しください。',
        nextQuestions: ['他にお手伝いできることはありますか？'],
        emotionalTone: 'supportive',
        confidence: 0.5
      };
    }
  }

  /**
   * システムプロンプトを構築
   */
  private buildSystemPrompt(context: CoachingContext): string {
    return `あなたは「EVOLVE」のAIコーチです。ユーザーの個人的な成長と目標達成をサポートする専門的なコーチとして振る舞ってください。

## あなたの役割
- 共感的で支援的なコーチング
- GROWモデル（Goal, Reality, Options, Will）に基づく質問
- 行動変容理論を活用した段階的サポート
- ユーザーの感情に寄り添った応答

## 現在のユーザー状況
- 行動変容ステージ: ${context.behaviorStage}
- 設定済み目標数: ${context.currentGoals.length}

## 応答ガイドライン
1. 温かく共感的な口調を使用
2. 具体的で実行可能なアドバイスを提供
3. ユーザーの自主性を尊重
4. 小さな成功を認めて励ます
5. 必要に応じて適切な質問で深掘り

## 応答形式
応答は以下の形式で構造化してください：
CONTENT: [メインの応答内容]
QUESTIONS: [次の質問候補（3つまで、|で区切り）]
TONE: [emotional_tone: supportive/encouraging/empathetic/motivational]
CONFIDENCE: [0.0-1.0の信頼度]

日本語で応答してください。`;
  }

  /**
   * 会話履歴を構築
   */
  private buildConversationHistory(sessionHistory: any[]): any[] {
    return sessionHistory.slice(-10).map(msg => ({
      role: msg.speaker === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  /**
   * AI応答を解析して構造化
   */
  private parseAIResponse(aiContent: string, context: CoachingContext): AIResponse {
    // 構造化された応答を解析
    const contentMatch = aiContent.match(/CONTENT:\s*(.*?)(?=QUESTIONS:|TONE:|CONFIDENCE:|$)/s);
    const questionsMatch = aiContent.match(/QUESTIONS:\s*(.*?)(?=TONE:|CONFIDENCE:|$)/s);
    const toneMatch = aiContent.match(/TONE:\s*(.*?)(?=CONFIDENCE:|$)/s);
    const confidenceMatch = aiContent.match(/CONFIDENCE:\s*([\d.]+)/);

    const content = contentMatch?.[1]?.trim() || aiContent;
    const questionsText = questionsMatch?.[1]?.trim() || '';
    const nextQuestions = questionsText ? questionsText.split('|').map(q => q.trim()).filter(q => q) : [];
    const emotionalTone = toneMatch?.[1]?.trim() || 'supportive';
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.8;

    return {
      content,
      nextQuestions: nextQuestions.slice(0, 3), // 最大3つまで
      emotionalTone,
      confidence
    };
  }

  /**
   * 感情分析
   */
  async analyzeEmotion(text: string): Promise<any> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelEndpoint, // BytePlusのDoubaoモデル
        messages: [
          {
            role: 'system',
            content: `以下のテキストの感情を分析し、JSON形式で返してください。
            形式: {"primary_emotion": "joy/sadness/anger/fear/surprise/neutral", "intensity": 0.0-1.0, "secondary_emotions": ["emotion1", "emotion2"]}`
          },
          { role: 'user', content: text }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const result = completion.choices[0]?.message?.content;
      return JSON.parse(result || '{"primary_emotion": "neutral", "intensity": 0.5, "secondary_emotions": []}');
    } catch (error) {
      console.error('Emotion analysis error:', error);
      return {
        primary_emotion: 'neutral',
        intensity: 0.5,
        secondary_emotions: []
      };
    }
  }

  /**
   * 目標をSMART形式に変換
   */
  async convertToSmartGoal(rawGoal: string): Promise<any> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelEndpoint, // BytePlusのDoubaoモデル
        messages: [
          {
            role: 'system',
            content: `以下の目標をSMART形式（Specific, Measurable, Achievable, Relevant, Time-bound）に変換してください。
            JSON形式で返してください：
            {
              "specific": "具体的な目標",
              "measurable": "測定可能な指標",
              "achievable": "達成可能性の評価",
              "relevant": "関連性と重要性",
              "timebound": "期限設定"
            }`
          },
          { role: 'user', content: `目標: ${rawGoal}` }
        ],
        max_tokens: 500,
        temperature: 0.5,
      });

      const result = completion.choices[0]?.message?.content;
      return JSON.parse(result || '{}');
    } catch (error) {
      console.error('SMART goal conversion error:', error);
      return {
        specific: rawGoal,
        measurable: '進捗を定期的に確認',
        achievable: '段階的に取り組む',
        relevant: '個人の成長に重要',
        timebound: '適切な期限を設定'
      };
    }
  }

  /**
   * 行動変容ステージを判定
   */
  async assessBehaviorChangeStage(userInput: string, context: any): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelEndpoint, // BytePlusのDoubaoモデル
        messages: [
          {
            role: 'system',
            content: `ユーザーの発言から行動変容ステージを判定してください。
            以下のいずれかを返してください：
            - precontemplation: 変化を考えていない
            - contemplation: 変化を考えている
            - preparation: 変化の準備をしている
            - action: 行動を開始している
            - maintenance: 行動を維持している
            
            ステージ名のみを返してください。`
          },
          { role: 'user', content: userInput }
        ],
        max_tokens: 50,
        temperature: 0.3,
      });

      const result = completion.choices[0]?.message?.content?.trim();
      const validStages = ['precontemplation', 'contemplation', 'preparation', 'action', 'maintenance'];
      
      return validStages.includes(result || '') ? result! : 'contemplation';
    } catch (error) {
      console.error('Behavior stage assessment error:', error);
      return 'contemplation';
    }
  }
}

export default BytePlusAIService;
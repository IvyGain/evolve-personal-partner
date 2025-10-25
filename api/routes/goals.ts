import express from 'express';
import { db } from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Goal, 
  SmartGoal, 
  ActionItem, 
  ApiResponse,
  HabitFormationPlan 
} from '../../shared/types.js';

const router = express.Router();

// 目標作成
router.post('/create', async (req, res) => {
  try {
    const { rawGoal, priority = 3, category = 'general' } = req.body;
    const userId = 'demo-user-001'; // MVPでは固定ユーザー

    // SMART目標に変換
    const smartGoal = convertToSmartGoal(rawGoal);
    
    // 目標をデータベースに保存
    const goalId = uuidv4();
    const insertGoal = db.prepare(`
      INSERT INTO goals (id, user_id, raw_goal, smart_goal, category, priority, target_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // 21日後を目標日に設定
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 21);

    insertGoal.run(
      goalId,
      userId,
      rawGoal,
      JSON.stringify(smartGoal),
      category,
      priority,
      targetDate.toISOString().split('T')[0]
    );

    // 21日間習慣形成プランを作成
    const habitPlan = create21DayHabitPlan(goalId, smartGoal);
    
    // アクションアイテムを作成
    const allActions = [...habitPlan.week1_actions, ...habitPlan.week2_actions, ...habitPlan.week3_actions];
    const insertAction = db.prepare(`
      INSERT INTO action_items (id, goal_id, description, sequence_order, estimated_minutes, difficulty_level, due_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    allActions.forEach((action, index) => {
      const actionId = uuidv4();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(index / 3) + 1); // 3日ごとに新しいアクション

      insertAction.run(
        actionId,
        goalId,
        action.description,
        action.sequence_order,
        action.estimated_minutes,
        action.difficulty_level,
        dueDate.toISOString().split('T')[0]
      );
    });

    // 作成された目標を取得
    const createdGoal: any = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId);
    const actionItems: any[] = db.prepare('SELECT * FROM action_items WHERE goal_id = ? ORDER BY sequence_order').all(goalId);

    const response: ApiResponse<{goal: Goal, actionPlan: ActionItem[], habitPlan: HabitFormationPlan}> = {
      success: true,
      data: {
        goal: {
          ...createdGoal,
          smart_goal: JSON.parse(createdGoal.smart_goal)
        } as Goal,
        actionPlan: actionItems as ActionItem[],
        habitPlan
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create goal'
    });
  }
});

// 目標一覧取得
router.get('/list', (req, res) => {
  try {
    const userId = 'demo-user-001';
    
    const goals = db.prepare(`
      SELECT g.*, 
             COUNT(ai.id) as total_actions,
             COUNT(CASE WHEN ai.status = 'completed' THEN 1 END) as completed_actions
      FROM goals g
      LEFT JOIN action_items ai ON g.id = ai.goal_id
      WHERE g.user_id = ? AND g.status = 'active'
      GROUP BY g.id
      ORDER BY g.priority DESC, g.created_at DESC
    `).all(userId);

    const goalsWithProgress = goals.map((goal: any) => ({
      ...goal,
      smart_goal: JSON.parse(goal.smart_goal),
      completion_rate: goal.total_actions > 0 ? (goal.completed_actions / goal.total_actions) * 100 : 0
    }));

    res.json({
      success: true,
      data: goalsWithProgress
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get goals'
    });
  }
});

// 目標詳細取得
router.get('/:goalId', (req, res) => {
  try {
    const { goalId } = req.params;
    
    const goal: any = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    const actionItems = db.prepare(`
      SELECT * FROM action_items 
      WHERE goal_id = ? 
      ORDER BY sequence_order
    `).all(goalId);

    const progressRecords = db.prepare(`
      SELECT * FROM progress_records 
      WHERE goal_id = ? 
      ORDER BY recorded_at DESC
    `).all(goalId);

    res.json({
      success: true,
      data: {
        goal: {
          ...goal,
          smart_goal: JSON.parse(goal.smart_goal)
        },
        actionItems,
        progressRecords
      }
    });
  } catch (error) {
    console.error('Get goal detail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get goal detail'
    });
  }
});

// 目標更新
router.put('/:goalId/update', (req, res) => {
  try {
    const { goalId } = req.params;
    const { raw_goal, smart_goal, priority, status, target_date } = req.body;

    const updateGoal = db.prepare(`
      UPDATE goals 
      SET raw_goal = COALESCE(?, raw_goal),
          smart_goal = COALESCE(?, smart_goal),
          priority = COALESCE(?, priority),
          status = COALESCE(?, status),
          target_date = COALESCE(?, target_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = updateGoal.run(
      raw_goal,
      smart_goal ? JSON.stringify(smart_goal) : null,
      priority,
      status,
      target_date,
      goalId
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    const updatedGoal: any = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId);

    res.json({
      success: true,
      data: {
        ...updatedGoal,
        smart_goal: JSON.parse(updatedGoal.smart_goal)
      }
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update goal'
    });
  }
});

// 今日のアクション取得
router.get('/actions/today', (req, res) => {
  try {
    const userId = 'demo-user-001';
    const today = new Date().toISOString().split('T')[0];

    const todayActions = db.prepare(`
      SELECT ai.*, g.raw_goal, g.category, g.priority
      FROM action_items ai
      JOIN goals g ON ai.goal_id = g.id
      WHERE g.user_id = ? 
        AND ai.due_date <= ?
        AND ai.status IN ('pending', 'in_progress')
      ORDER BY g.priority DESC, ai.sequence_order
      LIMIT 5
    `).all(userId, today);

    res.json({
      success: true,
      data: todayActions
    });
  } catch (error) {
    console.error('Get today actions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get today actions'
    });
  }
});

// アクション完了
router.post('/actions/:actionId/complete', (req, res) => {
  try {
    const { actionId } = req.params;
    const { reflection, emotional_state } = req.body;
    const userId = 'demo-user-001';

    // アクションアイテムを完了に更新
    const updateAction = db.prepare(`
      UPDATE action_items 
      SET status = 'completed' 
      WHERE id = ?
    `);
    
    const result = updateAction.run(actionId);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Action item not found'
      });
    }

    // 進捗記録を作成
    const action: any = db.prepare('SELECT * FROM action_items WHERE id = ?').get(actionId);
    const progressId = uuidv4();
    
    const insertProgress = db.prepare(`
      INSERT INTO progress_records (id, user_id, goal_id, action_item_id, completed, reflection, emotional_state) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertProgress.run(
      progressId,
      userId,
      action.goal_id,
      actionId,
      true,
      reflection || '',
      emotional_state || 7
    );

    // マイクロ達成を生成
    const achievement = generateMicroAchievement(action, userId);

    res.json({
      success: true,
      data: {
        action,
        achievement,
        message: 'アクションが完了しました！素晴らしい進歩です！'
      }
    });
  } catch (error) {
    console.error('Complete action error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete action'
    });
  }
});

// SMART目標変換関数
function convertToSmartGoal(rawGoal: string): SmartGoal {
  // 簡易的なルールベースのSMART変換
  // 実際のAI統合時にはより高度な変換を実装
  
  const smartGoal: SmartGoal = {
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timebound: ''
  };

  // キーワードベースの分析
  if (rawGoal.includes('健康') || rawGoal.includes('運動')) {
    smartGoal.specific = '毎日30分の運動と健康的な食事習慣';
    smartGoal.measurable = '週5日以上の運動実施、体重・体脂肪率の記録';
    smartGoal.achievable = '段階的に運動強度を上げ、無理のない範囲で継続';
    smartGoal.relevant = '長期的な健康維持と生活の質向上';
    smartGoal.timebound = '21日間で基本習慣を確立';
  } else if (rawGoal.includes('学習') || rawGoal.includes('勉強')) {
    smartGoal.specific = '毎日1時間の集中学習時間を確保';
    smartGoal.measurable = '学習時間の記録、理解度テストの実施';
    smartGoal.achievable = '現在のスケジュールに合わせた現実的な学習計画';
    smartGoal.relevant = 'スキルアップとキャリア発展';
    smartGoal.timebound = '21日間で学習習慣を定着';
  } else if (rawGoal.includes('仕事') || rawGoal.includes('キャリア')) {
    smartGoal.specific = '業務効率化と新しいスキルの習得';
    smartGoal.measurable = 'タスク完了率、新スキルの習得進捗';
    smartGoal.achievable = '現在の業務量を考慮した実現可能な目標設定';
    smartGoal.relevant = 'キャリアアップと職場での価値向上';
    smartGoal.timebound = '21日間で新しい働き方を確立';
  } else {
    // 一般的な目標の場合
    smartGoal.specific = `${rawGoal}を具体的な行動に分解`;
    smartGoal.measurable = '日々の進捗を数値で測定';
    smartGoal.achievable = '現実的で実行可能な計画';
    smartGoal.relevant = '個人の価値観と長期目標に合致';
    smartGoal.timebound = '21日間で習慣化を目指す';
  }

  return smartGoal;
}

// 21日間習慣形成プラン作成
function create21DayHabitPlan(goalId: string, smartGoal: SmartGoal): HabitFormationPlan {
  const baseActions = [
    { description: '目標の確認と意識づけ', minutes: 5, difficulty: 'easy' },
    { description: '小さな行動の実践', minutes: 15, difficulty: 'easy' },
    { description: '進捗の記録', minutes: 5, difficulty: 'easy' }
  ];

  const week1Actions: ActionItem[] = baseActions.map((action, index) => ({
    id: uuidv4(),
    goal_id: goalId,
    description: `Week1: ${action.description}（意識的実行期）`,
    raw_goal: smartGoal.specific,
    priority: 3 as 1 | 2 | 3 | 4 | 5,
    sequence_order: index + 1,
    estimated_minutes: action.minutes,
    difficulty_level: action.difficulty as 'easy' | 'medium' | 'hard',
    status: 'pending',
    created_at: new Date().toISOString()
  }));

  const week2Actions: ActionItem[] = baseActions.map((action, index) => ({
    id: uuidv4(),
    goal_id: goalId,
    description: `Week2: ${action.description}（抵抗期・継続強化）`,
    raw_goal: smartGoal.specific,
    priority: 3 as 1 | 2 | 3 | 4 | 5,
    sequence_order: index + 8,
    estimated_minutes: action.minutes + 5,
    difficulty_level: 'medium',
    status: 'pending',
    created_at: new Date().toISOString()
  }));

  const week3Actions: ActionItem[] = baseActions.map((action, index) => ({
    id: uuidv4(),
    goal_id: goalId,
    description: `Week3: ${action.description}（習慣化期）`,
    raw_goal: smartGoal.specific,
    priority: 3 as 1 | 2 | 3 | 4 | 5,
    sequence_order: index + 15,
    estimated_minutes: action.minutes,
    difficulty_level: action.difficulty as 'easy' | 'medium' | 'hard',
    status: 'pending',
    created_at: new Date().toISOString()
  }));

  return {
    goal_id: goalId,
    week1_actions: week1Actions,
    week2_actions: week2Actions,
    week3_actions: week3Actions,
    daily_reminders: [
      '今日の小さな一歩を踏み出しましょう',
      '継続は力なり。今日も頑張りましょう',
      '習慣化まであと少し。今日も続けましょう'
    ],
    success_metrics: [
      '7日間連続実行',
      '14日間で80%以上の実行率',
      '21日間で習慣として定着'
    ]
  };
}

// マイクロ達成生成
function generateMicroAchievement(action: any, userId: string) {
  const achievements = [
    { title: '第一歩達成！', description: '最初のアクションを完了しました', points: 10 },
    { title: '継続の力！', description: 'アクションを継続しています', points: 15 },
    { title: '習慣の芽！', description: '新しい習慣が育っています', points: 20 },
    { title: '成長実感！', description: '着実に成長を続けています', points: 25 }
  ];

  const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];

  return {
    id: uuidv4(),
    user_id: userId,
    title: randomAchievement.title,
    description: randomAchievement.description,
    action_description: action.description || 'アクション完了',
    raw_goal: action.raw_goal || '目標達成',
    points: randomAchievement.points,
    achieved_at: new Date().toISOString(),
    recorded_at: new Date().toISOString(),
    category: 'daily' as const
  };
}

export default router;
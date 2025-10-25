import express from 'express';
import { db } from '../database/database.js';
import type { DashboardData, ApiResponse } from '../../shared/types.js';

const router = express.Router();

// ダッシュボードデータ取得
router.get('/data', (req, res) => {
  try {
    const userId = 'demo-user-001'; // MVPでは固定ユーザー
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    // 基本統計
    const totalGoals = (db.prepare(`
      SELECT COUNT(*) as count FROM goals 
      WHERE user_id = ? AND status = 'active'
    `).get(userId) as any)?.count || 0;

    const completedGoals = (db.prepare(`
      SELECT COUNT(*) as count FROM goals 
      WHERE user_id = ? AND status = 'completed'
    `).get(userId) as any)?.count || 0;

    const totalActions = (db.prepare(`
      SELECT COUNT(*) as count FROM action_items ai
      JOIN goals g ON ai.goal_id = g.id
      WHERE g.user_id = ?
    `).get(userId) as any)?.count || 0;

    const completedActions = (db.prepare(`
      SELECT COUNT(*) as count FROM action_items ai
      JOIN goals g ON ai.goal_id = g.id
      WHERE g.user_id = ? AND ai.status = 'completed'
    `).get(userId) as any)?.count || 0;

    // 今日のアクション
    const todayActions = db.prepare(`
      SELECT ai.*, g.raw_goal, g.category, g.priority
      FROM action_items ai
      JOIN goals g ON ai.goal_id = g.id
      WHERE g.user_id = ? 
        AND ai.due_date <= ?
        AND ai.status IN ('pending', 'in_progress')
      ORDER BY g.priority DESC, ai.sequence_order
      LIMIT 3
    `).all(userId, today);

    // 週間進捗
    const weeklyProgress = db.prepare(`
      SELECT 
        DATE(pr.recorded_at) as date,
        COUNT(*) as completed_actions,
        AVG(pr.emotional_state) as avg_emotional_state
      FROM progress_records pr
      JOIN goals g ON pr.goal_id = g.id
      WHERE g.user_id = ? 
        AND pr.recorded_at >= ?
        AND pr.completed = 1
      GROUP BY DATE(pr.recorded_at)
      ORDER BY date
    `).all(userId, weekAgoStr);

    // アクティブな目標
    const activeGoals = db.prepare(`
      SELECT g.*, 
             COUNT(ai.id) as total_actions,
             COUNT(CASE WHEN ai.status = 'completed' THEN 1 END) as completed_actions
      FROM goals g
      LEFT JOIN action_items ai ON g.id = ai.goal_id
      WHERE g.user_id = ? AND g.status = 'active'
      GROUP BY g.id
      ORDER BY g.priority DESC
      LIMIT 5
    `).all(userId);

    const activeGoalsWithProgress = activeGoals.map((goal: any) => ({
      ...goal,
      smart_goal: JSON.parse(goal.smart_goal),
      completion_rate: goal.total_actions > 0 ? (goal.completed_actions / goal.total_actions) * 100 : 0
    }));

    // 最近の達成
    const recentAchievementsRaw = db.prepare(`
      SELECT pr.*, ai.description as action_description, g.raw_goal
      FROM progress_records pr
      JOIN action_items ai ON pr.action_item_id = ai.id
      JOIN goals g ON pr.goal_id = g.id
      WHERE pr.user_id = ? AND pr.completed = 1
      ORDER BY pr.recorded_at DESC
      LIMIT 5
    `).all(userId);

    const recentAchievements = recentAchievementsRaw.map((achievement: any) => ({
      id: achievement.id,
      user_id: achievement.user_id,
      title: '目標達成！',
      description: '素晴らしい進歩です！',
      action_description: achievement.action_description,
      raw_goal: achievement.raw_goal,
      points: 10,
      achieved_at: achievement.recorded_at,
      recorded_at: achievement.recorded_at,
      category: 'daily' as const
    }));

    // 感情状態の推移
    const emotionalTrendRaw = db.prepare(`
      SELECT 
        DATE(recorded_at) as date,
        AVG(emotional_state) as avg_emotional_state,
        COUNT(*) as record_count
      FROM progress_records
      WHERE user_id = ? AND recorded_at >= ?
      GROUP BY DATE(recorded_at)
      ORDER BY date
    `).all(userId, weekAgoStr);

    const emotionalTrend = emotionalTrendRaw.map((trend: any) => ({
      date: trend.date,
      dominant_emotion: trend.avg_emotional_state > 7 ? 'positive' : trend.avg_emotional_state > 5 ? 'neutral' : 'negative',
      average_score: trend.avg_emotional_state,
      avg_emotional_state: trend.avg_emotional_state
    }));

    // 行動変容ステージ分析
    const behaviorStageAnalysis = analyzeBehaviorChangeStage(userId);

    // 習慣形成進捗
    const habitProgress = analyzeHabitFormationProgress(userId);

    const dashboardData: DashboardData = {
      user: { 
        id: userId, 
        name: 'Demo User', 
        email: 'demo@example.com', 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        personality_profile: {
          openness: 0.5,
          conscientiousness: 0.5,
          extraversion: 0.5,
          agreeableness: 0.5,
          neuroticism: 0.5
        },
        preferences: {
          coaching_style: 'balanced' as const,
          session_length: 30,
          reminder_frequency: 'daily' as const
        }
      },
      activeGoals: activeGoalsWithProgress as any[],
      todayActions: todayActions as any[],
      progressSummary: {
        total_goals: totalGoals,
        completed_goals: completedGoals,
        active_goals: totalGoals - completedGoals,
        completion_rate: totalActions > 0 ? (completedActions / totalActions) * 100 : 0,
        streak_days: calculateCurrentStreak(userId),
        current_streak: calculateCurrentStreak(userId),
        total_sessions: totalActions,
        total_points: calculateTotalPoints(userId),
        average_session_duration: 30
      },
      recentSessions: [],
      overview: {
        total_goals: totalGoals,
        completed_goals: completedGoals,
        active_goals: totalGoals - completedGoals,
        completion_rate: totalActions > 0 ? (completedActions / totalActions) * 100 : 0,
        streak_days: calculateCurrentStreak(userId),
        current_streak: calculateCurrentStreak(userId),
        total_sessions: totalActions,
        total_points: calculateTotalPoints(userId),
        average_session_duration: 30
      },
      today_actions: todayActions as any[],
      active_goals: activeGoalsWithProgress as any[],
      recent_achievements: recentAchievements,
      emotional_trend: emotionalTrend,
      behavior_stage: behaviorStageAnalysis,
      habit_progress: habitProgress,
      motivational_message: generateMotivationalMessage(userId)
    };

    const response: ApiResponse<DashboardData> = {
      success: true,
      data: dashboardData
    };

    res.json(response);
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data'
    });
  }
});

// 週間レポート取得
router.get('/weekly-report', (req, res) => {
  try {
    const userId = 'demo-user-001';
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    // 週間統計
    const weeklyStats = db.prepare(`
      SELECT 
        COUNT(DISTINCT pr.goal_id) as active_goals,
        COUNT(*) as total_actions,
        AVG(pr.emotional_state) as avg_emotional_state,
        COUNT(DISTINCT DATE(pr.recorded_at)) as active_days
      FROM progress_records pr
      JOIN goals g ON pr.goal_id = g.id
      WHERE g.user_id = ? 
        AND pr.recorded_at >= ?
        AND pr.completed = 1
    `).get(userId, weekAgoStr);

    // カテゴリ別進捗
    const categoryProgress = db.prepare(`
      SELECT 
        g.category,
        COUNT(*) as completed_actions,
        AVG(pr.emotional_state) as avg_satisfaction
      FROM progress_records pr
      JOIN goals g ON pr.goal_id = g.id
      WHERE g.user_id = ? 
        AND pr.recorded_at >= ?
        AND pr.completed = 1
      GROUP BY g.category
    `).all(userId, weekAgoStr);

    // 改善提案
    const improvements = generateImprovementSuggestions(userId, weeklyStats);

    res.json({
      success: true,
      data: {
        period: `${weekAgoStr} - ${new Date().toISOString().split('T')[0]}`,
        stats: weeklyStats,
        category_progress: categoryProgress,
        improvements: improvements,
        next_week_focus: generateNextWeekFocus(userId)
      }
    });
  } catch (error) {
    console.error('Weekly report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate weekly report'
    });
  }
});

// 行動変容ステージ分析
function analyzeBehaviorChangeStage(userId: string) {
  const recentActions = db.prepare(`
    SELECT pr.*, ai.difficulty_level
    FROM progress_records pr
    JOIN action_items ai ON pr.action_item_id = ai.id
    JOIN goals g ON pr.goal_id = g.id
    WHERE g.user_id = ? 
      AND pr.recorded_at >= date('now', '-7 days')
    ORDER BY pr.recorded_at DESC
  `).all(userId);

  if (recentActions.length === 0) {
    return {
      stage: 'precontemplation' as const,
      current_stage: 'precontemplation',
      stage_description: 'まだ行動変容の準備段階です',
      next_stage_tips: ['小さな目標から始めてみましょう', '変化の必要性を認識することから始めます'],
      confidence_level: 3,
      motivation_level: 3,
      barriers: ['時間不足', '習慣化の難しさ'],
      facilitators: ['小さな目標設定', 'サポートシステム']
    };
  }

  const completionRate = recentActions.filter((a: any) => a.completed).length / recentActions.length;
  const totalEmotionalState = Number(recentActions.reduce((sum: number, a: any) => sum + Number(a.emotional_state || 0), 0));
  const avgEmotionalState = recentActions.length > 0 ? totalEmotionalState / Number(recentActions.length) : 0;
  const consistentDays = new Set(recentActions.map((a: any) => a.recorded_at.split('T')[0])).size;

  let stage: 'precontemplation' | 'contemplation' | 'preparation' | 'action' | 'maintenance';
  let description: string;
  let tips: string[];

  if (completionRate < 0.3) {
    stage = 'contemplation';
    description = '変化を考え始めている段階です';
    tips = ['具体的な行動計画を立てましょう', '小さな成功体験を積み重ねましょう'];
  } else if (completionRate < 0.6 || consistentDays < 3) {
    stage = 'preparation';
    description = '行動の準備が整ってきています';
    tips = ['環境を整えて行動しやすくしましょう', '支援システムを活用しましょう'];
  } else if (consistentDays < 5 || avgEmotionalState < 6) {
    stage = 'action';
    description = '積極的に行動を起こしている段階です';
    tips = ['継続のための仕組みを作りましょう', '困難な時の対処法を準備しましょう'];
  } else {
    stage = 'maintenance';
    description = '新しい習慣が定着してきています';
    tips = ['長期的な維持戦略を考えましょう', '新しい挑戦を追加してみましょう'];
  }

  return {
    stage: stage,
    current_stage: stage,
    stage_description: description,
    next_stage_tips: tips,
    confidence_level: Math.round(avgEmotionalState),
    motivation_level: Math.round(completionRate / 10),
    barriers: completionRate < 50 ? ['継続の困難', '時間管理'] : ['モチベーション維持'],
    facilitators: ['習慣化システム', 'サポートコミュニティ', '進捗の可視化']
  };
}

// 習慣形成進捗分析
function analyzeHabitFormationProgress(userId: string) {
  const goals = db.prepare(`
    SELECT g.*, 
           COUNT(ai.id) as total_actions,
           COUNT(CASE WHEN ai.status = 'completed' THEN 1 END) as completed_actions,
           MIN(pr.recorded_at) as first_action_date,
           MAX(pr.recorded_at) as last_action_date
    FROM goals g
    LEFT JOIN action_items ai ON g.id = ai.goal_id
    LEFT JOIN progress_records pr ON g.id = pr.goal_id AND pr.completed = 1
    WHERE g.user_id = ? AND g.status = 'active'
    GROUP BY g.id
  `).all(userId);

  return goals.map((goal: any) => {
    const daysSinceStart = goal.first_action_date ? 
      Math.floor((new Date().getTime() - new Date(goal.first_action_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const completionRate = goal.total_actions > 0 ? (goal.completed_actions / goal.total_actions) * 100 : 0;
    
    let phase: 'initiation' | 'learning' | 'stabilization';
    let phaseDescription: string;

    if (daysSinceStart < 7) {
      phase = 'initiation';
      phaseDescription = '習慣形成の開始期（1-7日目）';
    } else if (daysSinceStart < 14) {
      phase = 'learning';
      phaseDescription = '習慣学習期（8-14日目）';
    } else {
      phase = 'stabilization';
      phaseDescription = '習慣安定期（15-21日目）';
    }

    return {
      goal_id: goal.id,
      habit_name: goal.raw_goal,
      goal_title: goal.raw_goal,
      current_streak: Math.floor(completionRate / 10), // 簡易計算
      target_days: 21,
      completion_rate: completionRate,
      days_since_start: daysSinceStart,
      habit_strength: Math.min(100, (daysSinceStart * 4.76) + (completionRate * 0.5)), // 21日で100%
      phase_description: phaseDescription
    };
  });
}

// 現在の連続記録計算
function calculateCurrentStreak(userId: string): number {
  const recentRecords = db.prepare(`
    SELECT DISTINCT DATE(recorded_at) as date
    FROM progress_records pr
    JOIN goals g ON pr.goal_id = g.id
    WHERE g.user_id = ? AND pr.completed = 1
    ORDER BY date DESC
    LIMIT 30
  `).all(userId);

  if (recentRecords.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let currentDate = new Date();

  for (const record of recentRecords) {
    const recordDate = (record as any).date;
    const checkDate = currentDate.toISOString().split('T')[0];
    
    if (recordDate === checkDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// 総ポイント計算
function calculateTotalPoints(userId: string): number {
  const result: any = db.prepare(`
    SELECT COUNT(*) * 10 as points
    FROM progress_records pr
    JOIN goals g ON pr.goal_id = g.id
    WHERE g.user_id = ? AND pr.completed = 1
  `).get(userId);

  return result?.points || 0;
}

// モチベーションメッセージ生成
function generateMotivationalMessage(userId: string): string {
  const streak = calculateCurrentStreak(userId);
  const totalPoints = calculateTotalPoints(userId);
  
  const messages = [
    `${streak}日連続で頑張っています！この調子で続けましょう！`,
    `これまでに${totalPoints}ポイント獲得しました！素晴らしい成果です！`,
    '小さな一歩の積み重ねが大きな変化を生み出します',
    '今日も新しい自分に向かって一歩前進しましょう',
    '継続は力なり。あなたの努力は必ず実を結びます'
  ];

  if (streak > 7) {
    return `🎉 ${streak}日連続達成！習慣化への道のりを着実に歩んでいます！`;
  } else if (totalPoints > 100) {
    return `⭐ ${totalPoints}ポイント達成！継続的な努力が素晴らしい結果を生んでいます！`;
  } else {
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// 改善提案生成
function generateImprovementSuggestions(userId: string, weeklyStats: any): string[] {
  const suggestions: string[] = [];

  if (weeklyStats.active_days < 5) {
    suggestions.push('週5日以上の活動を目指しましょう。小さな行動でも継続が重要です。');
  }

  if (weeklyStats.avg_emotional_state < 6) {
    suggestions.push('感情状態の改善に注目しましょう。楽しめる活動を取り入れてみてください。');
  }

  if (weeklyStats.total_actions < 10) {
    suggestions.push('より多くの小さなアクションを設定して、成功体験を増やしましょう。');
  }

  if (suggestions.length === 0) {
    suggestions.push('素晴らしい進捗です！この調子で新しい挑戦を追加してみましょう。');
  }

  return suggestions;
}

// 来週のフォーカス生成
function generateNextWeekFocus(userId: string): string[] {
  return [
    '最も重要な目標に集中する',
    '新しい習慣を1つ追加する',
    '感情状態の記録を継続する',
    '週末に振り返りの時間を作る'
  ];
}

export default router;
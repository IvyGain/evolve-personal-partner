import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  Star,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import type { Goal, ActionItem } from '../../shared/types';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [todayActions, setTodayActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchGoals();
    fetchTodayActions();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals/list');
      const result = await response.json();
      if (result.success) {
        setGoals(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      toast.error('目標の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayActions = async () => {
    try {
      const response = await fetch('/api/goals/actions/today');
      const result = await response.json();
      if (result.success) {
        setTodayActions(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch today actions:', error);
    }
  };

  const createGoal = async () => {
    if (!newGoal.trim()) {
      toast.error('目標を入力してください');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/goals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawGoal: newGoal,
          priority: 3,
          category: 'general'
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('目標が作成されました！21日間の習慣形成プランも準備完了です。');
        setNewGoal('');
        setShowCreateForm(false);
        fetchGoals();
        fetchTodayActions();
      } else {
        toast.error('目標の作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error('目標の作成に失敗しました');
    } finally {
      setCreating(false);
    }
  };

  const completeAction = async (actionId: string) => {
    try {
      const response = await fetch(`/api/goals/actions/${actionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reflection: '今日も一歩前進しました！',
          emotional_state: 8
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.data.message);
        fetchTodayActions();
        fetchGoals();
      } else {
        toast.error('アクションの完了に失敗しました');
      }
    } catch (error) {
      console.error('Failed to complete action:', error);
      toast.error('アクションの完了に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">目標管理</h1>
          <p className="text-lg text-gray-600 mt-2">
            SMART目標設定と21日間習慣形成プログラム
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>新しい目標</span>
        </button>
      </motion.div>

      {/* Create Goal Form */}
      {showCreateForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">新しい目標を作成</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  あなたの目標を自由に入力してください
                </label>
                <textarea
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="例: 健康的な生活習慣を身につけたい、新しいスキルを学びたい、運動を習慣化したい..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>AIが自動で以下を行います:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• SMART目標への変換（具体的・測定可能・達成可能・関連性・期限）</li>
                  <li>• 21日間の習慣形成プランの作成</li>
                  <li>• 段階的なアクションアイテムの生成</li>
                  <li>• 行動変容理論に基づいた進捗管理</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={createGoal}
                  disabled={creating}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {creating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Target className="w-4 h-4" />
                  )}
                  <span>{creating ? '作成中...' : '目標を作成'}</span>
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Today's Actions */}
      {todayActions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">今日のアクション</h2>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {todayActions.length}件
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="group p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      action.priority === 5 ? 'bg-red-500' :
                      action.priority === 4 ? 'bg-orange-500' :
                      action.priority === 3 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-xs text-gray-500">{action.estimated_minutes}分</span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">{action.description}</h3>
                    <p className="text-sm text-gray-600">{action.raw_goal}</p>
                  </div>

                  <button
                    onClick={() => completeAction(action.id)}
                    className="w-full flex items-center justify-center space-x-2 bg-white text-orange-600 py-2 px-4 rounded-lg font-medium hover:bg-orange-50 transition-colors group-hover:shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>完了</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Goals List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">あなたの目標</h2>
        </div>

        {goals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {goal.raw_goal}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(goal.target_date).toLocaleDateString('ja-JP')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span className="capitalize">{goal.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      goal.priority === 5 ? 'bg-red-500' :
                      goal.priority === 4 ? 'bg-orange-500' :
                      goal.priority === 3 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">進捗</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(goal.completion_rate)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${goal.completion_rate}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{goal.completed_actions}/{goal.total_actions} アクション完了</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>順調</span>
                      </div>
                    </div>
                  </div>

                  {/* SMART Goal Preview */}
                  {goal.smart_goal && (
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <p className="text-sm font-medium text-purple-800 mb-2">SMART目標</p>
                      <p className="text-sm text-purple-700">
                        {goal.smart_goal.specific}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <span>詳細を見る</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              まだ目標が設定されていません
            </h3>
            <p className="text-gray-600 mb-6">
              最初の目標を作成して、あなたの進化の旅を始めましょう！
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>最初の目標を作成</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
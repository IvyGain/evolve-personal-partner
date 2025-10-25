import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  MessageCircle, 
  BarChart3, 
  Brain, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'AIコーチング',
      description: 'GROWモデルに基づいた科学的なコーチング対話',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Target,
      title: 'SMART目標設定',
      description: '曖昧な目標を具体的で達成可能な目標に変換',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: '21日間習慣形成',
      description: '科学的根拠に基づいた習慣化プログラム',
      color: 'from-cyan-500 to-green-500'
    },
    {
      icon: Heart,
      title: '感情分析',
      description: '行動と感情の関係を可視化して最適化',
      color: 'from-green-500 to-yellow-500'
    }
  ];

  const benefits = [
    '5段階行動変容理論に基づいた段階的アプローチ',
    'マイクロ達成システムでモチベーション維持',
    'リアルタイム進捗追跡とフィードバック',
    '音声対話による自然なコーチング体験'
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center space-x-3"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                EVOLVE
              </h1>
              <p className="text-lg text-gray-600">Personal Evolution Partner</p>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            科学的根拠に基づいた最先端のAIコーチングで、
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
              あなたの理想の自分への進化をサポート
            </span>
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/coaching"
            className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span>AIコーチングを始める</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105"
          >
            <BarChart3 className="w-5 h-5" />
            <span>ダッシュボードを見る</span>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            科学的アプローチによる
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              パーソナル進化
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            最新のコーチング理論とAI技術を組み合わせた、あなただけの成長プログラム
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                  なぜEVOLVEなのか？
                </h3>
              </div>
              <p className="text-lg text-gray-600">
                単なる目標管理ツールではありません。科学的根拠に基づいた行動変容理論を活用し、
                持続可能な成長をサポートします。
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 text-center space-y-6"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-gray-800">
                  今すぐ始めよう
                </h4>
                <p className="text-gray-600">
                  わずか2分で、あなたの進化の旅が始まります
                </p>
              </div>
              <Link
                to="/goals"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Target className="w-5 h-5" />
                <span>目標を設定する</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="text-center bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-12 text-white"
      >
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            あなたの進化を今日から始めませんか？
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            科学的根拠に基づいたAIコーチングで、理想の自分への道のりをサポートします
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/coaching"
              className="flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>無料でコーチングを体験</span>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Hidden Architecture Link */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
        className="text-center pt-8"
      >
        <Link
          to="/architecture"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-300 opacity-50 hover:opacity-100"
        >
          ・
        </Link>
      </motion.div>
    </div>
  );
}
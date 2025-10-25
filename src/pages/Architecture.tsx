import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Heart, 
  Zap,
  Database,
  Server,
  Globe,
  Code,
  Layers,
  GitBranch,
  MessageSquare,
  BarChart3,
  Shield,
  Cpu,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Mic,
  Eye,
  Settings,
  Users,
  Cloud,
  Lock,
  Gauge,
  Workflow,
  Network,
  Headphones,
  Monitor,
  Smartphone,
  Wifi,
  Activity,
  Lightbulb,
  Rocket,
  Star,
  Zap as Lightning,
  Compass,
  Puzzle,
  Volume2,
  User
} from 'lucide-react';

export default function Architecture() {
  const philosophyPrinciples = [
    {
      title: "科学的根拠に基づく設計",
      description: "心理学・行動科学の研究成果を実装に反映",
      icon: Brain
    },
    {
      title: "持続可能な行動変容",
      description: "一時的な変化ではなく、長期的な習慣形成を重視",
      icon: TrendingUp
    },
    {
      title: "個人最適化",
      description: "ユーザーの感情・行動パターンに適応するAI",
      icon: Heart
    },
    {
      title: "シンプルな体験",
      description: "複雑な理論を直感的なインターフェースで提供",
      icon: Zap
    }
  ];

  const coachingTheories = [
    {
      name: "GROWモデル",
      description: "Goal（目標）、Reality（現実）、Options（選択肢）、Will（意志）の4段階で構造化された対話",
      application: "AIコーチングセッションの基本フレームワークとして実装",
      color: "from-purple-500 to-blue-500",
      status: "implemented",
      details: "セッション進行の自動管理、段階的質問生成、文脈保持機能"
    },
    {
      name: "5段階行動変容理論",
      description: "前熟考期→熟考期→準備期→実行期→維持期の段階的アプローチ",
      application: "ユーザーの変容段階を自動判定し、適切な介入を提供",
      color: "from-blue-500 to-cyan-500",
      status: "implemented",
      details: "行動パターン分析、段階判定アルゴリズム、個別化介入戦略"
    },
    {
      name: "21日間習慣形成理論",
      description: "神経可塑性に基づく習慣化メカニズムの活用",
      application: "マイクロ習慣の設計と進捗追跡システム",
      color: "from-cyan-500 to-green-500",
      status: "implemented",
      details: "習慣トラッキング、リマインダー機能、成功率予測"
    }
  ];

  const techStack = [
    {
      category: "フロントエンド",
      technologies: [
        { name: "React 18", status: "implemented", version: "18.2.0", description: "コンポーネントベースUI" },
        { name: "TypeScript", status: "implemented", version: "5.0+", description: "型安全性とDX向上" },
        { name: "Tailwind CSS", status: "implemented", version: "3.3+", description: "ユーティリティファーストCSS" },
        { name: "Framer Motion", status: "implemented", version: "10.0+", description: "アニメーション・トランジション" },
        { name: "Zustand", status: "implemented", version: "4.4+", description: "軽量状態管理" },
        { name: "React Query", status: "planned", version: "5.0+", description: "サーバー状態管理" },
        { name: "PWA Support", status: "planned", version: "-", description: "オフライン機能・プッシュ通知" }
      ],
      icon: Globe,
      color: "from-blue-500 to-purple-500"
    },
    {
      category: "バックエンド",
      technologies: [
        { name: "Node.js", status: "implemented", version: "20.0+", description: "JavaScript実行環境" },
        { name: "Express.js", status: "implemented", version: "4.18+", description: "Webアプリケーションフレームワーク" },
        { name: "TypeScript", status: "implemented", version: "5.0+", description: "型安全なサーバーサイド開発" },
        { name: "WebSocket", status: "implemented", version: "8.0+", description: "リアルタイム双方向通信" },
        { name: "RESTful API", status: "implemented", version: "-", description: "標準的なAPI設計" },
        { name: "GraphQL", status: "planned", version: "16.0+", description: "効率的なデータクエリ" },
        { name: "Microservices", status: "future", version: "-", description: "スケーラブルアーキテクチャ" }
      ],
      icon: Server,
      color: "from-green-500 to-blue-500"
    },
    {
      category: "データベース・ストレージ",
      technologies: [
        { name: "SQLite", status: "implemented", version: "3.40+", description: "軽量ローカルDB（開発用）" },
        { name: "In-memory Storage", status: "implemented", version: "-", description: "高速セッション管理" },
        { name: "PostgreSQL", status: "planned", version: "15.0+", description: "本格運用データベース" },
        { name: "Redis", status: "planned", version: "7.0+", description: "キャッシュ・セッション管理" },
        { name: "MinIO/S3", status: "planned", version: "-", description: "ファイル・音声データ保存" },
        { name: "Vector DB", status: "future", version: "-", description: "埋め込みベクトル検索" }
      ],
      icon: Database,
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "AI・音声・分析",
      technologies: [
        { name: "Web Speech API", status: "implemented", version: "Native", description: "ブラウザ音声認識・合成" },
        { name: "BytePlus AI SDK", status: "integration_ready", version: "Latest", description: "高度AI機能統合準備完了" },
        { name: "感情分析API", status: "basic", version: "Custom", description: "基本的な感情判定（BytePlus統合予定）" },
        { name: "自然言語処理", status: "basic", version: "Custom", description: "ルールベース（BytePlus NLP統合予定）" },
        { name: "音声感情認識", status: "planned", version: "BytePlus", description: "音声からの感情状態分析" },
        { name: "予測分析", status: "planned", version: "BytePlus", description: "行動パターン・成功確率予測" },
        { name: "パーソナライゼーション", status: "planned", version: "BytePlus", description: "個人特性に基づく最適化" }
      ],
      icon: Cpu,
      color: "from-orange-500 to-red-500"
    },
    {
      category: "インフラ・DevOps",
      technologies: [
        { name: "Vite", status: "implemented", version: "4.0+", description: "高速ビルドツール" },
        { name: "ESLint/Prettier", status: "implemented", version: "Latest", description: "コード品質管理" },
        { name: "Docker", status: "planned", version: "24.0+", description: "コンテナ化" },
        { name: "Kubernetes", status: "future", version: "1.28+", description: "オーケストレーション" },
        { name: "CI/CD Pipeline", status: "planned", version: "GitHub Actions", description: "自動デプロイ" },
        { name: "Monitoring", status: "planned", version: "Prometheus/Grafana", description: "システム監視" }
      ],
      icon: Settings,
      color: "from-gray-500 to-blue-500"
    }
  ];

  const bytePlusIntegration = [
    {
      service: "感情分析API",
      description: "音声・テキストから感情状態を高精度で分析し、コーチングの質を向上",
      currentStatus: "基本実装済み（ルールベース）",
      integrationStatus: "統合準備完了",
      plannedFeatures: [
        "リアルタイム音声感情認識",
        "多次元感情分析（喜び、悲しみ、怒り、恐れ、驚き、嫌悪）",
        "感情履歴分析・パターン認識",
        "文脈を考慮した感情理解",
        "感情変化の予測・早期警告"
      ],
      technicalDetails: {
        endpoint: "/api/emotion/analyze",
        inputFormats: ["audio/wav", "text/plain"],
        responseTime: "< 200ms",
        accuracy: "> 95%"
      },
      icon: Heart,
      color: "from-pink-500 to-red-500"
    },
    {
      service: "自然言語処理エンジン",
      description: "ユーザーの発言から意図・ニーズを深層理解し、適切な応答を生成",
      currentStatus: "基本実装済み（ルールベース）",
      integrationStatus: "統合準備完了",
      plannedFeatures: [
        "意図分類・エンティティ抽出",
        "文脈理解・対話履歴保持",
        "多言語対応（日本語・英語）",
        "専門用語・業界知識理解",
        "感情を考慮した応答生成"
      ],
      technicalDetails: {
        endpoint: "/api/nlp/process",
        models: ["BERT", "GPT-4", "Custom Fine-tuned"],
        languages: ["ja", "en"],
        contextWindow: "8K tokens"
      },
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500"
    },
    {
      service: "パーソナライゼーション",
      description: "個人の特性・学習スタイル・動機パターンに合わせたコーチング最適化",
      currentStatus: "未実装",
      integrationStatus: "設計完了",
      plannedFeatures: [
        "性格分析（Big Five等）",
        "学習スタイル判定",
        "動機パターン認識",
        "最適なコーチング手法選択",
        "個人化されたゴール設定支援"
      ],
      technicalDetails: {
        endpoint: "/api/personalization/profile",
        algorithms: ["Collaborative Filtering", "Content-based", "Hybrid"],
        updateFrequency: "Real-time",
        dataPoints: "100+ behavioral indicators"
      },
      icon: Users,
      color: "from-purple-500 to-blue-500"
    },
    {
      service: "予測分析システム",
      description: "行動パターンから成功確率・リスクを予測し、先回り支援を提供",
      currentStatus: "未実装",
      integrationStatus: "設計完了",
      plannedFeatures: [
        "目標達成確率予測",
        "挫折リスク早期検出",
        "最適なタイミング提案",
        "行動変容パターン分析",
        "長期的成果予測"
      ],
      technicalDetails: {
        endpoint: "/api/prediction/analyze",
        models: ["Time Series", "ML Classification", "Deep Learning"],
        accuracy: "> 85%",
        predictionHorizon: "1-90 days"
      },
      icon: BarChart3,
      color: "from-green-500 to-teal-500"
    },
    {
      service: "音声合成・対話",
      description: "自然で感情豊かな音声応答により、より人間らしいコーチング体験を実現",
      currentStatus: "基本実装済み（Web Speech API）",
      integrationStatus: "統合準備完了",
      plannedFeatures: [
        "感情を反映した音声合成",
        "個人の好みに合わせた声質調整",
        "多言語音声対応",
        "リアルタイム音声変換",
        "背景音・環境音の自動調整"
      ],
      technicalDetails: {
        endpoint: "/api/tts/synthesize",
        voices: ["Neural TTS", "Custom Voice Cloning"],
        latency: "< 100ms",
        quality: "48kHz/16bit"
      },
      icon: Headphones,
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const implementationRoadmap = [
    {
      phase: "Phase 1: AI基盤強化",
      timeline: "1-2週間",
      status: "in_progress",
      priority: "high",
      features: [
        "BytePlus AI SDK完全統合",
        "高度な感情分析実装",
        "音声感情認識追加",
        "NLP エンジン強化",
        "データベース最適化"
      ],
      technicalTasks: [
        "BytePlus API認証・設定",
        "感情分析パイプライン構築",
        "音声データ前処理実装",
        "リアルタイム分析最適化"
      ]
    },
    {
      phase: "Phase 2: パーソナライゼーション",
      timeline: "3-4週間",
      status: "planned",
      priority: "high",
      features: [
        "個人特性分析システム",
        "学習スタイル判定",
        "動機パターン認識",
        "カスタマイズされたコーチング",
        "予測分析基盤"
      ],
      technicalTasks: [
        "ユーザープロファイル設計",
        "機械学習モデル訓練",
        "推薦システム構築",
        "A/Bテスト基盤整備"
      ]
    },
    {
      phase: "Phase 3: スケーラビリティ",
      timeline: "5-6週間",
      status: "planned",
      priority: "medium",
      features: [
        "PostgreSQL移行",
        "Redis キャッシュ導入",
        "マイクロサービス化",
        "負荷分散システム",
        "CDN統合"
      ],
      technicalTasks: [
        "データベース移行スクリプト",
        "キャッシュ戦略実装",
        "サービス分離設計",
        "ロードバランサー設定"
      ]
    },
    {
      phase: "Phase 4: 高度機能・拡張",
      timeline: "7-8週間",
      status: "planned",
      priority: "medium",
      features: [
        "マルチモーダル分析",
        "グループコーチング機能",
        "外部連携API",
        "モバイルアプリ開発",
        "AR/VR統合検討"
      ],
      technicalTasks: [
        "画像・動画分析追加",
        "リアルタイム協調機能",
        "OAuth2.0統合",
        "React Native開発"
      ]
    }
  ];

  const voiceFeatures = [
    {
      name: "リアルタイム音声認識",
      status: "implemented",
      description: "Web Speech APIを使用した日本語音声認識",
      technicalDetails: "連続認識、中間結果表示、ノイズキャンセリング",
      icon: Mic,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "音声感情分析",
      status: "planned",
      description: "BytePlus AIによる音声からの感情状態分析",
      technicalDetails: "ピッチ・トーン・速度分析、感情スコア算出",
      icon: Heart,
      color: "from-pink-500 to-red-500"
    },
    {
      name: "自然な音声合成",
      status: "basic",
      description: "感情を反映した音声応答生成",
      technicalDetails: "Neural TTS、感情パラメータ調整、個人化音声",
      icon: Headphones,
      color: "from-purple-500 to-blue-500"
    },
    {
      name: "対話フロー制御",
      status: "implemented",
      description: "音声による自然な対話進行管理",
      technicalDetails: "発話タイミング検出、割り込み処理、文脈保持",
      icon: Workflow,
      color: "from-green-500 to-teal-500"
    }
  ];

  const differentiators = [
    "科学的根拠に基づく行動変容アプローチ",
    "BytePlus AI による高精度感情分析",
    "リアルタイム音声対話システム",
    "段階的な習慣形成プログラム",
    "マイクロ達成による継続的モチベーション",
    "プライバシー重視のローカル処理",
    "個人最適化されたコーチング手法",
    "予測分析による先回り支援",
    "多次元感情理解・文脈保持",
    "継続的学習・自己改善AI",
    "統合的行動変容理論の実装",
    "リアルタイム適応型インターフェース"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'basic':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'planned':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'integration_ready':
        return <Rocket className="w-4 h-4 text-blue-500" />;
      case 'future':
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'basic':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'planned':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'integration_ready':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'future':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'implemented':
        return '✅ 実装済み';
      case 'basic':
        return '🟡 基本実装';
      case 'planned':
        return '🚧 実装予定';
      case 'in_progress':
        return '⚡ 進行中';
      case 'integration_ready':
        return '🚀 統合準備完了';
      case 'future':
        return '📋 将来計画';
      default:
        return '⏳ 未定';
    }
  };

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              EVOLVE Architecture
            </h1>
            <p className="text-lg text-gray-600">設計思想と技術アーキテクチャ</p>
          </div>
        </div>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          科学的根拠に基づく行動変容理論と最新のAI技術を融合した、
          次世代パーソナルコーチングシステムの設計哲学
        </p>
        
        {/* Status Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { status: 'implemented', label: '実装済み' },
            { status: 'integration_ready', label: '統合準備完了' },
            { status: 'basic', label: '基本実装' },
            { status: 'planned', label: '実装予定' },
            { status: 'future', label: '将来計画' }
          ].map((item) => (
            <div key={item.status} className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
              {getStatusIcon(item.status)}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Product Vision & Philosophy */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">プロダクトビジョン</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            EVOLVEは単なる目標管理ツールではありません。心理学・行動科学の研究成果を基盤とし、
            個人の内発的動機を引き出し、持続可能な行動変容を支援するAIパートナーです。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {philosophyPrinciples.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {principle.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Coaching Theories */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">統合コーチング理論</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            複数の実証済みコーチング手法を組み合わせ、個人の成長段階に応じた最適なアプローチを提供
          </p>
        </div>

        <div className="space-y-6">
          {coachingTheories.map((theory, index) => (
            <motion.div
              key={theory.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${theory.color} text-white rounded-full text-sm font-semibold`}>
                      {theory.name}
                    </div>
                    {getStatusIcon(theory.status)}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(theory.status)}`}>
                    {getStatusLabel(theory.status)}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">理論概要</h4>
                  <p className="text-gray-600 text-sm">{theory.description}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">実装方法</h4>
                  <p className="text-gray-600 text-sm">{theory.application}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">技術詳細</h4>
                  <p className="text-gray-600 text-sm">{theory.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* BytePlus AI Integration */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-800">BytePlus AI SDK 統合計画</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            高度なAI機能により、より精密で個人最適化されたコーチング体験を実現
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {bytePlusIntegration.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.service}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{service.service}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">現在の状況</h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('basic')}`}>
                        {service.currentStatus}
                      </span>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('integration_ready')}`}>
                          {service.integrationStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">技術仕様</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>エンドポイント: <code className="bg-gray-100 px-1 rounded">{service.technicalDetails.endpoint}</code></div>
                        {service.technicalDetails.responseTime && (
                          <div>応答時間: {service.technicalDetails.responseTime}</div>
                        )}
                        {service.technicalDetails.accuracy && (
                          <div>精度: {service.technicalDetails.accuracy}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">実装予定機能</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.plannedFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <Rocket className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Technical Architecture */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">技術スタック詳細</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            実装済み機能と予定機能を明確に区別した技術構成
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {techStack.map((stack, index) => {
            const Icon = stack.icon;
            return (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stack.color} rounded-xl mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {stack.category}
                </h3>
                <div className="space-y-3">
                  {stack.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">{tech.name}</span>
                          {tech.version && tech.version !== '-' && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {tech.version}
                            </span>
                          )}
                        </div>
                        {getStatusIcon(tech.status)}
                      </div>
                      <p className="text-xs text-gray-600 pl-0">{tech.description}</p>
                      <div className="flex items-center space-x-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(tech.status)}`}>
                          {getStatusLabel(tech.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Voice Function Details */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Mic className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl font-bold text-gray-800">音声機能アーキテクチャ</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Web Speech APIとBytePlus AI SDKを組み合わせた高度な音声処理システム
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current Voice Implementation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">実装済み音声機能</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-green-500" />
                    <span>Web Speech API</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• リアルタイム日本語音声認識</li>
                    <li>• 連続音声入力対応</li>
                    <li>• 中間結果表示機能</li>
                    <li>• ブラウザ互換性チェック</li>
                    <li>• マイクアクセス権限管理</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-green-500" />
                    <span>音声出力</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Text-to-Speech機能</li>
                    <li>• 日本語音声合成</li>
                    <li>• 音声速度調整</li>
                    <li>• 音声停止・再開制御</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Planned Voice Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">予定音声機能</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-orange-500" />
                    <span>BytePlus音声AI</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 高精度音声認識エンジン</li>
                    <li>• 自然な音声合成</li>
                    <li>• 音声感情分析</li>
                    <li>• 話者識別機能</li>
                    <li>• ノイズキャンセリング</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-orange-500" />
                    <span>感情認識</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 音声トーン分析</li>
                    <li>• ストレスレベル検出</li>
                    <li>• 感情状態推定</li>
                    <li>• リアルタイム感情フィードバック</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Voice Processing Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.8 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-blue-500" />
            <span>音声処理フロー</span>
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Mic className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="font-semibold text-gray-800">音声入力</h4>
              <p className="text-sm text-gray-600">マイクからの音声キャプチャ</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="font-semibold text-gray-800">AI処理</h4>
              <p className="text-sm text-gray-600">音声認識・感情分析</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="font-semibold text-gray-800">応答生成</h4>
              <p className="text-sm text-gray-600">コンテキスト考慮応答</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Volume2 className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-800">音声出力</h4>
              <p className="text-sm text-gray-600">自然な音声合成</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Implementation Roadmap */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <GitBranch className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800">段階的実装ロードマップ</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            計画的な機能拡張により、安定性を保ちながら高度なAI機能を段階的に導入
          </p>
        </div>

        <div className="space-y-8">
          {implementationRoadmap.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 2.0 + index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getStatusColor(phase.status)}`}>
                        <span className="text-xl font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-gray-800">{phase.phase}</h3>
                      <div className="flex items-center space-x-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(phase.status)}`}>
                          {getStatusLabel(phase.status)}
                        </span>
                        <span className="text-sm text-gray-600">期間: {phase.timeline}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          phase.priority === 'high' ? 'text-red-600 bg-red-50 border-red-200' : 'text-blue-600 bg-blue-50 border-blue-200'
                        }`}>
                          優先度: {phase.priority === 'high' ? '高' : '中'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span>主要機能</span>
                    </h4>
                    <div className="space-y-3">
                      {phase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          {phase.status === 'in_progress' ? (
                            <Lightning className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Rocket className="w-4 h-4 text-orange-500" />
                          )}
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <Code className="w-5 h-5 text-green-500" />
                      <span>技術タスク</span>
                    </h4>
                    <div className="space-y-3">
                      {phase.technicalTasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center space-x-3">
                          <Settings className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600 text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Enhanced System Architecture Diagram */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
      >
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">拡張システム構成図</h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            {/* Main Architecture Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mb-8">
              {/* Frontend */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Frontend</h3>
                  <p className="text-sm text-gray-600">React + TypeScript</p>
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto mt-1" />
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400 mx-auto hidden md:block" />

              {/* Backend */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mx-auto">
                  <Server className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Backend</h3>
                  <p className="text-sm text-gray-600">Node.js + Express</p>
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto mt-1" />
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400 mx-auto hidden md:block" />

              {/* Database */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Database</h3>
                  <p className="text-sm text-gray-600">SQLite → PostgreSQL</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* External Services */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">外部サービス統合</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mx-auto">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">BytePlus AI</h4>
                    <p className="text-sm text-gray-600">感情分析・NLP</p>
                    <AlertTriangle className="w-4 h-4 text-orange-500 mx-auto mt-1" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mx-auto">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Web Speech API</h4>
                    <p className="text-sm text-gray-600">音声認識・合成</p>
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto mt-1" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto">
                    <Cloud className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">クラウドサービス</h4>
                    <p className="text-sm text-gray-600">スケーリング・監視</p>
                    <AlertTriangle className="w-4 h-4 text-orange-500 mx-auto mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Data Flow Diagram */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.4 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <GitBranch className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl font-bold text-gray-800">詳細データフロー</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            ユーザーインタラクションから AI 応答生成までの包括的なデータ処理フロー
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          {/* User Interaction Flow */}
          <div className="space-y-8">
            <div className="grid md:grid-cols-6 gap-4 items-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-gray-800">ユーザー</p>
                <p className="text-xs text-gray-600">音声入力</p>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm font-medium text-gray-800">音声認識</p>
                <p className="text-xs text-gray-600">Web Speech API</p>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-sm font-medium text-gray-800">AI分析</p>
                <p className="text-xs text-gray-600">GROW + 感情</p>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Volume2 className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-sm font-medium text-gray-800">音声応答</p>
                <p className="text-xs text-gray-600">TTS出力</p>
              </div>
            </div>
            
            {/* Technical Processing Steps */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <span>技術的処理ステップ</span>
              </h4>
              <div className="grid md:grid-cols-5 gap-4 text-sm">
                <div className="bg-white rounded p-3 border border-blue-100">
                  <strong className="text-blue-600">1. 音声キャプチャ</strong>
                  <p className="text-gray-600 mt-1">• マイクアクセス</p>
                  <p className="text-gray-600">• リアルタイム認識</p>
                  <p className="text-gray-600">• 日本語対応</p>
                </div>
                <div className="bg-white rounded p-3 border border-green-100">
                  <strong className="text-green-600">2. データ送信</strong>
                  <p className="text-gray-600 mt-1">• REST API</p>
                  <p className="text-gray-600">• JSON形式</p>
                  <p className="text-gray-600">• セッション管理</p>
                </div>
                <div className="bg-white rounded p-3 border border-purple-100">
                  <strong className="text-purple-600">3. AI分析</strong>
                  <p className="text-gray-600 mt-1">• コンテキスト解析</p>
                  <p className="text-gray-600">• 感情分析</p>
                  <p className="text-gray-600">• GROW適用</p>
                </div>
                <div className="bg-white rounded p-3 border border-orange-100">
                  <strong className="text-orange-600">4. 応答生成</strong>
                  <p className="text-gray-600 mt-1">• 個人化</p>
                  <p className="text-gray-600">• 段階考慮</p>
                  <p className="text-gray-600">• 履歴統合</p>
                </div>
                <div className="bg-white rounded p-3 border border-red-100">
                  <strong className="text-red-600">5. 音声合成</strong>
                  <p className="text-gray-600 mt-1">• TTS変換</p>
                  <p className="text-gray-600">• 自然な発話</p>
                  <p className="text-gray-600">• 速度調整</p>
                </div>
              </div>
            </div>

            {/* Database Operations */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-500" />
                <span>データベース操作フロー</span>
              </h4>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded p-3 border">
                  <strong>セッション作成</strong>
                  <p className="text-gray-600 mt-1">• ユーザー識別</p>
                  <p className="text-gray-600">• セッションID生成</p>
                </div>
                <div className="bg-white rounded p-3 border">
                  <strong>メッセージ保存</strong>
                  <p className="text-gray-600 mt-1">• 入力テキスト</p>
                  <p className="text-gray-600">• タイムスタンプ</p>
                </div>
                <div className="bg-white rounded p-3 border">
                  <strong>履歴分析</strong>
                  <p className="text-gray-600 mt-1">• 過去の会話</p>
                  <p className="text-gray-600">• 感情履歴</p>
                </div>
                <div className="bg-white rounded p-3 border">
                  <strong>応答記録</strong>
                  <p className="text-gray-600 mt-1">• AI応答</p>
                  <p className="text-gray-600">• 分析結果</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Future Expansion Plans */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Gauge className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-800">将来の拡張計画</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            スケーラビリティとパフォーマンス最適化による長期的な成長戦略
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-800">スケーラビリティ</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• マイクロサービス化</li>
              <li>• 負荷分散システム</li>
              <li>• CDN統合</li>
              <li>• 自動スケーリング</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
            className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800">新機能</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• マルチモーダル分析</li>
              <li>• グループコーチング</li>
              <li>• AR/VR統合</li>
              <li>• IoTデバイス連携</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.0 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-800">最適化</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• AI応答速度向上</li>
              <li>• メモリ使用量削減</li>
              <li>• バッテリー効率化</li>
              <li>• オフライン機能</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Differentiation */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.2 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">他ツールとの差別化要因</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            既存のコーチングツールや目標管理アプリとは一線を画す、EVOLVEの独自性
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {differentiators.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 3.4 + index * 0.1 }}
                className="flex items-start space-x-3 bg-white rounded-xl p-4 shadow-sm"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm">{factor}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PRD Summary */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.6 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white"
      >
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">プロダクト要件概要</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">目的</h3>
              <p className="text-blue-100">
                科学的根拠に基づく行動変容支援により、ユーザーの持続可能な成長を実現
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">コア機能</h3>
              <ul className="text-blue-100 space-y-1 text-sm">
                <li>• AIコーチング対話</li>
                <li>• SMART目標設定</li>
                <li>• 習慣形成プログラム</li>
                <li>• 感情・進捗分析</li>
                <li>• 個人最適化</li>
                <li>• 予測分析</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">インパクト</h3>
              <p className="text-blue-100">
                個人の内発的動機を引き出し、長期的な行動変容と自己実現をサポート。
                BytePlus AIによる高度な分析で、より精密で効果的なコーチング体験を提供。
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
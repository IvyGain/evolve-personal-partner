import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  Brain, 
  Heart,
  Target,
  TrendingUp,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import type { CoachingSession, SessionMessage } from '../../shared/types';

export default function Coaching() {
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewSession = async () => {
    setSessionLoading(true);
    try {
      const response = await fetch('/api/coaching/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal_focus: 'general',
          preferred_style: 'supportive'
        }),
      });

      const result = await response.json();
      if (result.success) {
        setCurrentSession(result.data.session);
        setMessages([result.data.initial_message]);
        toast.success('新しいコーチングセッションを開始しました！');
      } else {
        toast.error('セッションの開始に失敗しました');
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      toast.error('セッションの開始に失敗しました');
    } finally {
      setSessionLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: SessionMessage = {
      id: Date.now().toString(),
      session_id: currentSession.id,
      speaker: 'user',
      sender: 'user',
      content: inputMessage,
      metadata: {},
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch(`/api/coaching/session/${currentSession.id}/continue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: currentSession.id,
          user_message: inputMessage,
          emotional_state: 7
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessages(prev => [...prev, result.data.ai_response]);
        
        // 音声合成でAIの応答を読み上げ
        if ('speechSynthesis' in window) {
          speakText(result.data.ai_response.content);
        }
      } else {
        toast.error('メッセージの送信に失敗しました');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('メッセージの送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      
      // 簡易的な音声認識のシミュレーション
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage('音声入力のテストメッセージです。実際の実装では音声認識APIを使用します。');
        stream.getTracks().forEach(track => track.stop());
        toast.success('音声を認識しました');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('音声録音に失敗しました');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const coachingMethods = [
    {
      icon: Target,
      title: 'GROWモデル',
      description: 'Goal, Reality, Options, Wayforward',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: '5段階行動変容理論',
      description: '段階的な行動変化をサポート',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: '感情分析',
      description: '感情状態を考慮したコーチング',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Sparkles,
      title: '21日間習慣形成',
      description: '科学的根拠に基づいた習慣化',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">AIコーチング</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          科学的根拠に基づいたパーソナライズされたコーチング体験
        </p>
      </motion.div>

      {/* Coaching Methods */}
      {!currentSession && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {coachingMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
              >
                <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${method.color} rounded-lg mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{method.title}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Chat Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {currentSession ? (
          <>
            {/* Session Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">コーチングセッション</h2>
                    <p className="text-sm opacity-90">
                      {new Date(currentSession.created_at).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span className="text-sm">停止</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.sender === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">AIコーチ</span>
                        <button
                          onClick={() => speakText(message.content)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Volume2 className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString('ja-JP')}
                    </p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="text-sm text-gray-600">AIが考えています...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="メッセージを入力してください..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={2}
                    disabled={loading}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || loading}
                    className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {isRecording && (
                <div className="mt-3 flex items-center justify-center space-x-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">録音中...</span>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Start Session */
          <div className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                AIコーチングセッションを始めましょう
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                あなたの目標達成をサポートするパーソナライズされたコーチング体験が始まります。
                GROWモデルと行動変容理論に基づいた科学的アプローチで、理想の自分への道のりをガイドします。
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={startNewSession}
                disabled={sessionLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 mx-auto"
              >
                {sessionLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Brain className="w-5 h-5" />
                )}
                <span>{sessionLoading ? 'セッション準備中...' : 'セッションを開始'}</span>
              </button>
              
              <p className="text-sm text-gray-500">
                音声入力とテキスト入力の両方に対応しています
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Features Info */}
      {!currentSession && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            EVOLVEのAIコーチング機能
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p>• <strong>GROWモデル:</strong> 目標設定から行動計画まで体系的にサポート</p>
              <p>• <strong>感情分析:</strong> あなたの感情状態を考慮したパーソナライズ</p>
            </div>
            <div className="space-y-2">
              <p>• <strong>音声対話:</strong> 自然な会話でコーチングを受けられます</p>
              <p>• <strong>行動変容理論:</strong> 科学的根拠に基づいた段階的アプローチ</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
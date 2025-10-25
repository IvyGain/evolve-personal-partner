import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onError,
  disabled = false,
  className = ''
}) => {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportMessage
  } = useSpeechRecognition();

  const [isProcessing, setIsProcessing] = useState(false);

  // 最終的なトランスクリプトが更新されたときに親コンポーネントに通知
  useEffect(() => {
    if (finalTranscript) {
      onTranscript(finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript, onTranscript, resetTranscript]);

  // エラーが発生したときに親コンポーネントに通知
  useEffect(() => {
    if (error && onError) {
      onError(error.message);
    }
  }, [error, onError]);

  const handleToggleListening = async () => {
    if (disabled) return;

    if (isListening) {
      stopListening();
    } else {
      setIsProcessing(true);
      try {
        await startListening();
      } catch (err) {
        console.error('音声認識開始エラー:', err);
        if (onError) {
          onError(err instanceof Error ? err.message : '音声認識を開始できませんでした');
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // ブラウザサポートチェック
  if (!isSupported) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <div className="text-sm text-yellow-800">
          <p className="font-medium">音声入力が利用できません</p>
          <p className="text-xs mt-1">{browserSupportMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 音声入力ボタン */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleListening}
          disabled={disabled || isProcessing}
          className={`
            flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
            }
            ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={isListening ? '音声入力を停止' : '音声入力を開始'}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">
            {isListening ? '🎤 音声を聞いています...' : '🎤 音声入力'}
          </div>
          <div className="text-xs text-gray-500">
            {isListening 
              ? 'ボタンをクリックして停止' 
              : 'ボタンをクリックして音声入力を開始'
            }
          </div>
        </div>
      </div>

      {/* リアルタイム音声認識結果 */}
      {(isListening && (interimTranscript || transcript)) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">
            🎯 認識中の音声:
          </div>
          <div className="text-sm text-gray-700">
            {transcript && (
              <span className="text-blue-600 font-medium">{transcript}</span>
            )}
            {interimTranscript && (
              <span className="text-gray-500 italic">{interimTranscript}</span>
            )}
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <div className="text-sm text-red-800">
              <p className="font-medium">音声認識エラー</p>
              <p className="text-xs mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* 使用方法のヒント */}
      {!isListening && !error && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          💡 ヒント: マイクボタンをクリックして音声入力を開始してください。話し終わったら再度クリックして停止します。
        </div>
      )}
    </div>
  );
};
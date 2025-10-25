import { useState, useEffect, useRef, useCallback } from 'react';
import '../types/speech';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface SpeechRecognitionError {
  error: string;
  message: string;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: SpeechRecognitionError | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportMessage: string;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<SpeechRecognitionError | null>(null);
  const [browserSupportMessage, setBrowserSupportMessage] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitializedRef = useRef(false);

  // ブラウザサポートの詳細チェック
  const checkBrowserSupport = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setBrowserSupportMessage('このブラウザは音声認識をサポートしていません。Chrome、Edge、Safari（iOS 14.5+）をお試しください。');
      return false;
    }

    // より詳細なブラウザチェック
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Firefox')) {
      setIsSupported(false);
      setBrowserSupportMessage('Firefoxは現在音声認識をサポートしていません。Chrome、Edge、Safariをお試しください。');
      return false;
    }

    setIsSupported(true);
    setBrowserSupportMessage('');
    return true;
  }, []);

  // 音声認識の初期化
  const initializeSpeechRecognition = useCallback(() => {
    if (!checkBrowserSupport() || isInitializedRef.current) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // 設定
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP';
    recognition.maxAlternatives = 1;

    // イベントハンドラー
    recognition.onstart = () => {
      console.log('🎤 音声認識開始');
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      console.log('🎯 認識結果 - Final:', finalTranscript, 'Interim:', interimTranscript);
      
      setInterimTranscript(interimTranscript);
      
      if (finalTranscript) {
        setFinalTranscript(prev => prev + finalTranscript);
        setTranscript(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ 音声認識エラー:', event.error);
      setIsListening(false);
      
      let errorMessage = '音声認識でエラーが発生しました';
      switch (event.error) {
        case 'no-speech':
          errorMessage = '音声が検出されませんでした。もう一度お試しください。';
          break;
        case 'audio-capture':
          errorMessage = 'マイクにアクセスできません。マイクが接続されているか確認してください。';
          break;
        case 'not-allowed':
          errorMessage = 'マイクの使用が許可されていません。ブラウザの設定でマイクアクセスを許可してください。';
          break;
        case 'network':
          errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
          break;
        case 'service-not-allowed':
          errorMessage = '音声認識サービスが利用できません。しばらく時間をおいてからお試しください。';
          break;
        case 'bad-grammar':
          errorMessage = '音声認識の設定にエラーがあります。';
          break;
        case 'language-not-supported':
          errorMessage = '選択された言語はサポートされていません。';
          break;
        default:
          errorMessage = `音声認識エラー: ${event.error}`;
      }
      
      setError({
        error: event.error,
        message: errorMessage
      });
    };

    recognition.onend = () => {
      console.log('🎤 音声認識終了');
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    isInitializedRef.current = true;
  }, [checkBrowserSupport]);

  // 音声認識開始
  const startListening = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      throw new Error(browserSupportMessage);
    }

    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }

    if (!recognitionRef.current) {
      throw new Error('音声認識の初期化に失敗しました');
    }

    try {
      // マイクアクセス許可を確認
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ マイクアクセス許可');
      
      // 既存の認識をクリア
      setError(null);
      setInterimTranscript('');
      
      // 音声認識開始
      recognitionRef.current.start();
      
    } catch (error) {
      console.error('❌ マイクアクセスエラー:', error);
      
      if (error instanceof DOMException) {
        let errorMessage = 'マイクにアクセスできません';
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'マイクアクセスが拒否されました。ブラウザの設定でマイクアクセスを許可してください。';
            break;
          case 'NotFoundError':
            errorMessage = 'マイクが見つかりません。マイクが接続されているか確認してください。';
            break;
          case 'NotReadableError':
            errorMessage = 'マイクが使用中です。他のアプリケーションでマイクが使用されていないか確認してください。';
            break;
          case 'OverconstrainedError':
            errorMessage = 'マイクの設定に問題があります。';
            break;
          case 'SecurityError':
            errorMessage = 'セキュリティ上の理由でマイクにアクセスできません。HTTPSでアクセスしてください。';
            break;
          default:
            errorMessage = `マイクエラー: ${error.message}`;
        }
        
        setError({
          error: error.name,
          message: errorMessage
        });
        throw new Error(errorMessage);
      } else {
        const errorMessage = 'マイクにアクセスできません。ブラウザの設定を確認してください。';
        setError({
          error: 'unknown',
          message: errorMessage
        });
        throw new Error(errorMessage);
      }
    }
  }, [isSupported, browserSupportMessage, initializeSpeechRecognition]);

  // 音声認識停止
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [isListening]);

  // トランスクリプトリセット
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
  }, []);

  // 初期化
  useEffect(() => {
    initializeSpeechRecognition();
  }, [initializeSpeechRecognition]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
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
  };
};
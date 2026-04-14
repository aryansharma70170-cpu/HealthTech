import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';

interface VoiceFABProps {
  onResult: (text: string) => void;
  isProcessing?: boolean;
  t: any;
}

export function VoiceFAB({ onResult, isProcessing, t }: VoiceFABProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onResult]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.2 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-health-primary rounded-full -z-10"
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </AnimatePresence>
      
      <Button
        size="icon"
        className={`h-16 w-16 rounded-full shadow-2xl transition-all ${
          isListening ? 'bg-health-urgent hover:bg-red-600' : 'bg-health-primary hover:bg-blue-700'
        }`}
        onClick={toggleListening}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </Button>
      
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 right-0 bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200 whitespace-nowrap text-sm font-medium"
        >
          {t.listening}
        </motion.div>
      )}
    </div>
  );
}

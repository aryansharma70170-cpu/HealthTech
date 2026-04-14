import React, { useEffect, useRef, useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  Maximize2, 
  MessageSquare,
  User,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VideoCallProps {
  onEnd: () => void;
  doctorName?: string;
  t: any;
}

export function VideoCall({ onEnd, doctorName = "Dr. Anjali Sharma", t }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'Good' | 'Fair' | 'Poor'>('Good');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    startCamera();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col overflow-hidden">
      {/* Header Info */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-health-safe border-2 border-white/20 overflow-hidden">
            <img 
              src="https://picsum.photos/seed/doctor/200/200" 
              alt="Doctor" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">{doctorName}</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-health-safe/20 text-health-safe border-health-safe/40 text-[10px]">
                Live
              </Badge>
              <span className="text-white/60 text-xs font-mono">{formatTime(callDuration)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${connectionQuality === 'Good' ? 'bg-health-safe' : 'bg-health-warning'}`} />
            <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">{connectionQuality} Signal</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Remote Video (Simulated Doctor) */}
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://picsum.photos/seed/medical/1920/1080" 
            alt="Doctor Feed" 
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center mx-auto animate-pulse">
                  <User className="h-12 w-12 text-white/40" />
                </div>
                <p className="text-white/40 font-medium">Doctor is explaining your symptoms...</p>
             </div>
          </div>
        </div>

        {/* Local Video (Self Preview) */}
        <motion.div 
          drag
          dragConstraints={{ left: 20, right: 20, top: 20, bottom: 20 }}
          className="absolute bottom-32 right-6 w-32 h-48 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-20 cursor-move"
        >
          {isVideoOff ? (
            <div className="h-full w-full flex items-center justify-center bg-slate-800">
              <User className="h-8 w-8 text-white/20" />
            </div>
          ) : (
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="h-full w-full object-cover mirror"
            />
          )}
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-black/40 backdrop-blur-sm text-[8px] border-none">You</Badge>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center space-x-6 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMute}
          className={`h-14 w-14 rounded-full transition-all ${isMuted ? 'bg-health-urgent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleVideo}
          className={`h-14 w-14 rounded-full transition-all ${isVideoOff ? 'bg-health-urgent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <VideoIcon className="h-6 w-6" />}
        </Button>

        <Button 
          variant="destructive" 
          size="icon" 
          onClick={onEnd}
          className="h-16 w-16 rounded-full shadow-2xl shadow-red-500/40 hover:scale-110 transition-transform"
        >
          <PhoneOff className="h-8 w-8" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}

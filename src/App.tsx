import React, { useState } from 'react';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { EHRSection } from './components/EHRSection';
import { VoiceFAB } from './components/VoiceFAB';
import { SymptomChecker } from './components/SymptomChecker';
import { VideoCall } from './components/VideoCall';
import { Auth } from './components/Auth';
import { Button } from '../components/ui/button';
import { Language, translations } from './lib/i18n';
import { ChevronLeft, Home, User, Settings, Bell, History, PhoneCall as PhoneIcon, ShieldCheck, Languages, LogOut, Heart, Activity, AlertCircle, Calendar, Clock, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

type AppState = 'dashboard' | 'symptom-checker' | 'telemedicine' | 'records' | 'profile' | 'emergency-call' | 'appointment-booking';
type UserRole = 'patient' | 'doctor';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  allergies?: string;
  medications?: string;
}

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [state, setState] = useState<AppState>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const t = translations[lang];

  if (!user) {
    return <Auth onLogin={setUser} t={t} />;
  }

  const handleVoiceResult = (text: string) => {
    setVoiceTranscript(text);
    setState('symptom-checker');
  };

  const handleAction = (action: string) => {
    if (action === 'check') setState('symptom-checker');
    if (action === 'call') setShowCallModal(true);
    if (action === 'emergency') setState('telemedicine');
    if (action === 'records') setState('records');
    if (action === 'profile') setState('profile');
  };

  const updateProfile = (data: Partial<UserData>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setState('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {state !== 'dashboard' && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setState('dashboard')}
                className="mr-2"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            <div className="h-10 w-10 bg-health-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <div className="relative">
                <Heart className="h-6 w-6 text-white fill-white" />
                <Activity className="h-3 w-3 text-health-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">{t.appName.split(' ')[0]}<span className="text-health-primary">{t.appName.split(' ')[1]}</span></span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
              {(['en', 'hi', 'mr'] as Language[]).map((l) => (
                <Button
                  key={l}
                  variant={lang === l ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLang(l)}
                  className="rounded-full px-3 h-8 text-[10px] font-bold uppercase"
                >
                  {l}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-slate-400" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-24 pt-4">
        <AnimatePresence mode="wait">
          {state === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {user.role === 'patient' ? (
                <PatientDashboard onAction={handleAction} t={t} userName={user.name} />
              ) : (
                <DoctorDashboard t={t} userName={user.name} />
              )}
            </motion.div>
          )}

          {state === 'symptom-checker' && (
            <motion.div
              key="symptom-checker"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-6"
            >
              <div className="max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.checkSymptoms}</h2>
                <p className="text-slate-500">
                  {voiceTranscript 
                    ? `${t.analyzing.replace('...', '')}: "${voiceTranscript}"` 
                    : t.listening}
                </p>
              </div>
              
              {voiceTranscript ? (
                <SymptomChecker 
                  transcript={voiceTranscript} 
                  onComplete={(report) => console.log('Report generated', report)} 
                  onAction={handleAction}
                  t={t}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-24 w-24 rounded-full bg-health-primary/10 flex items-center justify-center animate-pulse">
                    <ShieldCheck className="h-12 w-12 text-health-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">{t.listening}</h3>
                </div>
              )}
            </motion.div>
          )}

          {state === 'telemedicine' && (
            <motion.div
              key="telemedicine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VideoCall onEnd={() => setState('dashboard')} t={t} />
            </motion.div>
          )}

          {state === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EHRSection t={t} />
            </motion.div>
          )}

          {state === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-slate-500 mb-4">
                  {user.role === 'patient' 
                    ? `Patient ID: HT-${user.id.toUpperCase()}` 
                    : `Doctor License: MC-${user.id.toUpperCase()}`}
                </p>
              </div>

              {user.role === 'patient' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="space-y-4 text-left">
                    <h3 className="text-lg font-bold text-slate-800">Medical Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Height (cm)</label>
                        <input 
                          className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                          value={user.height || ''}
                          onChange={(e) => updateProfile({ height: e.target.value })}
                          placeholder="170"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Weight (kg)</label>
                        <input 
                          className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                          value={user.weight || ''}
                          onChange={(e) => updateProfile({ weight: e.target.value })}
                          placeholder="70"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Blood Group</label>
                        <input 
                          className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                          value={user.bloodGroup || ''}
                          onChange={(e) => updateProfile({ bloodGroup: e.target.value })}
                          placeholder="O+"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Allergies</label>
                      <textarea 
                        className="w-full p-2 rounded-lg border border-slate-200 text-sm"
                        value={user.allergies || ''}
                        onChange={(e) => updateProfile({ allergies: e.target.value })}
                        placeholder="e.g. Peanuts, Penicillin"
                      />
                    </div>
                  </section>

                  <section className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                      <QrCode className="h-4 w-4 mr-2" /> Emergency QR Code
                    </h3>
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                      <QRCodeSVG 
                        value={JSON.stringify({
                          id: user.id,
                          name: user.name,
                          height: user.height,
                          weight: user.weight,
                          bloodGroup: user.bloodGroup,
                          allergies: user.allergies
                        })} 
                        size={150}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-4 text-center uppercase font-bold tracking-widest">
                      Scan for medical history
                    </p>
                  </section>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold">Email Address</p>
                  <p className="font-medium text-slate-700">{user.email}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="mt-8 w-full h-12 rounded-xl border-red-100 text-red-500 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Voice FAB */}
      {user.role === 'patient' && (
        <VoiceFAB 
          onResult={handleVoiceResult} 
          isProcessing={isProcessingVoice} 
          t={t}
        />
      )}

      {/* Bottom Tab Bar (Mobile Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-40">
        <Button 
          variant="ghost" 
          className={`flex flex-col h-auto py-1 ${state === 'dashboard' ? 'text-health-primary' : 'text-slate-400'}`}
          onClick={() => setState('dashboard')}
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase mt-1">{t.home}</span>
        </Button>
        
        {user.role === 'patient' && (
          <>
            <Button 
              variant="ghost" 
              className={`flex flex-col h-auto py-1 ${state === 'records' ? 'text-health-primary' : 'text-slate-400'}`}
              onClick={() => setState('records')}
            >
              <History className="h-6 w-6" />
              <span className="text-[10px] font-bold uppercase mt-1">{t.records}</span>
            </Button>
            <div className="w-16" /> {/* Spacer for FAB */}
            <Button 
              variant="ghost" 
              className={`flex flex-col h-auto py-1 ${state === 'telemedicine' ? 'text-health-primary' : 'text-slate-400'}`}
              onClick={() => setState('telemedicine')}
            >
              <PhoneIcon className="h-6 w-6" />
              <span className="text-[10px] font-bold uppercase mt-1">{t.call}</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col h-auto py-1 ${state === 'profile' ? 'text-health-primary' : 'text-slate-400'}`}
              onClick={() => setState('profile')}
            >
              <User className="h-6 w-6" />
              <span className="text-[10px] font-bold uppercase mt-1">{t.profile}</span>
            </Button>
          </>
        )}
      </div>
      {/* Call Selection Modal */}
      <AnimatePresence>
        {showCallModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">How can we help?</h3>
                <p className="text-slate-500">Choose the type of consultation you need.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  className="h-20 rounded-2xl bg-health-urgent hover:bg-red-700 flex flex-col items-center justify-center space-y-1 shadow-lg shadow-red-100"
                  onClick={() => {
                    setShowCallModal(false);
                    setState('telemedicine');
                  }}
                >
                  <AlertCircle className="h-6 w-6" />
                  <span className="font-bold text-lg">Emergency Call</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-20 rounded-2xl border-slate-200 hover:bg-slate-50 flex flex-col items-center justify-center space-y-1"
                  onClick={() => {
                    setShowCallModal(false);
                    alert("Appointment booked for Today at 4:30 PM. We will connect you then.");
                  }}
                >
                  <Calendar className="h-6 w-6 text-health-primary" />
                  <span className="font-bold text-lg text-slate-700">Book Appointment</span>
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full text-slate-400 font-bold"
                onClick={() => setShowCallModal(false)}
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



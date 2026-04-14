import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { User, Lock, Mail, ArrowRight, Heart, Activity } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
  t: any;
}

export function Auth({ onLogin, t }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login/signup
    const fallbackName = email.split('@')[0];
    const formattedFallback = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
    
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name || (role === 'patient' ? formattedFallback : `Dr. ${formattedFallback}`),
      email,
      role
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-health-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-health-primary/20">
            <div className="relative">
              <Heart className="h-10 w-10 text-white fill-white" />
              <Activity className="h-5 w-5 text-health-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.appName}</h1>
          <p className="text-slate-500 font-medium mt-2">Healthcare for the heart of India</p>
        </div>

        <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-3xl">
          <CardHeader className="p-8 pb-0">
            <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1">
                <TabsTrigger value="login" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {t.login}
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {t.signup}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{t.fullName}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input 
                          className="pl-12 h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-colors"
                          placeholder="e.g. Aryan Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{t.email}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        type="email"
                        className="pl-12 h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-colors"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{t.password}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        type="password"
                        className="pl-12 h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-colors"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{t.role}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={role === 'patient' ? 'default' : 'outline'}
                        onClick={() => setRole('patient')}
                        className={`rounded-xl h-12 font-bold transition-all ${role === 'patient' ? 'bg-health-primary' : 'border-slate-100 text-slate-500'}`}
                      >
                        {t.patient}
                      </Button>
                      <Button
                        type="button"
                        variant={role === 'doctor' ? 'default' : 'outline'}
                        onClick={() => setRole('doctor')}
                        className={`rounded-xl h-12 font-bold transition-all ${role === 'doctor' ? 'bg-health-primary' : 'border-slate-100 text-slate-500'}`}
                      >
                        {t.doctor}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <Button type="submit" className="w-full h-14 rounded-2xl bg-health-primary hover:bg-health-primary/90 text-lg font-bold shadow-lg shadow-health-primary/20 group">
                {mode === 'login' ? t.signIn : t.createAccount}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm font-bold text-health-primary hover:underline"
              >
                {mode === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-8 font-bold">
          Secure • Encrypted • Rural-First
        </p>
      </motion.div>
    </div>
  );
}

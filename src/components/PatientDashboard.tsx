import React from 'react';
import { 
  PhoneCall, 
  Stethoscope, 
  History, 
  User, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  Heart,
  Activity,
  Thermometer
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PatientDashboardProps {
  onAction: (action: string) => void;
  t: any;
  userName: string;
}

export function PatientDashboard({ onAction, t, userName }: PatientDashboardProps) {
  const actions = [
    { id: 'check', title: t.checkSymptoms, icon: Stethoscope, color: 'bg-blue-500', desc: t.aiHelp },
    { id: 'call', title: t.callDoctor, icon: PhoneCall, color: 'bg-health-safe', desc: t.videoCall },
    { id: 'records', title: t.myRecords, icon: History, color: 'bg-purple-500', desc: t.ehr },
    { id: 'profile', title: t.myProfile, icon: User, color: 'bg-slate-500', desc: t.settings },
  ];

  const stats = [
    { label: t.heartRate, value: '72', unit: 'bpm', icon: Heart, color: 'text-red-500' },
    { label: t.bloodPressure, value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-blue-500' },
    { label: t.temperature, value: '98.6', unit: '°F', icon: Thermometer, color: 'text-orange-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.welcome}, {userName}</h1>
          <p className="text-slate-500">{t.howFeeling}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-health-primary/10 flex items-center justify-center">
          <User className="h-6 w-6 text-health-primary" />
        </div>
      </header>

      {/* Health Stats */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Vitals</h2>
          <span className="text-[10px] font-medium text-slate-400 italic">Based on your past reports</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
                <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                <span className="text-xs text-slate-400 uppercase font-semibold">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Actions - Three Tap Rule */}
      <div className="grid grid-cols-2 gap-6">
        {actions.map((action, i) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.id)}
            className="three-tap-button bg-white shadow-md border border-slate-100 group"
          >
            <div className={`h-16 w-16 rounded-2xl ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
              <action.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{action.title}</h3>
            <p className="text-sm text-slate-400">{action.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-health-primary" />
            {t.upcoming}
          </h2>
          <Button variant="ghost" size="sm" className="text-health-primary font-bold">{t.seeAll}</Button>
        </div>
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-health-safe/10 flex items-center justify-center">
                  <PhoneCall className="h-6 w-6 text-health-safe" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Dr. Anjali Sharma</h4>
                  <p className="text-sm text-slate-500">Video Consultation • Today, 4:30 PM</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Health Tip */}
      <Card className="bg-health-primary text-white border-none shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Heart className="h-24 w-24" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-1">{t.healthTip}</h3>
          <p className="text-white/80 leading-relaxed">
            {t.tipContent}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

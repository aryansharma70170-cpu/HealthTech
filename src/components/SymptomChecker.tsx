import React, { useState } from 'react';
import { analyzeSymptoms } from '../lib/gemini';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, Activity, PhoneCall, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';

interface SymptomCheckerProps {
  transcript: string;
  onComplete: (report: any) => void;
  onAction: (action: string) => void;
  t: any;
}

export function SymptomChecker({ transcript, onComplete, onAction, t }: SymptomCheckerProps) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  React.useEffect(() => {
    if (transcript) {
      setLoading(true);
      analyzeSymptoms(transcript)
        .then((res) => {
          setReport(res);
          onComplete(res);
        })
        .finally(() => setLoading(false));
    }
  }, [transcript]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Activity className="h-12 w-12 text-health-primary" />
          </motion.div>
          <p className="text-lg font-medium text-slate-600">{t.analyzing}</p>
        </CardContent>
      </Card>
    );
  }

  if (!report) return null;

  const severity = report.severity === 'Medium' ? 'Moderate' : report.severity;

  const severityColors: any = {
    Low: 'bg-health-safe text-white',
    Moderate: 'bg-health-warning text-white',
    Medium: 'bg-health-warning text-white',
    High: 'bg-health-urgent text-white',
    Urgent: 'bg-red-700 text-white animate-pulse'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <Card className="overflow-hidden border-none shadow-2xl bg-white">
        <CardHeader className={`${severityColors[severity] || severityColors.High} p-6`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">{t.triageReport}</CardTitle>
              <CardDescription className="text-white/80">Based on your voice input</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/20 border-white/40 text-white px-4 py-1 text-lg">
              {severity} {t.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">{t.summary}</h3>
            <p className="text-xl text-slate-800 leading-relaxed font-medium">
              "{report.summary}"
            </p>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <section className="bg-slate-50 p-4 rounded-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {t.symptoms}
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.extractedSymptoms.map((s: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-white border border-slate-200 text-slate-700">
                    {s}
                  </Badge>
                ))}
              </div>
            </section>
            <section className="bg-slate-50 p-4 rounded-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {t.duration}
              </h3>
              <p className="text-slate-700 font-medium">{report.duration || 'Not specified'}</p>
            </section>
          </div>

          {/* Recommendations and Actions based on Priority */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">AI Recommendations</h3>
            
            {severity === 'Low' && (
              <div className="space-y-4">
                <div className="bg-health-safe/10 p-4 rounded-xl border border-health-safe/20">
                  <ul className="list-disc list-inside text-sm text-health-safe font-medium space-y-1">
                    {report.recommendations?.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 mt-3 italic">Note: Taking advice from a doctor is always suggested for persistent symptoms.</p>
                </div>
              </div>
            )}

            {(severity === 'Moderate' || severity === 'Medium') && (
              <div className="space-y-4">
                <div className="bg-health-warning/10 p-4 rounded-xl border border-health-warning/20">
                  <p className="text-sm text-health-warning font-bold flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" /> Book an appointment as soon as possible.
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-600 mt-2 space-y-1">
                    {report.recommendations?.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-health-warning hover:bg-health-warning/90 font-bold" onClick={() => onAction('call')}>
                  <Calendar className="h-4 w-4 mr-2" /> Book Appointment Now
                </Button>
              </div>
            )}

            {(severity === 'High' || severity === 'Urgent') && (
              <div className="space-y-4">
                <div className="bg-health-urgent/10 p-4 rounded-xl border border-health-urgent/20">
                  <p className="text-sm text-health-urgent font-black flex items-center uppercase tracking-tight">
                    <AlertCircle className="h-5 w-5 mr-2" /> Emergency: Connect to Doctor Immediately
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-health-urgent/20">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Ambulance</p>
                      <p className="text-lg font-black text-health-urgent">102 / 108</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-health-urgent/20">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Nearby Hospital</p>
                      <p className="text-sm font-bold text-slate-700 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-health-urgent" /> City General
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-health-urgent hover:bg-red-700 font-black h-14 text-lg shadow-lg shadow-red-200" onClick={() => onAction('emergency')}>
                  <PhoneCall className="h-5 w-5 mr-2 animate-bounce" /> Connect to Doctor Now
                </Button>
              </div>
            )}
          </section>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center text-health-safe font-medium">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              AI Analysis Complete
            </div>
            <p className="text-xs text-slate-400 italic">This is an AI triage, not a final diagnosis.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

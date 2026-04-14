import React, { useState } from 'react';
import { summarizeConsultation } from '../lib/gemini';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FileText, CheckCircle, Loader2, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

interface ConsultationSummaryProps {
  transcript: string;
  onSave: (summary: any) => void;
}

export function ConsultationSummary({ transcript, onSave }: ConsultationSummaryProps) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  React.useEffect(() => {
    if (transcript) {
      setLoading(true);
      summarizeConsultation(transcript)
        .then((res) => setSummary(res))
        .finally(() => setLoading(false));
    }
  }, [transcript]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-10 w-10 text-health-primary animate-spin" />
        <p className="text-slate-500 font-medium">AI is generating consultation summary...</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-slate-900 text-white p-6">
          <CardTitle className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            Digital Prescription & Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Diagnosis</h3>
            <p className="text-xl font-bold text-slate-800">{summary.diagnosis}</p>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Key Complaints</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {summary.complaints?.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center">
              <FileText className="h-3 w-3 mr-1" /> Medications
            </h3>
            <div className="space-y-3">
              {summary.medications?.map((m: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                  <div>
                    <p className="font-bold text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.dosage}</p>
                  </div>
                  <Badge variant="outline" className="text-health-primary border-health-primary/30">
                    {m.frequency}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Follow-up</h3>
            <p className="text-slate-600 italic">"{summary.followUp}"</p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
            <Button variant="outline" className="rounded-full">Edit Summary</Button>
            <Button 
              className="bg-health-primary rounded-full px-8"
              onClick={() => onSave(summary)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save to EHR
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

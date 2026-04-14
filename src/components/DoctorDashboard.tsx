import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Activity,
  Heart,
  Thermometer,
  User,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Input } from '../../components/ui/input';
import { useState } from 'react';

interface DoctorDashboardProps {
  t: any;
  userName: string;
}

export function DoctorDashboard({ t, userName }: DoctorDashboardProps) {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [vitals, setVitals] = useState({ bp: '120/80', hr: '72', temp: '98.6' });

  const patients = [
    { id: '1', name: 'Ramesh Patel', status: 'Urgent', time: '10:30 AM', reason: 'Severe Chest Pain', age: 54, bloodGroup: 'B+', height: '172cm', weight: '78kg' },
    { id: '2', name: 'Priya Devi', status: 'Stable', time: '11:15 AM', reason: 'Follow-up', age: 29, bloodGroup: 'O+', height: '160cm', weight: '55kg' },
    { id: '3', name: 'Rajesh Singh', status: 'Warning', time: '12:00 PM', reason: 'High Fever', age: 42, bloodGroup: 'A-', height: '178cm', weight: '82kg' },
  ];

  const statusColors: any = {
    Urgent: 'bg-health-urgent',
    Warning: 'bg-health-warning',
    Stable: 'bg-health-safe',
  };

  const handleUpdateVitals = () => {
    alert(`Vitals updated for ${selectedPatient.name}`);
    setSelectedPatient(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.doctorPortal}</h1>
          <p className="text-slate-500">{t.welcomeBack}, {userName}. You have 8 appointments today.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Search className="h-4 w-4 mr-2" /> {t.searchRecords.replace('...', '')}
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Filter className="h-4 w-4 mr-2" /> {t.seeAll}
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: '124', icon: Users, color: 'text-blue-600' },
          { label: 'Pending Triage', value: '5', icon: AlertTriangle, color: 'text-orange-600' },
          { label: 'Completed', value: '18', icon: CheckCircle, color: 'text-green-600' },
          { label: 'Next Call', value: '10:30', icon: Clock, color: 'text-purple-600' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <Badge variant="secondary" className="bg-slate-100 text-[10px]">Today</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Patient Queue */}
        <Card className="col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 bg-white">
            <CardTitle className="text-lg font-bold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-health-primary" />
              {t.appointmentQueue}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y divide-slate-50">
                {patients.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full ${statusColors[p.status]} flex items-center justify-center text-white font-bold`}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{p.name}</h4>
                        <p className="text-xs text-slate-500">{p.reason} • {p.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${statusColors[p.status]} text-white border-none`}>
                        {p.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setSelectedPatient(p)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-none shadow-sm bg-health-primary text-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <h5 className="font-bold text-sm mb-1">Triage Alert</h5>
              <p className="text-xs text-white/80">
                Patient Ramesh Patel's symptoms indicate high probability of cardiac distress. Recommend immediate video call.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <h5 className="font-bold text-sm mb-1">Medication Sync</h5>
              <p className="text-xs text-white/80">
                3 patients in your area have reported similar flu symptoms in the last 24 hours.
              </p>
            </div>
            <Button className="w-full bg-white text-health-primary font-bold hover:bg-slate-100">
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Patient Profile Modal for Doctors */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className={`h-14 w-14 rounded-full ${statusColors[selectedPatient.status]} flex items-center justify-center text-white text-xl font-bold`}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">{selectedPatient.name}</CardTitle>
                  <CardDescription>Patient ID: HT-{selectedPatient.id.toUpperCase()}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPatient(null)}>
                <X className="h-6 w-6" />
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Age</p>
                  <p className="font-bold text-slate-700">{selectedPatient.age} yrs</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Blood</p>
                  <p className="font-bold text-slate-700">{selectedPatient.bloodGroup}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Height</p>
                  <p className="font-bold text-slate-700">{selectedPatient.height}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Weight</p>
                  <p className="font-bold text-slate-700">{selectedPatient.weight}</p>
                </div>
              </div>

              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-health-primary" /> Update Current Vitals
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center">
                      <Heart className="h-3 w-3 mr-1 text-red-500" /> Heart Rate (bpm)
                    </label>
                    <Input 
                      value={vitals.hr} 
                      onChange={(e) => setVitals({...vitals, hr: e.target.value})}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center">
                      <Activity className="h-3 w-3 mr-1 text-blue-500" /> BP (mmHg)
                    </label>
                    <Input 
                      value={vitals.bp} 
                      onChange={(e) => setVitals({...vitals, bp: e.target.value})}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center">
                      <Thermometer className="h-3 w-3 mr-1 text-orange-500" /> Temp (°F)
                    </label>
                    <Input 
                      value={vitals.temp} 
                      onChange={(e) => setVitals({...vitals, temp: e.target.value})}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <Button variant="outline" className="rounded-xl" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                <Button className="bg-health-primary rounded-xl" onClick={handleUpdateVitals}>
                  <Save className="h-4 w-4 mr-2" /> Save Vitals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

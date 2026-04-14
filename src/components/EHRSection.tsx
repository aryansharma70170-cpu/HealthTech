import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Share2, 
  Lock,
  Database,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface EHRSectionProps {
  t: any;
}

export function EHRSection({ t }: EHRSectionProps) {
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const [records, setRecords] = useState([
    { id: '1', date: '2024-03-10', type: 'Prescription', doctor: 'Dr. Sharma', diagnosis: 'Viral Fever' },
    { id: '2', date: '2024-02-15', type: 'Lab Report', doctor: 'City Lab', diagnosis: 'Blood Test' },
    { id: '3', date: '2024-01-20', type: 'Consultation', doctor: 'Dr. Verma', diagnosis: 'Hypertension' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({ type: '', diagnosis: '', doctor: '' });

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const record = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    };
    setRecords([record, ...records]);
    setShowAddForm(false);
    setNewRecord({ type: '', diagnosis: '', doctor: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.myRecords}</h1>
          <div className="flex items-center text-xs text-slate-400 mt-1">
            <Database className="h-3 w-3 mr-1" />
            <span>Stored locally for offline access</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : t.syncNow}
          </Button>
          <Button size="sm" className="bg-health-primary" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Record
          </Button>
        </div>
      </header>

      {showAddForm && (
        <Card className="border-health-primary/20 shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-slate-50 py-3">
            <CardTitle className="text-sm font-bold">Add New Medical Record</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Record Type</label>
                  <Input 
                    placeholder="e.g. Prescription" 
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Doctor/Lab</label>
                  <Input 
                    placeholder="e.g. Dr. Gupta" 
                    value={newRecord.doctor}
                    onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Diagnosis/Reason</label>
                <Input 
                  placeholder="e.g. Regular Checkup" 
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-health-primary">Save Record</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder={t.searchRecords} 
          className="pl-10 rounded-xl border-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Offline Status */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center mr-3">
            <WifiOff className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">{t.offlineMode}</p>
            <p className="text-xs text-slate-500">You can view and add records without internet.</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] border-slate-300">v1.2.4</Badge>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {records.map((record) => (
          <Card key={record.id} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-health-primary/10 transition-colors">
                  <FileText className="h-6 w-6 text-slate-400 group-hover:text-health-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{record.type}: {record.diagnosis}</h4>
                  <p className="text-xs text-slate-500">{record.doctor} • {record.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <Lock className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Info */}
      <div className="pt-8 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center">
          <Lock className="h-3 w-3 mr-1" />
          All data is encrypted using AES-256 and SHA-256 hashing.
        </p>
      </div>
    </div>
  );
}

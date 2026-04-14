export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  lastVisit?: string;
  bloodGroup?: string;
  allergies?: string[];
}

export interface SymptomReport {
  id: string;
  patientId: string;
  timestamp: string;
  transcript: string;
  extractedSymptoms: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Urgent';
  summary: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  type: 'Video' | 'In-Person';
}

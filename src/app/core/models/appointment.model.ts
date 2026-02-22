export interface Appointment {
  id: number;
  patientId: number;
  start: string; // ISO
  end: string;   // ISO
  reason: string;
}
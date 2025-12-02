// Mock data for HealUp application
// This data will be replaced with real API calls later

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  image: string;
  bio: string;
  education: string;
  availableSlots: string[];
  consultationFee: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "in-person" | "video";
  notes?: string;
}

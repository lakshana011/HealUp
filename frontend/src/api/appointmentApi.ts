import { apiGet, apiPost, apiPut } from "./client";
import type { Appointment } from "@/data/mockData";

interface BookAppointmentData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: "in-person" | "video";
  notes?: string;
}

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const token = localStorage.getItem('healup-token');
  return apiGet<Appointment[]>("/appointments", token || undefined);
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  const token = localStorage.getItem('healup-token');
  return apiGet<Appointment | null>(`/appointments/${id}`, token || undefined);
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  const token = localStorage.getItem('healup-token');
  return apiGet<Appointment[]>(`/appointments/patient/${patientId}`, token || undefined);
};

export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  const token = localStorage.getItem('healup-token');
  return apiGet<Appointment[]>(`/appointments/doctor/${doctorId}`, token || undefined);
};

export const getDoctorTodayAppointments = async (doctorId: string): Promise<Appointment[]> => {
  const all = await getDoctorAppointments(doctorId);
  const today = new Date().toISOString().split("T")[0];
  return all.filter((apt) => apt.date === today);
};

export const getMyAppointments = async (): Promise<Appointment[]> => {
  const token = localStorage.getItem('healup-token');
  return apiGet<Appointment[]>("/appointments/me", token || undefined);
};

export const bookAppointment = async (data: BookAppointmentData): Promise<{
  success: boolean;
  appointment?: Appointment;
  message?: string;
}> => {
  const token = localStorage.getItem('healup-token');
  return apiPost<{ success: boolean; appointment?: Appointment; message?: string }>(
    "/appointments",
    data,
    token || undefined,
  );
};

export const cancelAppointment = async (id: string): Promise<{ success: boolean }> => {
  const token = localStorage.getItem('healup-token');
  return apiPut<{ success: boolean }>(`/appointments/${id}/cancel`, {}, token || undefined);
};

export const completeAppointment = async (id: string): Promise<{ success: boolean }> => {
  const token = localStorage.getItem('healup-token');
  return apiPut<{ success: boolean }>(`/appointments/${id}/complete`, {}, token || undefined);
};

export const processPayment = async (
  appointmentId: string, 
  amount: number
): Promise<{ success: boolean; transactionId?: string }> => {
  return {
    success: true,
    transactionId: `TXN-${Date.now()}`,
  };
};

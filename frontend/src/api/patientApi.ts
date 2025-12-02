import { apiGet, apiPut } from "./client";
import type { Patient } from "@/data/mockData";

export const getAllPatients = async (): Promise<Patient[]> => {
  return apiGet<Patient[]>("/patients");
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  return apiGet<Patient | null>(`/patients/${id}`);
};

export const updatePatient = async (
  id: string,
  data: Partial<Patient>,
): Promise<{ success: boolean; patient?: Patient }> => {
  return apiPut<{ success: boolean; patient?: Patient }>(`/patients/${id}`, data);
};

export const getPatientStats = async (patientId: string): Promise<{
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
}> => {
  // For now, return zeros until stats are calculated from appointments.
  return {
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  };
};


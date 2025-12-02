import { apiGet, apiPut } from "./client";
import type { Doctor } from "@/data/mockData";

export const getAllDoctors = async (): Promise<Doctor[]> => {
  return apiGet<Doctor[]>("/doctors");
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  return apiGet<Doctor | null>(`/doctors/${id}`);
};

export const getDoctorsBySpecialty = async (specialty: string): Promise<Doctor[]> => {
  const qs =
    specialty && specialty !== "all" ? `?specialty=${encodeURIComponent(specialty)}` : "";
  return apiGet<Doctor[]>(`/doctors${qs}`);
};

export const searchDoctors = async (query: string): Promise<Doctor[]> => {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiGet<Doctor[]>(`/doctors${qs}`);
};

export const getDoctorSlots = async (doctorId: string, date: string): Promise<string[]> => {
  const qs = date ? `?date=${encodeURIComponent(date)}` : "";
  return apiGet<string[]>(`/doctors/${doctorId}/slots${qs}`);
};

export const updateDoctorAvailability = async (
  doctorId: string,
  slots: string[]
): Promise<{ success: boolean }> => {
  return apiPut<{ success: boolean }>(`/doctors/${doctorId}/availability`, { slots });
};

export const getDoctorStats = async (doctorId: string): Promise<{
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
}> => {
  // For now, return zeros until a stats endpoint is added.
  return {
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  };
};


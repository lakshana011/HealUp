import { useEffect, useState } from "react";
import { apiGet } from "@/api/client";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
}

interface AuthMeResponse {
  success: boolean;
  user?: AuthUser;
  doctorProfile?: any;
  patientProfile?: any;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<any | null>(null);
  const [patientProfile, setPatientProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("healup-token");
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await apiGet<AuthMeResponse>("/auth/me", token);
        if (res.success && res.user) {
          setUser(res.user);
          setDoctorProfile(res.doctorProfile ?? null);
          setPatientProfile(res.patientProfile ?? null);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("auth/me failed", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { user, doctorProfile, patientProfile, loading };
}



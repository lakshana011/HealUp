import { apiGet, apiPost } from "./client";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
  message?: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const res = await apiPost<AuthResponse>("/auth/login", credentials);
  if (res.token) {
    localStorage.setItem("healup-token", res.token);
  }
  return res;
};

// For now, doctor login uses the same endpoint; role comes from backend user data.
export const loginDoctor = loginUser;

export const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  const res = await apiPost<AuthResponse>("/auth/signup", data);
  if (res.token) {
    localStorage.setItem("healup-token", res.token);
  }
  return res;
};

export const logoutUser = async (): Promise<{ success: boolean }> => {
  localStorage.removeItem("healup-token");
  return { success: true };
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem("healup-token") || undefined;
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }
  return apiGet<AuthResponse>("/auth/me", token);
};


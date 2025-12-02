import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Landing from "./pages/Landing";
import DoctorsPublic from "./pages/DoctorsPublic";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import DoctorLogin from "./pages/auth/DoctorLogin";
import Signup from "./pages/auth/Signup";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import SearchDoctors from "./pages/patient/SearchDoctors";
import DoctorProfile from "./pages/patient/DoctorProfile";
import BookAppointment from "./pages/patient/BookAppointment";
import AppointmentConfirmation from "./pages/patient/AppointmentConfirmation";
import PaymentPage from "./pages/patient/PaymentPage";
import AppointmentHistory from "./pages/patient/AppointmentHistory";
import PatientProfile from "./pages/patient/PatientProfile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AvailabilityManagement from "./pages/doctor/AvailabilityManagement";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorProfileSettings from "./pages/doctor/DoctorProfileSettings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminAppointments from "./pages/admin/AdminAppointments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/doctors" element={<DoctorsPublic />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/doctors" element={<SearchDoctors />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/patient/book/:doctorId" element={<BookAppointment />} />
          <Route path="/patient/confirmation/:id" element={<AppointmentConfirmation />} />
          <Route path="/patient/payment" element={<PaymentPage />} />
          <Route path="/patient/appointments" element={<AppointmentHistory />} />
          <Route path="/patient/history" element={<AppointmentHistory />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/patient/settings" element={<PatientProfile />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/availability" element={<AvailabilityManagement />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/patient/:id" element={<PatientDetails />} />
          <Route path="/doctor/profile" element={<DoctorProfileSettings />} />
          <Route path="/doctor/settings" element={<DoctorProfileSettings />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

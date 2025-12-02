import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, User, Droplet, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getPatientById } from '@/api/patientApi';
import { getPatientAppointments } from '@/api/appointmentApi';
import AppointmentCard from '@/components/common/AppointmentCard';
import type { Patient, Appointment } from '@/data/mockData';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [patientData, appointmentsData] = await Promise.all([
          getPatientById(id),
          getPatientAppointments(id),
        ]);
        setPatient(patientData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout role="doctor" title="Patient Details">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout role="doctor" title="Patient Details">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Patient not found</p>
          <Link to="/doctor/patients" className="btn-primary">
            Back to Patients
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor" title="Patient Details">
      <Link to="/doctor/patients" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="lg:col-span-1">
          <div className="card-elevated p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{patient.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{patient.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{patient.age} years old, {patient.gender}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Droplet className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">Blood Group: {patient.bloodGroup}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment History */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Appointment History</h3>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showPatient={false}
                />
              ))}
            </div>
          ) : (
            <div className="card-elevated p-8 text-center">
              <p className="text-muted-foreground">No appointment history</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetails;

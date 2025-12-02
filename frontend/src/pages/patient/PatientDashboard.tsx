import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentCard from '@/components/common/AppointmentCard';
import StatCard from '@/components/common/StatCard';
import { getPatientAppointments } from '@/api/appointmentApi';
import { getPatientStats } from '@/api/patientApi';
import type { Appointment } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';

const PatientDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchData = async () => {
      try {
        const [appointmentsData, statsData] = await Promise.all([
          getPatientAppointments(user.id),
          getPatientStats(user.id),
        ]);
        setAppointments(appointmentsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authLoading, user]);

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');

  const handleCancelAppointment = (id: string) => {
    console.log('Cancelling appointment:', id);
    // Would call API here
  };

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout role="patient" title="Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.name || 'Patient'}!
        </h2>
        <p className="text-muted-foreground">Here's what's happening with your appointments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingAppointments}
          icon={Clock}
        />
        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          icon={TrendingUp}
        />
      </div>

      {/* Quick Actions */}
      <div className="card-elevated p-6 mb-8">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/patient/doctors" className="btn-primary">
            Find a Doctor
          </Link>
          <Link to="/patient/appointments" className="btn-secondary">
            View All Appointments
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
          <Link to="/patient/appointments" className="text-primary text-sm hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : upcomingAppointments.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        ) : (
          <div className="card-elevated p-8 text-center">
            <p className="text-muted-foreground mb-4">No upcoming appointments</p>
            <Link to="/patient/doctors" className="btn-primary">
              Book an Appointment
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;

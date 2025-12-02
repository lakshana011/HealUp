import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentCard from '@/components/common/AppointmentCard';
import StatCard from '@/components/common/StatCard';
import { getMyAppointments } from '@/api/appointmentApi';
import { getDoctorStats } from '@/api/doctorApi';
import type { Appointment } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchData = async () => {
      try {
        const [appointmentsData, statsData] = await Promise.all([
          getMyAppointments(),
          getDoctorStats(user.id),
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

  const todayAppointments = appointments.filter(apt => apt.status === 'upcoming');

  const handleCompleteAppointment = (id: string) => {
    console.log('Completing appointment:', id);
  };

  const handleCancelAppointment = (id: string) => {
    console.log('Cancelling appointment:', id);
  };

  if (!authLoading && !user) {
    return <Navigate to="/doctor/login" replace />;
  }

  return (
    <DashboardLayout role="doctor" title="Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.name || 'Doctor'}!
        </h2>
        <p className="text-muted-foreground">Here's your schedule for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Calendar}
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Clock}
        />
        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          icon={TrendingUp}
        />
        <StatCard
          title="Pending"
          value={stats.pendingAppointments}
          icon={Users}
        />
      </div>

      {/* Quick Actions */}
      <div className="card-elevated p-6 mb-8">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/doctor/availability" className="btn-primary">
            Manage Availability
          </Link>
          <Link to="/doctor/appointments" className="btn-secondary">
            View All Appointments
          </Link>
        </div>
      </div>

      {/* Today's Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Today's Appointments</h3>
          <Link to="/doctor/appointments" className="text-primary text-sm hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : todayAppointments.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showDoctor={false}
                showPatient={true}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        ) : (
          <div className="card-elevated p-8 text-center">
            <p className="text-muted-foreground">No appointments scheduled for today</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentCard from '@/components/common/AppointmentCard';
import { getPatientAppointments } from '@/api/appointmentApi';
import { useAuth } from '@/hooks/useAuth';
import type { Appointment } from '@/data/mockData';

const AppointmentHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || user.role !== 'patient') {
      navigate('/login');
      return;
    }

    const fetchAppointments = async () => {
      try {
        const data = await getPatientAppointments(user.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, authLoading, navigate]);

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  const handleCancel = async (id: string) => {
    try {
      const { cancelAppointment } = await import('@/api/appointmentApi');
      await cancelAppointment(id);
      // Reload appointments
      if (user) {
        const data = await getPatientAppointments(user.id);
        setAppointments(data);
      }
    } catch (error) {
      console.error('Failed to cancel appointment', error);
    }
  };

  return (
    <DashboardLayout role="patient" title="Appointment History">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-elevated p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mb-4" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={appointment.status === 'upcoming' ? handleCancel : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="card-elevated p-8 text-center">
          <p className="text-muted-foreground">No appointments found</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AppointmentHistory;

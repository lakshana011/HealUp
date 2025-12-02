import { useEffect, useState } from 'react';
import { Search, Calendar, Video, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllAppointments } from '@/api/appointmentApi';
import type { Appointment } from '@/data/mockData';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  const statusColors = {
    upcoming: 'bg-primary/10 text-primary',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-destructive/10 text-destructive',
  };

  return (
    <DashboardLayout role="admin" title="Appointments">
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

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Patient</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Doctor</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Date & Time</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{appointment.patientName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-foreground">{appointment.doctorName}</span>
                        <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {appointment.type === 'video' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span>{appointment.type === 'video' ? 'Video' : 'In-Person'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAppointments;

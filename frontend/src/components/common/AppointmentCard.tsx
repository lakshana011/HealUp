import { Calendar, Clock, Video, MapPin } from 'lucide-react';
import type { Appointment } from '@/data/mockData';

interface AppointmentCardProps {
  appointment: Appointment;
  showDoctor?: boolean;
  showPatient?: boolean;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const AppointmentCard = ({ 
  appointment, 
  showDoctor = true, 
  showPatient = false,
  onCancel,
  onComplete 
}: AppointmentCardProps) => {
  const statusColors = {
    upcoming: 'bg-primary/10 text-primary',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="card-elevated p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          {showDoctor && (
            <h3 className="font-semibold text-foreground">{appointment.doctorName}</h3>
          )}
          {showPatient && (
            <h3 className="font-semibold text-foreground">{appointment.patientName}</h3>
          )}
          <p className="text-sm text-primary">{appointment.specialty}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date(appointment.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {appointment.type === 'video' ? (
            <Video className="w-4 h-4" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span>{appointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}</span>
        </div>
      </div>
      
      {appointment.status === 'upcoming' && (
        <div className="flex gap-2">
          {onComplete && (
            <button
              onClick={() => onComplete(appointment.id)}
              className="btn-primary text-sm py-2 flex-1 justify-center"
            >
              Complete
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="btn-secondary text-sm py-2 flex-1 justify-center text-destructive border-destructive hover:bg-destructive/10"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;

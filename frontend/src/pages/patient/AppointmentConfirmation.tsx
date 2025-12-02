import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Video, MapPin, Download } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AppointmentConfirmation = () => {
  const location = useLocation();
  const { appointment, doctor } = location.state || {};

  return (
    <DashboardLayout role="patient" title="Appointment Confirmed">
      <div className="max-w-lg mx-auto text-center">
        <div className="card-elevated p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Appointment Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your appointment has been successfully booked. You will receive a confirmation email shortly.
          </p>

          {appointment && doctor && (
            <div className="text-left space-y-4 p-4 bg-secondary rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{doctor.name}</p>
                  <p className="text-sm text-primary">{doctor.specialty}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(appointment.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
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
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to="/patient/dashboard" className="btn-primary justify-center">
              Go to Dashboard
            </Link>
            <Link to="/patient/appointments" className="btn-secondary justify-center">
              View All Appointments
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentConfirmation;

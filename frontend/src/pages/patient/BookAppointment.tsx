import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Video, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getDoctorById } from '@/api/doctorApi';
import { bookAppointment } from '@/api/appointmentApi';
import type { Doctor } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';

const BookAppointment = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video'>('in-person');
  const [notes, setNotes] = useState('');

  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const data = await getDoctorById(doctorId);
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleBookAppointment = async () => {
    if (!doctor || !date || !time || !user) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsBooking(true);
    try {
      console.log('Booking appointment with data:', {
        patientId: user.id,
        doctorId: doctor.id,
        date,
        time,
        type: appointmentType,
        notes,
      });
      
      const response = await bookAppointment({
        patientId: user.id,
        doctorId: doctor.id,
        date,
        time,
        type: appointmentType,
        notes,
      });
      
      console.log('Booking response:', response);
      
      if (response.success && response.appointment) {
        // Navigate to payment page with appointment and doctor data
        console.log('Navigating to payment page with:', { appointment: response.appointment, doctor });
        navigate('/patient/payment', {
          state: { appointment: response.appointment, doctor }
        });
      } else {
        alert(response.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <DashboardLayout role="patient" title="Book Appointment">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout role="patient" title="Book Appointment">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Doctor not found</p>
          <Link to="/patient/doctors" className="btn-primary">
            Back to Doctors
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient" title="Book Appointment">
      <Link to={`/doctor/${doctor.id}`} className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Doctor Profile
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appointment Summary */}
        <div className="card-elevated p-6">
          <h2 className="font-semibold text-foreground mb-4">Appointment Summary</h2>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-foreground">{doctor.name}</h3>
              <p className="text-sm text-primary">{doctor.specialty}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span>{new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>{time}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Consultation Fee</span>
              <span className="text-xl font-bold text-foreground">₹{doctor.consultationFee}</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="card-elevated p-6">
          <h2 className="font-semibold text-foreground mb-4">Appointment Details</h2>
          
          {/* Appointment Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Consultation Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAppointmentType('in-person')}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  appointmentType === 'in-person'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <MapPin className={`w-5 h-5 mb-2 ${appointmentType === 'in-person' ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-medium text-foreground">In-Person</p>
                <p className="text-xs text-muted-foreground">Visit the clinic</p>
              </button>
              <button
                onClick={() => setAppointmentType('video')}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  appointmentType === 'video'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Video className={`w-5 h-5 mb-2 ${appointmentType === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-medium text-foreground">Video Call</p>
                <p className="text-xs text-muted-foreground">Online consultation</p>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes for Doctor (Optional)
            </label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="Describe your symptoms or concerns..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            onClick={handleBookAppointment}
            disabled={isBooking}
            className="btn-primary w-full justify-center"
          >
            {isBooking ? 'Booking...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;

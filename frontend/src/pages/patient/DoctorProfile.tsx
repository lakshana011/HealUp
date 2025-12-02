import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, GraduationCap, Clock, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CalendarPicker from '@/components/common/CalendarPicker';
import SlotPicker from '@/components/common/SlotPicker';
import { getDoctorById, getDoctorSlots } from '@/api/doctorApi';
import type { Doctor } from '@/data/mockData';

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      try {
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!id || !selectedDate) return;
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const slots = await getDoctorSlots(id, dateStr);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
  }, [id, selectedDate]);

  if (isLoading) {
    return (
      <DashboardLayout role="patient" title="Doctor Profile">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout role="patient" title="Doctor Profile">
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
    <DashboardLayout role="patient" title="Doctor Profile">
      <Link to="/patient/doctors" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Doctors
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Doctor Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-elevated p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-32 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-2">{doctor.name}</h1>
                <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(doctor.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    {doctor.rating} ({doctor.reviews} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {doctor.experience} years exp.
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {doctor.education}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="font-semibold text-foreground mb-3">About</h2>
            <p className="text-muted-foreground">{doctor.bio}</p>
          </div>

          <div className="card-elevated p-6">
            <h2 className="font-semibold text-foreground mb-3">Consultation Fee</h2>
            <p className="text-2xl font-bold text-primary">${doctor.consultationFee}</p>
            <p className="text-sm text-muted-foreground">per consultation</p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="space-y-6">
          <CalendarPicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {selectedDate && (
            <div className="card-elevated p-4">
              <SlotPicker
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            </div>
          )}

          {selectedDate && selectedSlot && (
            <Link
              to={`/patient/book/${doctor.id}?date=${selectedDate.toISOString().split('T')[0]}&time=${selectedSlot}`}
              className="btn-primary w-full justify-center"
            >
              Continue to Booking
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;

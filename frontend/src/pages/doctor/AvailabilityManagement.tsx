import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { updateDoctorAvailability } from '@/api/doctorApi';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

interface DaySchedule {
  enabled: boolean;
  slots: string[];
}

const AvailabilityManagement = () => {
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    Monday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    Tuesday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    Wednesday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    Thursday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    Friday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00'] },
    Saturday: { enabled: false, slots: [] },
    Sunday: { enabled: false, slots: [] },
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: !prev[day].enabled ? defaultSlots.slice(0, 4) : [],
      }
    }));
  };

  const toggleSlot = (day: string, slot: string) => {
    setSchedule(prev => {
      const daySchedule = prev[day];
      const hasSlot = daySchedule.slots.includes(slot);
      return {
        ...prev,
        [day]: {
          ...daySchedule,
          slots: hasSlot
            ? daySchedule.slots.filter(s => s !== slot)
            : [...daySchedule.slots, slot].sort(),
        }
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Flatten all slots for saving
      const allSlots = Object.entries(schedule)
        .filter(([_, day]) => day.enabled)
        .flatMap(([_, day]) => day.slots);
      
      await updateDoctorAvailability('1', allSlots);
      alert('Availability updated successfully!');
    } catch (error) {
      console.error('Error saving availability:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout role="doctor" title="Manage Availability">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Weekly Schedule</h2>
        <p className="text-muted-foreground">Set your available time slots for appointments.</p>
      </div>

      <div className="space-y-4 mb-8">
        {daysOfWeek.map((day) => (
          <div key={day} className="card-elevated p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleDay(day)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    schedule[day].enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div 
                    className={`w-4 h-4 bg-primary-foreground rounded-full transition-transform ${
                      schedule[day].enabled ? 'translate-x-5' : 'translate-x-1'
                    }`} 
                  />
                </button>
                <span className={`font-medium ${schedule[day].enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {day}
                </span>
              </div>
              {schedule[day].enabled && (
                <span className="text-sm text-muted-foreground">
                  {schedule[day].slots.length} slots
                </span>
              )}
            </div>

            {schedule[day].enabled && (
              <div className="flex flex-wrap gap-2">
                {defaultSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(day, slot)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      schedule[day].slots.includes(slot)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-primary/10'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="btn-primary"
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </DashboardLayout>
  );
};

export default AvailabilityManagement;

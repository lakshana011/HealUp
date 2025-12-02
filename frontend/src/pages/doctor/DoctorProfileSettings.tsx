import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, GraduationCap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getDoctorById, updateDoctorAvailability } from '@/api/doctorApi';
import { apiPut } from '@/api/client';
import type { Doctor } from '@/data/mockData';

const DoctorProfileSettings = () => {
  const { user, doctorProfile, loading: authLoading } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    specialty: '',
    experience: 0,
    consultationFee: 0,
    bio: '',
    education: '',
    image: '',
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    // Only proceed if user is a doctor
    if (!user || user.role !== 'doctor') {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        // Get doctor profile - try /doctors/me endpoint first
        let doctorData: Doctor | null = null;
        
        try {
          const { apiGet } = await import('@/api/client');
          const token = localStorage.getItem('healup-token') || undefined;
          doctorData = await apiGet<Doctor>('/doctors/me', token);
        } catch (e) {
          console.error('Failed to load doctor profile via /doctors/me', e);
          // Fallback: try using doctorProfile.id from /auth/me
          if (doctorProfile?.id) {
            try {
              doctorData = await getDoctorById(doctorProfile.id);
            } catch (e2) {
              console.error('Failed to load doctor profile by id', e2);
            }
          }
        }
        
        // If still no data, create a basic profile from user data
        if (!doctorData && user) {
          doctorData = {
            id: user.id,
            name: user.name,
            specialty: '',
            experience: 0,
            rating: 5.0,
            reviews: 0,
            image: '',
            bio: '',
            education: '',
            availableSlots: [],
            consultationFee: 0,
          } as Doctor;
        }
        
        if (doctorData) {
          setDoctor(doctorData);
          setProfile({
            name: doctorData.name || '',
            specialty: doctorData.specialty || '',
            experience: doctorData.experience || 0,
            consultationFee: doctorData.consultationFee || 0,
            bio: doctorData.bio || '',
            education: doctorData.education || '',
            image: doctorData.image || '',
          });
        }
      } catch (error) {
        console.error('Failed to load doctor profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user, doctorProfile, authLoading]);


  const handleSave = async () => {
    if (!doctor || !user) return;
    
    setIsSaving(true);
    try {
      await apiPut(`/doctors/me`, profile, localStorage.getItem('healup-token') || undefined);
      alert('Profile saved successfully!');
      // Reload doctor data
      const updated = await getDoctorById(doctor.id);
      if (updated) {
        setDoctor(updated);
        setProfile({
          name: updated.name || '',
          specialty: updated.specialty || '',
          experience: updated.experience || 0,
          consultationFee: updated.consultationFee || 0,
          bio: updated.bio || '',
          education: updated.education || '',
          image: updated.image || '',
        });
      }
    } catch (error) {
      console.error('Failed to save profile', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading while auth is loading or profile is loading
  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar role="doctor" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  // If auth finished but no user or not doctor, show error (redirect should happen)
  if (!user || user.role !== 'doctor') {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar role="doctor" />
        <main className="flex-1 p-8">
          <p className="text-muted-foreground">Please log in as a doctor to view your profile.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="doctor" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your doctor profile information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Photo */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-foreground">{profile.name || user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Professional Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      className="pl-10 h-12 rounded-xl"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <div className="relative mt-2">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="specialty"
                      type="text"
                      className="pl-10 h-12 rounded-xl"
                      value={profile.specialty}
                      onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    className="h-12 rounded-xl mt-2"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="fee">Consultation Fee (₹)</Label>
                  <Input
                    id="fee"
                    type="number"
                    className="h-12 rounded-xl mt-2"
                    value={profile.consultationFee}
                    onChange={(e) => setProfile({ ...profile, consultationFee: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <div className="relative mt-2">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="education"
                      type="text"
                      className="pl-10 h-12 rounded-xl"
                      value={profile.education}
                      onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    className="h-12 rounded-xl mt-2"
                    value={profile.image}
                    onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    className="rounded-xl mt-2 min-h-24"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell patients about your expertise and approach..."
                  />
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="mt-6">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfileSettings;


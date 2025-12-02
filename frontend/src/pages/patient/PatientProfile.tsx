import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getPatientById, updatePatient } from '@/api/patientApi';

const PatientProfile = () => {
  const { user, patientProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    age: 0,
    gender: '',
    bloodGroup: '',
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) return;
    
    // Only redirect if auth is done and user is not a patient
    if (!authLoading && (!user || user.role !== 'patient')) {
      navigate('/login');
      return;
    }

    // If no user yet, don't proceed
    if (!user) return;

    const load = async () => {
      try {
        if (patientProfile?.id) {
          const data = await getPatientById(patientProfile.id);
          if (data) {
            setProfile({
              name: data.name || user.name || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              address: data.address || '',
              age: data.age || 0,
              gender: data.gender || '',
              bloodGroup: data.bloodGroup || '',
            });
          }
        } else {
          // Use user data as fallback
          setProfile({
            name: user.name || '',
            email: user.email || '',
            phone: '',
            address: '',
            age: 0,
            gender: '',
            bloodGroup: '',
          });
        }
      } catch (error) {
        console.error('Failed to load patient profile', error);
        // Fallback to user data
        setProfile({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          address: '',
          age: 0,
          gender: '',
          bloodGroup: '',
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user, patientProfile, authLoading, navigate]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const patientId = patientProfile?.id || user.id;
      await updatePatient(patientId, profile);
      alert('Profile saved successfully!');
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
        <DashboardSidebar role="patient" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  // If auth finished but no user, show error (redirect should have happened)
  if (!user || user.role !== 'patient') {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar role="patient" />
        <main className="flex-1 p-8">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="patient" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Photo */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Personal Information</h2>

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
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 h-12 rounded-xl"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10 h-12 rounded-xl"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    className="h-12 rounded-xl mt-2"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    type="text"
                    className="h-12 rounded-xl mt-2"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    placeholder="Male/Female/Other"
                  />
                </div>
                <div>
                  <Label htmlFor="blood">Blood Group</Label>
                  <Input
                    id="blood"
                    type="text"
                    className="h-12 rounded-xl mt-2"
                    value={profile.bloodGroup}
                    onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                    placeholder="A+, B+, O+, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-4 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="address"
                      type="text"
                      className="pl-10 h-12 rounded-xl"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>
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

export default PatientProfile;

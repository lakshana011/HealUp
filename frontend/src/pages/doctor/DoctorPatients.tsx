import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllPatients } from '@/api/patientApi';
import type { Patient } from '@/data/mockData';

const DoctorPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="doctor" title="Patients">
      {/* Search */}
      <div className="card-elevated p-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Patients List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-elevated p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPatients.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <Link
              key={patient.id}
              to={`/doctor/patient/${patient.id}`}
              className="card-elevated p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">{patient.email}</p>
                  <p className="text-xs text-muted-foreground">{patient.age} years, {patient.gender}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card-elevated p-8 text-center">
          <p className="text-muted-foreground">No patients found</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorPatients;

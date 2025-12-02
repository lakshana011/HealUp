import { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllPatients } from '@/api/patientApi';
import type { Patient } from '@/data/mockData';

const AdminPatients = () => {
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
    <DashboardLayout role="admin" title="Patients">
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

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Patient</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Phone</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Age</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Blood Group</th>
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
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.phone}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.age}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{patient.bloodGroup}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No patients found
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

export default AdminPatients;

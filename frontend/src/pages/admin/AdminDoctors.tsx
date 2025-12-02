import { useEffect, useState } from 'react';
import { Search, Star } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllDoctors } from '@/api/doctorApi';
import type { Doctor } from '@/data/mockData';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" title="Doctors">
      {/* Search */}
      <div className="card-elevated p-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search doctors..."
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
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Doctor</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Specialty</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Experience</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Rating</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Fee</th>
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
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-foreground">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doctor.specialty}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doctor.experience} years</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-foreground">{doctor.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">${doctor.consultationFee}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No doctors found
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

export default AdminDoctors;

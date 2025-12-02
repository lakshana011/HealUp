import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DoctorCard from '@/components/common/DoctorCard';
import { getAllDoctors, getDoctorsBySpecialty, searchDoctors } from '@/api/doctorApi';
import type { Doctor } from '@/data/mockData';
import { SPECIALTIES } from '@/constants/specialties';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        let data: Doctor[];
        if (searchQuery) {
          data = await searchDoctors(searchQuery);
        } else if (selectedSpecialty !== 'all') {
          data = await getDoctorsBySpecialty(selectedSpecialty);
        } else {
          data = await getAllDoctors();
        }
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedSpecialty]);

  return (
    <DashboardLayout role="patient" title="Find Doctors">
      {/* Search & Filters */}
      <div className="card-elevated p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Specialty Filter */}
          <div className="relative w-full md:w-64">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              className="input-field pl-10 appearance-none"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="all">All Specialties</option>
              {SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          {isLoading ? 'Searching...' : `${doctors.length} doctors found`}
        </p>
      </div>

      {/* Doctor Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-elevated p-4 animate-pulse">
              <div className="w-full h-48 bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="card-elevated p-8 text-center">
          <p className="text-muted-foreground">No doctors found matching your criteria</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SearchDoctors;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Calendar, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/common/StatCard';
import { getAllDoctors } from '@/api/doctorApi';
import { getAllPatients } from '@/api/patientApi';
import { getAllAppointments } from '@/api/appointmentApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctors, patients, appointments] = await Promise.all([
          getAllDoctors(),
          getAllPatients(),
          getAllAppointments(),
        ]);
        
        setStats({
          doctors: doctors.length,
          patients: patients.length,
          appointments: appointments.length,
          revenue: appointments.length * 150, // Mock calculation
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your platform's performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Doctors"
          value={stats.doctors}
          icon={Stethoscope}
        />
        <StatCard
          title="Total Patients"
          value={stats.patients}
          icon={Users}
        />
        <StatCard
          title="Appointments"
          value={stats.appointments}
          icon={Calendar}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/admin/doctors" className="card-elevated p-6 hover:shadow-lg transition-shadow">
          <Stethoscope className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground">Manage Doctors</h3>
          <p className="text-sm text-muted-foreground">View and manage all doctors</p>
        </Link>
        <Link to="/admin/patients" className="card-elevated p-6 hover:shadow-lg transition-shadow">
          <Users className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground">Manage Patients</h3>
          <p className="text-sm text-muted-foreground">View and manage all patients</p>
        </Link>
        <Link to="/admin/appointments" className="card-elevated p-6 hover:shadow-lg transition-shadow">
          <Calendar className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground">View Appointments</h3>
          <p className="text-sm text-muted-foreground">Monitor all appointments</p>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

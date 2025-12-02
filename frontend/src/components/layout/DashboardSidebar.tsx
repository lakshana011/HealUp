import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock, 
  Settings, 
  LogOut,
  Search,
  FileText,
  CreditCard,
  User
} from 'lucide-react';

interface SidebarProps {
  role: 'patient' | 'doctor' | 'admin';
}

const DashboardSidebar = ({ role }: SidebarProps) => {
  const location = useLocation();

  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Find Doctors', path: '/patient/doctors', icon: Search },
    { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Appointment History', path: '/patient/history', icon: FileText },
    { name: 'Profile', path: '/patient/profile', icon: User },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Availability', path: '/doctor/availability', icon: Clock },
    { name: 'Patients', path: '/doctor/patients', icon: Users },
    { name: 'Profile', path: '/doctor/profile', icon: User },
    { name: 'Settings', path: '/doctor/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', path: '/admin/doctors', icon: User },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'patient' ? patientLinks : role === 'doctor' ? doctorLinks : adminLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">HealUp</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <Link
        to="/login"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-4"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </Link>
    </aside>
  );
};

export default DashboardSidebar;

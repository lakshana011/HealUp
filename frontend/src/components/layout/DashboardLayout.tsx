import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { Bell, Search } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'patient' | 'doctor' | 'admin';
  title: string;
}

const DashboardLayout = ({ children, role, title }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="input-field pl-10 py-2 w-64"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              JD
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

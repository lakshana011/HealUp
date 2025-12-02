# HealUp - Doctor-Patient Appointment Booking Platform

A modern, clean React application for booking medical appointments with trusted doctors.

![HealUp](https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800)

## Features

### For Patients
- 🔍 Search and filter doctors by specialty
- 📅 View doctor profiles and available time slots
- 📝 Book appointments (in-person or video consultation)
- 💳 Payment page (UI only)
- 📊 Dashboard with appointment overview
- 📜 Appointment history

### For Doctors
- 📊 Dashboard with today's appointments
- ⏰ Manage availability and time slots
- 👥 View patient list and details
- ✅ Complete or cancel appointments

### For Admin
- 📈 Overview dashboard with statistics
- 👨‍⚕️ Manage doctors
- 👥 Manage patients
- 📅 View all appointments

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client (for future API calls)
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd healup

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── api/                    # Placeholder API functions
│   ├── authApi.ts         # Authentication endpoints
│   ├── doctorApi.ts       # Doctor-related endpoints
│   ├── patientApi.ts      # Patient-related endpoints
│   └── appointmentApi.ts  # Appointment endpoints
├── components/
│   ├── common/            # Reusable components
│   │   ├── AppointmentCard.tsx
│   │   ├── CalendarPicker.tsx
│   │   ├── DoctorCard.tsx
│   │   ├── Modal.tsx
│   │   ├── SlotPicker.tsx
│   │   └── StatCard.tsx
│   ├── layout/            # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── ui/                # Shadcn UI components
├── data/
│   └── mockData.ts        # Mock data for development
├── pages/
│   ├── admin/             # Admin pages
│   ├── auth/              # Authentication pages
│   ├── doctor/            # Doctor dashboard pages
│   └── patient/           # Patient dashboard pages
└── App.tsx                # Main app with routes
```

## Connecting to Backend

All API functions are located in `/src/api/`. Each function includes comments indicating which FastAPI endpoint to use:

```typescript
// Example from doctorApi.ts
// Later replace with FastAPI endpoint: GET /doctors
export const getAllDoctors = async (): Promise<Doctor[]> => {
  // Currently returns mock data
  // Replace with: return axios.get('/api/doctors').then(res => res.data);
};
```

## Available Routes

### Public
- `/` - Landing page
- `/doctors` - Browse doctors
- `/login` - Patient login
- `/doctor/login` - Doctor login
- `/signup` - Registration

### Patient Dashboard
- `/patient/dashboard` - Overview
- `/patient/doctors` - Search doctors
- `/doctor/:id` - Doctor profile
- `/patient/book/:doctorId` - Book appointment
- `/patient/appointments` - My appointments
- `/patient/history` - Appointment history

### Doctor Dashboard
- `/doctor/dashboard` - Overview
- `/doctor/appointments` - All appointments
- `/doctor/availability` - Manage schedule
- `/doctor/patients` - Patient list
- `/doctor/patient/:id` - Patient details

### Admin Dashboard
- `/admin/dashboard` - Overview
- `/admin/doctors` - Manage doctors
- `/admin/patients` - Manage patients
- `/admin/appointments` - All appointments

## Customization

### Colors
Edit `src/index.css` to change the color scheme. The primary color is teal:
```css
--primary: 168 80% 32%;
```

### Mock Data
Edit `src/data/mockData.ts` to modify sample data.

## License

MIT License - feel free to use this project for learning or commercial purposes.

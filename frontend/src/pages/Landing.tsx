import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DoctorCard from '@/components/common/DoctorCard';
import { getAllDoctors } from '@/api/doctorApi';
import type { Doctor } from '@/data/mockData';
import { SPECIALTIES } from '@/constants/specialties';

const Landing = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load doctors for landing page', error);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Book Appointments<br />with Trusted Doctors
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Find and schedule visits with verified healthcare professionals anytime and anywhere. Your health is just a click away.
              </p>
              <div className="flex flex-wrap gap-4">
                {/* Force user to sign in before booking */}
                <Link to="/login" className="btn-primary">
                  Book an appointment <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="btn-secondary">
                  How it works
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-foreground">1200+</p>
                  <p className="text-muted-foreground text-sm">Happy patients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">200+</p>
                  <p className="text-muted-foreground text-sm">Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">99%</p>
                  <p className="text-muted-foreground text-sm">Success rate</p>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600"
                alt="Doctor"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">About Us</h2>
              <p className="text-muted-foreground mb-6">
                At HealUp, we are redefining how healthcare connects with people. Our platform makes it simple to find trusted doctors, book appointments, and access quality care all in one place.
              </p>
              <p className="text-muted-foreground mb-6">
                Whether you need a pediatrician for your child, a cardiologist for a checkup, or an online consultation from home, HealUp helps you get the right care faster.
              </p>
              <Link to="/about" className="btn-primary">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500"
                alt="Medical consultation"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Find a Doctor</h3>
              <p className="text-muted-foreground text-sm">
                Search for a specialist easily and explore doctors instantly
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Book Appointment</h3>
              <p className="text-muted-foreground text-sm">
                Choose a date and time for consultation
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Get Consultation</h3>
              <p className="text-muted-foreground text-sm">
                Speak to a specialist online or in-person
              </p>
            </div>
          </div>
          
          <div className="text-center">
            {/* Also send Book Now to login so flow is consistent */}
            <Link to="/login" className="btn-primary">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Team / Doctors */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/doctors" className="btn-primary">
              See more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Book Appointment Form */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="section-title mb-8">Book An Appointment</h2>
          
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="First name" className="input-field" />
              <input type="text" placeholder="Last name" className="input-field" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select className="input-field">
                <option value="">Select Department</option>
                {SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <select className="input-field">
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="email" placeholder="Email address" className="input-field" />
              <input type="tel" placeholder="Phone Number" className="input-field" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="date" className="input-field" />
              <input type="time" className="input-field" />
            </div>
            <div className="text-center pt-4">
              <button type="submit" className="btn-primary">
                Book an appointment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

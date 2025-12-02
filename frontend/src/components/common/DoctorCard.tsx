import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Doctor } from '@/data/mockData';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="card-elevated p-4">
      <div className="relative mb-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
      
      <h3 className="font-semibold text-foreground mb-1">{doctor.name}</h3>
      
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(doctor.rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({doctor.reviews})</span>
      </div>
      
      <p className="text-sm text-primary font-medium mb-1">{doctor.specialty}</p>
      <p className="text-sm text-muted-foreground mb-4">{doctor.experience} years experience</p>
      
      <Link
        to={`/doctor/${doctor.id}`}
        className="btn-secondary w-full justify-center text-sm py-2"
      >
        View Profile
      </Link>
    </div>
  );
};

export default DoctorCard;

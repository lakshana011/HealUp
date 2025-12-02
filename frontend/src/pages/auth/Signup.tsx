import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { signupUser } from '@/api/authApi';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' as 'patient' | 'doctor',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await signupUser(formData);
      if (response.success) {
        localStorage.setItem('healup-token', response.token || '');
        localStorage.setItem('healup-user', JSON.stringify(response.user));
        navigate(formData.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="card-elevated w-full max-w-md p-8 animate-fade-up">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">HealUp</span>
        </Link>

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Create an account</h1>
        <p className="text-muted-foreground text-center mb-8">Join HealUp today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'patient' })}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                formData.role === 'patient'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              I'm a Patient
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'doctor' })}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                formData.role === 'doctor'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              I'm a Doctor
            </button>
          </div>

          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Full name"
              className="input-field pl-10"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              className="input-field pl-10"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input-field pl-10 pr-10"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="rounded border-border mt-1" required />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

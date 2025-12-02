import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await loginUser(formData);
      if (response.success) {
        localStorage.setItem('healup-token', response.token || '');
        localStorage.setItem('healup-user', JSON.stringify(response.user));
        navigate('/patient/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
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

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-center mb-8">Sign in to your patient account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="rounded border-border" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-border">
          <Link
            to="/doctor/login"
            className="btn-secondary w-full justify-center text-sm"
          >
            Sign in as Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

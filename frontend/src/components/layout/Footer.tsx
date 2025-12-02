import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-12 border-b border-primary-foreground/20">
          <div>
            <h3 className="text-xl font-bold mb-2">Get the Latest Health Updates</h3>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="input-field bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 flex-1 md:w-64"
            />
            <button className="btn-secondary bg-card text-foreground">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">HealUp</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-4">
              We know how important your health is. Our platform makes it simple to find trusted doctors and book appointments anytime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About</Link></li>
              <li><Link to="/doctors" className="hover:text-primary-foreground transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-semibold mb-4">Departments</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/doctors?specialty=cardiology" className="hover:text-primary-foreground transition-colors">Cardiology</Link></li>
              <li><Link to="/doctors?specialty=dentistry" className="hover:text-primary-foreground transition-colors">Dentistry</Link></li>
              <li><Link to="/doctors?specialty=radiology" className="hover:text-primary-foreground transition-colors">Radiology</Link></li>
              <li><Link to="/doctors?specialty=neurology" className="hover:text-primary-foreground transition-colors">Neurology</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Location</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Unit 4, Wellness Plaza, Order Court, Ikeja, Lagos</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+234 812 345 6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@healup.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-primary-foreground/20">
          <p className="text-sm text-primary-foreground/50">
            © 2024 HealUp. All rights reserved
          </p>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/50">
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

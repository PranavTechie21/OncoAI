import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-start gap-3 group">
              <div className="flex flex-col items-start gap-2">
                {/* Logo with rounded rectangle container */}
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 dark:bg-primary/20 p-2 border border-primary/20">
                    <img 
                      src="/OncoAI.png" 
                      alt="OncoAI Logo" 
                      className="h-10 w-10 object-contain drop-shadow-lg brightness-110"
                    />
                  </div>
                  <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Onco<span className="text-primary">AI</span>
                  </span>
                </div>
                {/* Intelligent Cancer Care tagline */}
                <p className="text-xs font-medium text-primary/80 ml-1">
                  Intelligent Cancer Care
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered personalized cancer treatment planning for better patient outcomes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/patients"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Patients
                </Link>
              </li>
              <li>
                <Link
                  to="/recommendations"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  AI Recommendations
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/documentation"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/api-reference"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  to="/research"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Research Papers
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                contact@oncoai.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Medical Research Center
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 OncoAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

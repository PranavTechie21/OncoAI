import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Mail, Lock, User, AlertCircle, ArrowLeft, Building2, Phone, Shield, Stethoscope } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { apiService } from "@/services/api";

export default function Signup() {
  // Step state
  const [step, setStep] = useState(1);

  // Account (required)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Professional info (some required)
  const [specialty, setSpecialty] = useState("");
  const [subspecialty, setSubspecialty] = useState("");
  const [license, setLicense] = useState("");
  const [npi, setNpi] = useState("");

  // Contact & institution (optional except phone)
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateStep = (): boolean => {
    // Basic required-field validation per step
    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all required account fields.");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    } else if (step === 2) {
      if (!specialty || !license || !npi) {
        setError("Please provide specialty, medical license number, and NPI.");
        return false;
      }
    } else if (step === 3) {
      if (!phone) {
        setError("Please provide a contact phone number.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep()) return;

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role: "doctor",
        phone,
        institution,
        department,
        license,
        npi,
      };

      await apiService.register(name, email, password);
      // Optional: profile extras via /auth/me after login can be added later.

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-success/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header Bar */}
      <div className="w-full border-b border-border/40 bg-card/80 dark:bg-slate-950/80 dark:border-slate-800 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/OncoAI.png" 
              alt="OncoAI Logo" 
              className="h-14 w-14 object-contain transition-transform group-hover:scale-105 drop-shadow-lg brightness-110"
            />
            <span className="text-xl font-bold text-foreground">
              Onco<span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl p-8 shadow-card dark:shadow-2xl border-border/50 dark:bg-slate-800/50 dark:border-slate-700/50">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/OncoAI.png" 
              alt="OncoAI Logo" 
              className="h-32 w-32 object-contain mb-6 drop-shadow-2xl brightness-110 filter"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground text-center mb-2">
              Join OncoAi as a doctor—complete your profile in a few quick steps.
            </p>
            {/* Progress */}
            <div className="w-full mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Profile completion</span>
                <span>{Math.round((step / 4) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step content */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">1. Account details</h2>
                <p className="text-xs text-muted-foreground">Required: basic login details.</p>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Dr. Sarah Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">2. Professional details</h2>
                <p className="text-xs text-muted-foreground">
                  Required: specialty, license, and NPI. Subspecialty is optional.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="specialty">Primary Specialty *</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="specialty"
                        placeholder="Medical Oncology"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="subspecialty">Subspecialty (optional)</Label>
                    <Input
                      id="subspecialty"
                      placeholder="Breast & Thoracic Oncology"
                      value={subspecialty}
                      onChange={(e) => setSubspecialty(e.target.value)}
                      className="dark:bg-slate-900/50 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="license">Medical License Number *</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="license"
                        placeholder="MD-123456"
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                        className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="npi">NPI Number *</Label>
                    <Input
                      id="npi"
                      placeholder="1234567890"
                      value={npi}
                      onChange={(e) => setNpi(e.target.value)}
                      className="dark:bg-slate-900/50 dark:border-slate-700"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">3. Contact & institution</h2>
                <p className="text-xs text-muted-foreground">
                  Phone is required; other fields help personalize analytics but are optional.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="institution">Institution (optional)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="institution"
                        placeholder="Memorial Cancer Center"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="pl-10 dark:bg-slate-900/50 dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="department">Department (optional)</Label>
                    <Input
                      id="department"
                      placeholder="Oncology Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="dark:bg-slate-900/50 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="location">Location (optional)</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="dark:bg-slate-900/50 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">4. Review & create account</h2>
                <p className="text-xs text-muted-foreground">
                  Check that your details look correct before creating your OncoAi account.
                </p>
                <div className="grid gap-3 text-sm bg-muted/40 dark:bg-slate-900/40 p-4 rounded-xl">
                  <div>
                    <p className="font-medium">Name & Email</p>
                    <p className="text-muted-foreground">{name} · {email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Specialty</p>
                    <p className="text-muted-foreground">
                      {specialty || "Not set"}{subspecialty ? ` • ${subspecialty}` : ""}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium">License</p>
                      <p className="text-muted-foreground">{license || "Not set"}</p>
                    </div>
                    <div>
                      <p className="font-medium">NPI</p>
                      <p className="text-muted-foreground">{npi || "Not set"}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{phone || "Not set"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Institution</p>
                      <p className="text-muted-foreground">
                        {institution || "Not set"}{department ? ` • ${department}` : ""}
                      </p>
                    </div>
                  </div>
                  {location && (
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1 || loading}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (validateStep()) setStep((s) => Math.min(4, s + 1));
                  }}
                  disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}










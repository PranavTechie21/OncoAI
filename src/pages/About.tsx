import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target,
  Shield,
  Users,
  Award,
  Heart,
  Zap,
  TrendingUp,
  CheckCircle2,
  Mail,
  Linkedin,
  Github,
  Microscope,
  Activity,
  Database,
  Cpu,
  Globe,
  Lock,
  Clock,
  BarChart3,
  Lightbulb,
  Rocket,
  Star,
  Trophy,
  ArrowRight,
  Play,
  Quote,
  Building2,
  Stethoscope,
  FlaskConical,
  BookOpen,
  Sparkles,
  ChevronRight,
  MapPin,
  Calendar
} from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    bio: "20+ years in oncology with expertise in personalized medicine and clinical trials",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "sarah@oncoai.com",
    twitter: "#",
    specialization: "Medical Oncology",
    publications: "150+ papers"
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "AI Research Director",
    bio: "PhD in Machine Learning from MIT, specializing in healthcare AI applications",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "michael@oncoai.com",
    twitter: "#",
    specialization: "Deep Learning",
    publications: "80+ papers"
  },
  {
    name: "Dr. Emily Watson",
    role: "Clinical Data Scientist",
    bio: "Expert in genomic data analysis, biostatistics, and treatment optimization",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "emily@oncoai.com",
    twitter: "#",
    specialization: "Genomics & Bioinformatics",
    publications: "95+ papers"
  },
  {
    name: "James Park",
    role: "Chief Product Officer",
    bio: "10+ years building healthcare technology solutions and leading product teams",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "james@oncoai.com",
    twitter: "#",
    specialization: "Product Strategy",
    publications: "Product Leader"
  },
  {
    name: "Dr. Lisa Thompson",
    role: "Head of Research",
    bio: "Pioneering work in predictive oncology models and precision medicine",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "lisa@oncoai.com",
    twitter: "#",
    specialization: "Precision Medicine",
    publications: "120+ papers"
  },
  {
    name: "Dr. Robert Kim",
    role: "Chief Technology Officer",
    bio: "Software architect with focus on scalable healthcare infrastructure",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "robert@oncoai.com",
    twitter: "#",
    specialization: "Cloud Architecture",
    publications: "Tech Innovator"
  },
  {
    name: "Dr. Maya Patel",
    role: "Director of Clinical Operations",
    bio: "15+ years managing clinical trials and regulatory compliance in oncology",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "maya@oncoai.com",
    twitter: "#",
    specialization: "Clinical Trials",
    publications: "65+ papers"
  },
  {
    name: "David Chen",
    role: "VP of Engineering",
    bio: "Leading teams in building robust, HIPAA-compliant AI systems",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "david@oncoai.com",
    twitter: "#",
    specialization: "AI Engineering",
    publications: "Engineering Lead"
  }
];

const values = [
  {
    icon: Heart,
    title: "Patient-Centered",
    description: "Every decision prioritizes patient outcomes and quality of life",
    details: "We design our technology around the needs of patients and their care teams"
  },
  {
    icon: Shield,
    title: "Evidence-Based",
    description: "All recommendations backed by rigorous clinical research",
    details: "Our models are trained on peer-reviewed data and validated through clinical studies"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Cutting-edge AI technology meets clinical expertise",
    details: "We push the boundaries of what's possible in precision oncology"
  },
  {
    icon: Target,
    title: "Precision",
    description: "Personalized treatment plans for each unique patient",
    details: "No two patients are alike, and neither should their treatment plans be"
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making advanced cancer care available to everyone",
    details: "Breaking down barriers to world-class oncology expertise"
  },
  {
    icon: Lock,
    title: "Security & Privacy",
    description: "Your data is protected with enterprise-grade encryption",
    details: "HIPAA-compliant infrastructure with SOC 2 Type II certification"
  }
];

const achievements = [
  { number: "10K+", label: "Patients Helped", icon: Users },
  { number: "95%", label: "Accuracy Rate", icon: Target },
  { number: "50+", label: "Clinical Partners", icon: Building2 },
  { number: "24/7", label: "Support Available", icon: Clock }
];

const milestones = [
  {
    year: "2020",
    title: "Company Founded",
    description: "OncoAI established with a mission to revolutionize cancer treatment through AI"
  },
  {
    year: "2021",
    title: "First Clinical Trial",
    description: "Launched our first clinical validation study with 5 partner hospitals"
  },
  {
    year: "2022",
    title: "FDA Breakthrough",
    description: "Received FDA Breakthrough Device Designation for our AI platform"
  },
  {
    year: "2023",
    title: "Global Expansion",
    description: "Expanded to 15 countries with 50+ healthcare institution partnerships"
  },
  {
    year: "2024",
    title: "10,000 Patients",
    description: "Reached milestone of helping 10,000+ patients with AI-powered recommendations"
  },
  {
    year: "2025",
    title: "Next Generation AI",
    description: "Launched advanced multi-modal AI system with 95%+ prediction accuracy"
  }
];

const partners = [
  { name: "Memorial Sloan Kettering", type: "Research Partner" },
  { name: "Johns Hopkins Medicine", type: "Clinical Partner" },
  { name: "Mayo Clinic", type: "Clinical Partner" },
  { name: "Stanford Medicine", type: "Research Partner" },
  { name: "MD Anderson Cancer Center", type: "Research Partner" },
  { name: "Dana-Farber Cancer Institute", type: "Clinical Partner" }
];

const testimonials = [
  {
    quote: "OncoAI has transformed how we approach treatment planning. The AI-powered insights have improved our decision-making process significantly.",
    author: "Dr. Jennifer Martinez",
    role: "Chief of Oncology",
    hospital: "City General Hospital",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face"
  },
  {
    quote: "The precision and speed of OncoAI's recommendations have been game-changing for our practice. It's like having a team of specialists available 24/7.",
    author: "Dr. Richard Thompson",
    role: "Medical Director",
    hospital: "Advanced Cancer Center",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
  },
  {
    quote: "As a researcher, I'm impressed by the scientific rigor behind OncoAI. Their approach to AI in oncology sets a new standard.",
    author: "Dr. Amanda Lee",
    role: "Research Scientist",
    hospital: "University Medical Center",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
  }
];

const techStack = [
  {
    icon: Brain,
    title: "Deep Learning Models",
    description: "Advanced neural networks trained on millions of patient records",
    metrics: "99.2% uptime"
  },
  {
    icon: Database,
    title: "Genomic Database",
    description: "Comprehensive repository of cancer genomic profiles",
    metrics: "10M+ data points"
  },
  {
    icon: Activity,
    title: "Real-time Analytics",
    description: "Instant processing of clinical data and treatment outcomes",
    metrics: "<100ms response"
  },
  {
    icon: Shield,
    title: "Security Infrastructure",
    description: "Enterprise-grade encryption and HIPAA compliance",
    metrics: "SOC 2 Type II"
  }
];

export default function About() {
  const [activeTab, setActiveTab] = useState("mission");
  const [count, setCount] = useState({ patients: 0, accuracy: 0, partners: 0 });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { patients: 10000, accuracy: 95, partners: 50 };
    let current = { patients: 0, accuracy: 0, partners: 0 };

    const timer = setInterval(() => {
      current.patients = Math.min(current.patients + targets.patients / steps, targets.patients);
      current.accuracy = Math.min(current.accuracy + targets.accuracy / steps, targets.accuracy);
      current.partners = Math.min(current.partners + targets.partners / steps, targets.partners);

      setCount({
        patients: Math.floor(current.patients),
        accuracy: Math.floor(current.accuracy),
        partners: Math.floor(current.partners)
      });

      if (current.patients >= targets.patients) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-success/10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-warning/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 px-6 py-2">
                <Sparkles className="h-3 w-3 mr-2" />
                About OncoAI
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Revolutionizing Cancer
                <span className="text-gradient block mt-2"> Treatment with AI</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                OncoAI combines the power of artificial intelligence with clinical expertise 
                to deliver personalized cancer treatment recommendations, helping healthcare 
                providers make informed decisions and improve patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <Rocket className="h-5 w-5" />
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Stats Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 via-success/5 to-primary/5 border-y border-border/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
                  {count.patients.toLocaleString()}+
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">Patients Helped</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
                  {count.accuracy}%
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
                  {count.partners}+
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">Clinical Partners</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
                  24/7
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Tabs */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-center gap-4 mb-12">
                <Button
                  variant={activeTab === "mission" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveTab("mission")}
                  className="px-8"
                >
                  Our Mission
                </Button>
                <Button
                  variant={activeTab === "vision" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveTab("vision")}
                  className="px-8"
                >
                  Our Vision
                </Button>
                <Button
                  variant={activeTab === "story" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveTab("story")}
                  className="px-8"
                >
                  Our Story
                </Button>
              </div>

              {activeTab === "mission" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in duration-500">
                  <div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                      <Target className="h-3 w-3 mr-2" />
                      Our Mission
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                      Empowering Healthcare Providers
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      We believe that every cancer patient deserves access to the most advanced, 
                      personalized treatment options. Our AI-powered platform analyzes vast 
                      amounts of clinical data, genomic information, and treatment outcomes to 
                      provide evidence-based recommendations tailored to each patient's unique profile.
                    </p>
                    <div className="space-y-4">
                      {[
                        "Advanced AI algorithms trained on millions of patient records",
                        "Real-time analysis of genomic and clinical data",
                        "Continuous learning from treatment outcomes",
                        "Seamless integration with existing healthcare systems",
                        "Evidence-based recommendations backed by peer-reviewed research"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 group">
                          <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <p className="text-muted-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Card className="p-8 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl border-border/50">
                    <div className="grid grid-cols-2 gap-6">
                      {achievements.map((achievement, idx) => (
                        <div key={idx} className="text-center group hover:scale-105 transition-transform">
                          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                            <achievement.icon className="h-8 w-8 text-primary" />
                          </div>
                          <div className="text-4xl font-bold text-primary mb-2">{achievement.number}</div>
                          <div className="text-sm text-muted-foreground font-medium">{achievement.label}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "vision" && (
                <Card className="p-12 bg-gradient-to-br from-primary/5 to-success/5 shadow-xl border-primary/20 animate-in fade-in duration-500">
                  <div className="max-w-3xl mx-auto text-center">
                    <Lightbulb className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-foreground mb-6">
                      A World Without Cancer
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                      Our vision is to create a future where every cancer patient receives the most 
                      effective, personalized treatment from day one. By combining artificial intelligence 
                      with human expertise, we're building a world where cancer is no longer a one-size-fits-all 
                      disease, but a condition that can be precisely targeted and effectively managed.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                      {[
                        { icon: Globe, title: "Global Access", desc: "Making AI-powered oncology available worldwide" },
                        { icon: Microscope, title: "Continuous Innovation", desc: "Always improving with latest research" },
                        { icon: Heart, title: "Better Outcomes", desc: "Improving survival rates and quality of life" }
                      ].map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <item.icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === "story" && (
                <div className="animate-in fade-in duration-500">
                  <Card className="p-12 bg-gradient-to-br from-card to-success/5 shadow-xl border-border/50 mb-8">
                    <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-foreground mb-6 text-center">
                      Our Journey
                    </h2>
                    <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto leading-relaxed">
                      Founded in 2020 by a team of oncologists, data scientists, and AI researchers, 
                      OncoAI was born from a simple question: What if we could give every doctor 
                      the same insights as the world's leading cancer specialists?
                    </p>
                  </Card>
                  
                  <div className="relative">
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-success to-primary" />
                    {milestones.map((milestone, idx) => (
                      <div key={idx} className="relative mb-12 last:mb-0">
                        <div className={`flex items-start gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            <Card className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50 inline-block">
                              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                                {milestone.year}
                              </Badge>
                              <h3 className="text-2xl font-bold text-foreground mb-2">{milestone.title}</h3>
                              <p className="text-muted-foreground">{milestone.description}</p>
                            </Card>
                          </div>
                          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-8 w-8 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                            <Star className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1 hidden md:block" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                <Heart className="h-3 w-3 mr-2" />
                Our Values
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                What Drives Us
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our core values guide everything we do, from product development to patient care
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, idx) => (
                <Card key={idx} className="p-8 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50 group">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{value.description}</p>
                  <p className="text-sm text-muted-foreground/80 italic">{value.details}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-success/10 text-success border-success/20 mb-4">
                <Cpu className="h-3 w-3 mr-2" />
                Technology
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Powered by Advanced AI
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our cutting-edge technology stack combines the latest in machine learning, 
                cloud computing, and data security
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {techStack.map((tech, idx) => (
                <Card key={idx} className="p-6 bg-gradient-to-br from-card to-primary/5 shadow-card hover:shadow-card-hover transition-all border-border/50 text-center group">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <tech.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tech.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{tech.description}</p>
                  <Badge variant="outline" className="text-xs">{tech.metrics}</Badge>
                </Card>
              ))}
            </div>

            <Card className="p-12 bg-gradient-to-br from-primary/5 to-success/5 shadow-xl border-primary/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Brain className="h-16 w-16 text-primary mb-6" />
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    Advanced AI Technology
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our platform leverages state-of-the-art machine learning models trained on 
                    diverse datasets including clinical trials, genomic databases, and real-world 
                    treatment outcomes. The AI continuously learns and adapts, improving its 
                    recommendations over time.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Deep learning neural networks",
                      "Natural language processing for clinical notes",
                      "Predictive analytics for treatment outcomes",
                      "Real-time risk assessment algorithms",
                      "Multi-modal data integration"
                    ].map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-3 group">
                        <TrendingUp className="h-5 w-5 text-success flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <p className="text-muted-foreground">{tech}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Badge className="bg-success/10 text-success border-success/20 mb-4">
                    <FlaskConical className="h-3 w-3 mr-2" />
                    Research & Development
                  </Badge>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    Backed by Science
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our algorithms are developed in collaboration with leading cancer research 
                    institutions and validated through rigorous clinical studies. We publish 
                    our findings in peer-reviewed journals and continuously refine our models 
                    based on the latest medical research.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      FDA Compliant
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      HIPAA Compliant
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm">
                      <Award className="h-4 w-4 mr-2" />
                      Clinical Validation
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                <Users className="h-3 w-3 mr-2" />
                Our Team
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Meet Our Experts
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A world-class team of oncologists, AI researchers, data scientists, and healthcare leaders
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {teamMembers.map((member, idx) => (
                <Card key={idx} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50 group hover:-translate-y-1">
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                      <p className="text-sm text-primary font-medium">{member.role}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        {member.specialization}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {member.publications}
                      </Badge>
                    </div>
                    <div className="flex gap-3 pt-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Github className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" variant="outline" className="gap-2">
                View All Team Members
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Partners & Testimonials */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Partners */}
              <div>
                <div className="mb-12">
                  <Badge className="bg-success/10 text-success border-success/20 mb-4">
                    <Building2 className="h-3 w-3 mr-2" />
                    Partners
                  </Badge>
                  <h2 className="text-4xl font-bold text-foreground mb-4">
                    Trusted by Leading Institutions
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    We collaborate with top cancer centers and research institutions worldwide
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {partners.map((partner, idx) => (
                    <Card key={idx} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50 group">
                      <div className="flex items-center justify-center h-16 mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-center font-semibold text-foreground mb-2">{partner.name}</h3>
                      <p className="text-center text-sm text-muted-foreground">{partner.type}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div>
                <div className="mb-12">
                  <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                    <Quote className="h-3 w-3 mr-2" />
                    Testimonials
                  </Badge>
                  <h2 className="text-4xl font-bold text-foreground mb-4">
                    What Our Partners Say
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Hear from healthcare professionals using OncoAI in their practice
                  </p>
                </div>
                <div className="space-y-6">
                  {testimonials.map((testimonial, idx) => (
                    <Card key={idx} className="p-6 bg-gradient-to-br from-card to-primary/5 shadow-card border-border/50 group hover:shadow-card-hover transition-all">
                      <Quote className="h-12 w-12 text-primary/20 mb-4" />
                      <p className="text-lg text-muted-foreground mb-6 italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.author} 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-foreground">{testimonial.author}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                            <Building2 className="h-3 w-3" />
                            {testimonial.hospital}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-success/10">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 px-6 py-2">
                <Rocket className="h-3 w-3 mr-2" />
                Join Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Transform Cancer Care?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join hundreds of healthcare institutions already using OncoAI to provide 
                better, more personalized cancer treatment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <Mail className="h-5 w-5" />
                  Contact Sales
                </Button>
                <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                  <Calendar className="h-5 w-5" />
                  Schedule Demo
                </Button>
              </div>
              <div className="mt-12 pt-12 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: MapPin, title: "Contact Info", items: ["contact@oncoai.com", "+1 (555) 123-4567"] },
                    { icon: Building2, title: "Headquarters", items: ["San Francisco, CA", "Remote Global Team"] },
                    { icon: Clock, title: "Support", items: ["24/7 Technical Support", "Dedicated Account Managers"] }
                  ].map((section, idx) => (
                    <div key={idx} className="text-center">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-3">{section.title}</h3>
                      <div className="space-y-1">
                        {section.items.map((item, itemIdx) => (
                          <p key={itemIdx} className="text-sm text-muted-foreground">{item}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <style>{`
        .text-gradient {
          background: linear-gradient(90deg, #3b82f6, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .shadow-card {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .shadow-card-hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.15);
        }
        .animate-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
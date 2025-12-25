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
  Github
} from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    bio: "20+ years in oncology with expertise in personalized medicine",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "sarah@oncoai.com"
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "AI Research Director",
    bio: "PhD in Machine Learning, specializing in healthcare applications",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "michael@oncoai.com"
  },
  {
    name: "Dr. Emily Watson",
    role: "Clinical Data Scientist",
    bio: "Expert in genomic data analysis and treatment optimization",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "emily@oncoai.com"
  },
  {
    name: "James Park",
    role: "Product Lead",
    bio: "10+ years building healthcare technology solutions",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
    email: "james@oncoai.com"
  }
];

const values = [
  {
    icon: Heart,
    title: "Patient-Centered",
    description: "Every decision prioritizes patient outcomes and quality of life"
  },
  {
    icon: Shield,
    title: "Evidence-Based",
    description: "All recommendations backed by rigorous clinical research"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Cutting-edge AI technology meets clinical expertise"
  },
  {
    icon: Target,
    title: "Precision",
    description: "Personalized treatment plans for each unique patient"
  }
];

const achievements = [
  { number: "10K+", label: "Patients Helped" },
  { number: "95%", label: "Accuracy Rate" },
  { number: "50+", label: "Clinical Partners" },
  { number: "24/7", label: "Support Available" }
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-background to-success/10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
                About OncoAI
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Revolutionizing Cancer
                <span className="text-gradient"> Treatment</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                OncoAI combines the power of artificial intelligence with clinical expertise 
                to deliver personalized cancer treatment recommendations, helping healthcare 
                providers make informed decisions and improve patient outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  Our Mission
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Empowering Healthcare Providers
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
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
                    "Seamless integration with existing healthcare systems"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="p-8 bg-card shadow-card border-border/50">
                <div className="grid grid-cols-2 gap-6">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{achievement.number}</div>
                      <div className="text-sm text-muted-foreground">{achievement.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Our Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Drives Us
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our core values guide everything we do, from product development to patient care.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <Card key={idx} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Our Team
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet the Experts
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A multidisciplinary team of clinicians, researchers, and technologists 
                dedicated to improving cancer care.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, idx) => (
                <Card key={idx} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50 text-center group">
                  <div className="relative mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-border group-hover:border-primary/30 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success border-2 border-card" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Card className="p-8 bg-card shadow-card border-border/50">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Advanced AI Technology
                </h2>
                <p className="text-muted-foreground mb-6">
                  Our platform leverages state-of-the-art machine learning models trained on 
                  diverse datasets including clinical trials, genomic databases, and real-world 
                  treatment outcomes. The AI continuously learns and adapts, improving its 
                  recommendations over time.
                </p>
                <div className="space-y-3">
                  {[
                    "Deep learning neural networks",
                    "Natural language processing for clinical notes",
                    "Predictive analytics for treatment outcomes",
                    "Real-time risk assessment algorithms"
                  ].map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-success flex-shrink-0" />
                      <p className="text-muted-foreground">{tech}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <div>
                <Badge className="bg-success/10 text-success border-success/20 mb-4">
                  Research & Development
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Backed by Science
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Our algorithms are developed in collaboration with leading cancer research 
                  institutions and validated through rigorous clinical studies. We publish 
                  our findings in peer-reviewed journals and continuously refine our models 
                  based on the latest medical research.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="px-4 py-2">FDA Compliant</Badge>
                  <Badge variant="outline" className="px-4 py-2">HIPAA Certified</Badge>
                  <Badge variant="outline" className="px-4 py-2">ISO 27001</Badge>
                  <Badge variant="outline" className="px-4 py-2">Clinical Validated</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <Card className="p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 border-primary/20 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Join Us in Transforming Cancer Care
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're a healthcare provider, researcher, or patient advocate, 
                we'd love to hear from you. Together, we can make personalized cancer 
                treatment accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Users className="h-4 w-4" />
                  Partner With Us
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


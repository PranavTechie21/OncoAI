import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  BookOpen, 
  ArrowRight, 
  Lock,
  Zap,
  FileJson,
  Key,
  Shield,
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertCircle
} from "lucide-react";

const endpoints = [
  { 
    method: "GET", 
    path: "/api/patients", 
    description: "Retrieve all patients with optional filtering and pagination",
    auth: true,
    params: [
      { name: "page", type: "number", required: false, description: "Page number for pagination" },
      { name: "limit", type: "number", required: false, description: "Number of results per page" },
      { name: "status", type: "string", required: false, description: "Filter by patient status" }
    ],
    response: {
      success: true,
      data: [
        { id: 1, name: "John Doe", status: "active" }
      ],
      pagination: { page: 1, limit: 10, total: 100 }
    }
  },
  { 
    method: "GET", 
    path: "/api/patients/:id", 
    description: "Get comprehensive patient details including medical history and genomic data",
    auth: true,
    params: [
      { name: "id", type: "string", required: true, description: "Patient unique identifier" }
    ],
    response: {
      success: true,
      data: {
        id: 1,
        name: "John Doe",
        diagnosis: "Stage II Breast Cancer",
        genomicProfile: { mutations: ["BRCA1"] }
      }
    }
  },
  { 
    method: "POST", 
    path: "/api/recommendations", 
    description: "Generate personalized AI-powered treatment recommendations",
    auth: true,
    params: [
      { name: "patientId", type: "string", required: true, description: "Patient ID" },
      { name: "cancerType", type: "string", required: true, description: "Type of cancer" },
      { name: "stage", type: "string", required: true, description: "Cancer stage" },
      { name: "genomicData", type: "object", required: false, description: "Genomic profile data" }
    ],
    response: {
      success: true,
      data: {
        recommendations: [
          { treatment: "Chemotherapy", confidence: 0.92 }
        ],
        riskScore: 0.35
      }
    }
  },
  { 
    method: "GET", 
    path: "/api/reports", 
    description: "Generate comprehensive patient treatment reports",
    auth: true,
    params: [
      { name: "patientId", type: "string", required: true, description: "Patient ID" },
      { name: "format", type: "string", required: false, description: "Report format (pdf, json)" },
      { name: "dateRange", type: "string", required: false, description: "Date range for report" }
    ],
    response: {
      success: true,
      data: {
        reportId: "RPT-2024-001",
        format: "pdf",
        downloadUrl: "https://..."
      }
    }
  },
  { 
    method: "POST", 
    path: "/api/appointments", 
    description: "Create new appointment for patient consultations",
    auth: true,
    params: [
      { name: "patientId", type: "string", required: true, description: "Patient ID" },
      { name: "providerId", type: "string", required: true, description: "Healthcare provider ID" },
      { name: "dateTime", type: "string", required: true, description: "Appointment date and time" },
      { name: "type", type: "string", required: true, description: "Appointment type" }
    ],
    response: {
      success: true,
      data: {
        appointmentId: "APT-2024-001",
        status: "scheduled",
        dateTime: "2024-03-15T10:00:00Z"
      }
    }
  }
];

const features = [
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "99.9% uptime with sub-100ms response times"
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "End-to-end encryption and HIPAA compliance"
  },
  {
    icon: FileJson,
    title: "RESTful Design",
    description: "Simple, predictable API following REST principles"
  },
  {
    icon: Key,
    title: "Easy Authentication",
    description: "Secure API key and OAuth 2.0 support"
  }
];

const quickStart = [
  {
    step: "1",
    title: "Get API Key",
    description: "Sign up and generate your API key from the dashboard"
  },
  {
    step: "2",
    title: "Make Request",
    description: "Include your API key in the Authorization header"
  },
  {
    step: "3",
    title: "Handle Response",
    description: "Process JSON responses and integrate with your system"
  }
];

export default function ApiReference() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

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
                API v1.0
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                API
                <span className="text-gradient"> Reference</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Comprehensive API documentation for integrating OncoAI's advanced cancer treatment 
                recommendation system into your healthcare applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Code className="h-4 w-4" />
                  Get API Key
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  View Full Docs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <Card key={idx} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="bg-success/10 text-success border-success/20 mb-4">
                  Quick Start
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Get Started in Minutes
                </h2>
                <p className="text-lg text-muted-foreground">
                  Follow these simple steps to integrate OncoAI API into your application
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {quickStart.map((item, idx) => (
                  <Card key={idx} className="p-6 bg-card shadow-card border-border/50 relative">
                    <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 mt-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-6 bg-card shadow-card border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Example Request</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => copyToClipboard('curl -X POST https://api.oncoai.com/v1/recommendations')}>
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-foreground">{`curl -X POST https://api.oncoai.com/v1/recommendations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "patientId": "PT-12345",
    "cancerType": "breast",
    "stage": "II"
  }'`}</code>
                </pre>
              </Card>
            </div>
          </div>
        </section>

        {/* Authentication Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  Authentication
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Secure API Access
                </h2>
                <p className="text-lg text-muted-foreground">
                  All API requests require authentication using your API key
                </p>
              </div>

              <Card className="p-8 bg-card shadow-card border-border/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">API Key Authentication</h3>
                    <p className="text-muted-foreground mb-4">
                      Include your API key in the Authorization header of every request. You can generate 
                      and manage your API keys from your dashboard.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <code className="text-sm text-foreground">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>

                <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Keep your API key secure</p>
                    <p className="text-sm text-muted-foreground">
                      Never share your API key publicly or commit it to version control. Rotate keys regularly 
                      and use environment variables in production.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* API Endpoints Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  Endpoints
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Available Endpoints
                </h2>
                <p className="text-lg text-muted-foreground">
                  All endpoints return JSON responses and require authentication
                </p>
              </div>

              <div className="space-y-6">
                {endpoints.map((endpoint, idx) => (
                  <Card key={idx} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-all border-border/50">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge 
                            className={`font-mono ${
                              endpoint.method === 'GET' 
                                ? 'bg-success/10 text-success border-success/20' 
                                : 'bg-primary/10 text-primary border-primary/20'
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono text-foreground bg-muted px-3 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-muted-foreground mb-3">{endpoint.description}</p>
                        {endpoint.auth && (
                          <div className="flex items-center gap-2 text-sm">
                            <Lock className="h-4 w-4 text-warning" />
                            <span className="text-muted-foreground">Authentication Required</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Parameters */}
                    {endpoint.params && endpoint.params.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <FileJson className="h-4 w-4 text-primary" />
                          Parameters
                        </h4>
                        <div className="space-y-3">
                          {endpoint.params.map((param, pidx) => (
                            <div key={pidx} className="flex flex-col sm:flex-row sm:items-start gap-2 bg-muted/30 p-3 rounded-lg">
                              <div className="flex items-center gap-2 min-w-[200px]">
                                <code className="text-sm font-mono text-foreground">{param.name}</code>
                                <Badge variant="outline" className="text-xs">{param.type}</Badge>
                                {param.required && (
                                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Example */}
                    {endpoint.response && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            Response Example
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => copyToClipboard(JSON.stringify(endpoint.response, null, 2))}
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code className="text-foreground">
                            {JSON.stringify(endpoint.response, null, 2)}
                          </code>
                        </pre>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-card shadow-card border-border/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">Rate Limits</h3>
                    <p className="text-muted-foreground">
                      API requests are rate-limited to ensure fair usage and system stability.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-1">1,000</div>
                    <div className="text-sm text-muted-foreground">Requests per hour</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-1">10,000</div>
                    <div className="text-sm text-muted-foreground">Requests per day</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-1">∞</div>
                    <div className="text-sm text-muted-foreground">Enterprise plans</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <Card className="p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 border-primary/20 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Need More Details?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Check out our comprehensive documentation for detailed guides, code examples, 
                and best practices for integrating with the OncoAI API.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  View Full Documentation
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  API Status
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
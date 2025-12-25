import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const endpoints = [
  {
    method: "GET",
    path: "/api/patients",
    description: "Retrieve all patients",
    auth: true
  },
  {
    method: "GET",
    path: "/api/patients/:id",
    description: "Get patient details by ID",
    auth: true
  },
  {
    method: "POST",
    path: "/api/recommendations",
    description: "Generate AI treatment recommendations",
    auth: true
  },
  {
    method: "GET",
    path: "/api/reports",
    description: "Generate patient reports",
    auth: true
  },
  {
    method: "POST",
    path: "/api/appointments",
    description: "Create new appointment",
    auth: true
  }
];

export default function ApiReference() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-success/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-border">
          <div className="container relative">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">API v1</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                API Reference
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Detailed API endpoints, parameters, and response schemas for integrating with OncoAI.
              </p>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="py-16">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Endpoints</h2>
              <p className="text-muted-foreground">All API endpoints require authentication</p>
            </div>

            <div className="space-y-4">
              {endpoints.map((endpoint, idx) => (
                <Card key={idx} className="p-6 bg-card shadow-lg dark:shadow-xl border-border/50 dark:border-slate-700/50 hover:shadow-xl dark:hover:shadow-2xl transition-all">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Badge className={`w-fit ${
                      endpoint.method === "GET" ? "bg-success/10 text-success border-success/20" :
                      endpoint.method === "POST" ? "bg-primary/10 text-primary border-primary/20" :
                      "bg-warning/10 text-warning border-warning/20"
                    }`}>
                      {endpoint.method}
                    </Badge>
                    <code className="flex-1 font-mono text-sm bg-muted dark:bg-slate-800 px-4 py-2 rounded-lg">
                      {endpoint.path}
                    </code>
                    <p className="text-muted-foreground">{endpoint.description}</p>
                    {endpoint.auth && (
                      <Badge variant="outline" className="w-fit">Auth Required</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <Card className="mt-12 p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 dark:from-primary/20 dark:via-primary/10 dark:to-success/20 border-primary/20 dark:border-primary/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Need More Details?</h3>
                    <p className="text-muted-foreground">Check out our full documentation</p>
                  </div>
                </div>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <Link to="/documentation">
                    View Documentation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
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

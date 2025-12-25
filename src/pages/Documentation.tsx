import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, FileText, Download, ArrowRight, Sparkles, Terminal, Book, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const docsSections = [
  {
    title: "Getting Started",
    description: "Learn how to set up and integrate OncoAI into your workflow with step-by-step guides",
    icon: BookOpen,
    link: "#getting-started",
    color: "primary"
  },
  {
    title: "Authentication",
    description: "Understand how to authenticate and manage secure API access for your applications",
    icon: Terminal,
    link: "#authentication",
    color: "success"
  },
  {
    title: "SDKs & Examples",
    description: "Code examples and SDKs for popular programming languages with real-world use cases",
    icon: Code,
    link: "#sdks",
    color: "warning"
  },
  {
    title: "API Reference",
    description: "Complete API documentation with detailed endpoints, schemas, and response formats",
    icon: FileText,
    link: "/api-reference",
    color: "primary"
  }
];

const quickLinks = [
  { title: "API Quickstart", description: "Get up and running in 5 minutes", icon: Zap },
  { title: "Best Practices", description: "Learn optimization techniques", icon: Book },
  { title: "Code Samples", description: "Browse example implementations", icon: Code }
];

export default function Documentation() {
  const getColorClasses = (color: string) => {
    switch(color) {
      case "success":
        return {
          bg: "from-success/20 via-success/10 to-transparent dark:from-success/30 dark:via-success/20",
          hover: "group-hover:border-success/50 dark:group-hover:border-success/60",
          text: "group-hover:text-success",
          iconBg: "bg-success/10 dark:bg-success/20"
        };
      case "warning":
        return {
          bg: "from-warning/20 via-warning/10 to-transparent dark:from-warning/30 dark:via-warning/20",
          hover: "group-hover:border-warning/50 dark:group-hover:border-warning/60",
          text: "group-hover:text-warning",
          iconBg: "bg-warning/10 dark:bg-warning/20"
        };
      default:
        return {
          bg: "from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20",
          hover: "group-hover:border-primary/50 dark:group-hover:border-primary/60",
          text: "group-hover:text-primary",
          iconBg: "bg-primary/10 dark:bg-primary/20"
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-background to-success/10 dark:from-primary/20 dark:via-slate-950 dark:to-success/20 border-b border-border/50 dark:border-slate-800">
          <div className="absolute inset-0 opacity-40 dark:opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-20 w-80 h-80 bg-success/20 dark:bg-success/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(120,119,198,0.15),transparent_50%)]" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 mb-8">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">Developer Resources</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Documentation
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10">
                Find product guides, integration instructions, and developer documentation to help you build with OncoAI.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn px-8 py-6 text-lg">
                  <Book className="h-5 w-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                  Quick Start Guide
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button variant="outline" size="lg" className="gap-2 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-300 px-8 py-6 text-lg">
                  <Code className="h-5 w-5" />
                  API Reference
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Bar */}
        <section className="py-8 bg-muted/30 dark:bg-slate-900/30 border-b border-border/50 dark:border-slate-800">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickLinks.map((link, idx) => (
                <Card key={idx} className="p-4 bg-card/50 backdrop-blur-sm border-border/50 dark:border-slate-700/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</h4>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explore Documentation
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to integrate and build with OncoAI's powerful platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {docsSections.map((section, idx) => {
                const colors = getColorClasses(section.color);
                return (
                  <Card 
                    key={idx} 
                    className={`p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 ${colors.hover} relative overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg.replace('dark:from', 'via-transparent to-transparent dark:from').replace('dark:via', 'dark:via')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <div className="flex items-start gap-6">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                          <section.icon className={`h-8 w-8 ${section.color === 'success' ? 'text-success' : section.color === 'warning' ? 'text-warning' : 'text-primary'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-2xl font-bold text-foreground mb-3 ${colors.text} transition-colors duration-300`}>
                            {section.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-6">
                            {section.description}
                          </p>
                          {section.link.startsWith("/") ? (
                            <Button variant="ghost" className={`gap-2 ${colors.text} group-hover:gap-3 transition-all duration-300`} asChild>
                              <Link to={section.link}>
                                Learn More
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </Link>
                            </Button>
                          ) : (
                            <Button variant="ghost" className={`gap-2 ${colors.text} group-hover:gap-3 transition-all duration-300`}>
                              Coming Soon
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Additional Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Terminal className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Interactive Playground</h3>
                  <p className="text-muted-foreground mb-6">Test API endpoints in real-time with our interactive playground environment</p>
                  <Button variant="outline" className="gap-2 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all">
                    Try Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success/20 to-success/10 dark:from-success/30 dark:to-success/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Book className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-success transition-colors">Tutorials & Guides</h3>
                  <p className="text-muted-foreground mb-6">Step-by-step tutorials to help you master OncoAI's features and capabilities</p>
                  <Button variant="outline" className="gap-2 hover:bg-success/10 hover:border-success/50 hover:text-success transition-all">
                    Browse Tutorials
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* CTA Section */}
            <Card className="p-12 md:p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 dark:from-primary/20 dark:via-primary/10 dark:to-success/20 border-2 border-primary/30 dark:border-primary/40 shadow-2xl dark:shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-success/10 dark:from-primary/20 dark:to-success/20 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-success/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 dark:from-primary/40 dark:to-primary/20 mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Download className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Need More Help?</h3>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Download our complete documentation guide with detailed examples, best practices, and troubleshooting tips
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn px-8 py-6 text-lg">
                    <Download className="h-5 w-5 group-hover/btn:translate-y-0.5 transition-transform duration-300" />
                    Download PDF Guide
                  </Button>
                  <Button variant="outline" size="lg" className="hover:bg-accent hover:scale-105 transition-all duration-300 px-8 py-6 text-lg">
                    Contact Support
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
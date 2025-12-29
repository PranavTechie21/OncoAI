import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Target,
  Zap,
  Shield,
  Activity,
  ArrowRight,
  Star,
  Lightbulb
} from "lucide-react";
import { apiService } from "@/services/api";

export default function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp: any = await apiService.listRecommendations();
        const list = resp?.recommendations || resp?.data?.recommendations || [];
        if (!mounted) return;
        setRecommendations(list);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load recommendations");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const id = window.setInterval(load, 15000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  const filteredRecommendations = selectedCategory === "All" 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  const stats = recommendations.length
    ? {
        total: recommendations.length,
        highPriority: recommendations.filter((r) => r.priority === "High").length,
        pending: recommendations.filter((r) => r.status === "Pending Review").length,
        avgConfidence: Math.round(
          recommendations.reduce((sum, r) => sum + (r.confidence || 0), 0) / recommendations.length
        ),
      }
    : { total: 0, highPriority: 0, pending: 0, avgConfidence: 0 };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "High": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Medium": return "bg-warning/10 text-warning border-warning/30";
      default: return "bg-success/10 text-success border-success/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Approved": return "bg-success/10 text-success border-success/30";
      case "Implemented": return "bg-primary/10 text-primary border-primary/30";
      default: return "bg-muted/50 text-muted-foreground border-border/50";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 lg:py-16 bg-gradient-to-br from-primary/10 via-background to-success/10 dark:from-primary/20 dark:via-slate-950 dark:to-success/20 border-b border-border/50 dark:border-slate-800">
          <div className="absolute inset-0 opacity-40 dark:opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-20 w-80 h-80 bg-success/20 dark:bg-success/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(120,119,198,0.15),transparent_50%)]" />
          <div className="container relative z-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 dark:from-primary/40 dark:to-primary/20 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 px-4 py-1 text-sm">
                  AI-Powered Insights
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  AI Treatment Recommendations
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Personalized treatment suggestions powered by advanced machine learning algorithms 
                analyzing patient data, genomic profiles, and clinical outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-primary/50 dark:hover:border-primary/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Brain className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Total Recommendations</p>
                  <p className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{stats.total}</p>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-destructive/50 dark:hover:border-destructive/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent dark:from-destructive/30 dark:via-destructive/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <AlertCircle className="h-7 w-7 text-destructive" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">High Priority</p>
                  <p className="text-4xl font-bold text-foreground group-hover:text-destructive transition-colors duration-300">{stats.highPriority}</p>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-warning/50 dark:hover:border-warning/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-warning/20 via-warning/10 to-transparent dark:from-warning/30 dark:via-warning/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Target className="h-7 w-7 text-warning" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Pending Review</p>
                  <p className="text-4xl font-bold text-foreground group-hover:text-warning transition-colors duration-300">{stats.pending}</p>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-success/50 dark:hover:border-success/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-success/20 via-success/10 to-transparent dark:from-success/30 dark:via-success/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <TrendingUp className="h-7 w-7 text-success" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Avg Confidence</p>
                  <p className="text-4xl font-bold text-foreground group-hover:text-success transition-colors duration-300">{stats.avgConfidence}%</p>
                </div>
              </Card>
            </div>

            {/* Filter Tabs */}
            <Tabs defaultValue="All" className="mb-12">
              <TabsList className="grid w-full grid-cols-5 bg-muted/50 dark:bg-slate-900/50 p-1 rounded-xl h-auto">
                <TabsTrigger 
                  value="All" 
                  onClick={() => setSelectedCategory("All")}
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="Treatment" 
                  onClick={() => setSelectedCategory("Treatment")}
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3"
                >
                  Treatment
                </TabsTrigger>
                <TabsTrigger 
                  value="Dosage" 
                  onClick={() => setSelectedCategory("Dosage")}
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3"
                >
                  Dosage
                </TabsTrigger>
                <TabsTrigger 
                  value="Monitoring" 
                  onClick={() => setSelectedCategory("Monitoring")}
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3"
                >
                  Monitoring
                </TabsTrigger>
                <TabsTrigger 
                  value="Other" 
                  onClick={() => setSelectedCategory("Other")}
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3"
                >
                  Other
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredRecommendations.map((rec, index) => (
                <Card 
                  key={rec.id}
                  className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-primary/50 dark:hover:border-primary/60 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                            {rec.priority} Priority
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(rec.status)}>
                            {rec.status}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            <Lightbulb className="h-4 w-4" />
                            For: <span className="font-medium text-foreground">{rec.patientName}</span>
                          </span>
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">{rec.description}</p>

                    {/* Confidence Score */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 border border-primary/10 dark:border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          AI Confidence Score
                        </span>
                        <span className="text-lg font-bold text-primary">{rec.confidence}%</span>
                      </div>
                      <Progress value={rec.confidence} className="h-2.5" />
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-success/10 dark:bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </div>
                        <span className="text-sm font-bold text-foreground">Key Benefits</span>
                      </div>
                      <ul className="space-y-2">
                        {rec.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 dark:hover:bg-slate-800/30 transition-colors duration-300">
                            <Star className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-warning/10 dark:bg-warning/20 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-warning" />
                        </div>
                        <span className="text-sm font-bold text-foreground">Considerations</span>
                      </div>
                      <ul className="space-y-2">
                        {rec.risks.map((risk, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 dark:hover:bg-slate-800/30 transition-colors duration-300">
                            <Shield className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-border/50 dark:border-slate-700/50">
                      <Button className="flex-1 gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group/btn">
                        Review Details
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:scale-110 transition-all duration-300"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredRecommendations.length === 0 && (
              <Card className="p-16 text-center bg-card/50 backdrop-blur-sm shadow-lg border border-border/50 dark:border-slate-700/50">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 dark:bg-slate-800/50 mb-6">
                  <Brain className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">No recommendations found</p>
                <p className="text-muted-foreground">Try selecting a different category to view recommendations.</p>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
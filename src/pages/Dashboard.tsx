import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import FadeInText from "@/components/ui/FadeInText";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Brain,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ScrollAnimation";
import { HoverCard } from "@/components/HoverCard";
import { motion } from "framer-motion";

// recent activities will be loaded from the backend dashboard summary

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("6months");
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeTreatments: 0,
    highRiskPatients: 0,
    aiRecommendations: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [topPatients, setTopPatients] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[Dashboard] Fetching data from API...');
        const resp: any = await apiService.getDashboardSummary();
        
        if (!mounted) return;
        
        // Backend returns data directly (not wrapped in 'data' field)
        // The response IS the data object itself: { total_patients: 45, ... }
        console.log('[Dashboard] API Response:', resp);
        console.log('[Dashboard] Response Type:', typeof resp);
        console.log('[Dashboard] Response Keys:', resp ? Object.keys(resp) : 'null');
        
        // Extract values - backend uses snake_case
        const totalPatients = Number(resp?.total_patients ?? resp?.totalPatients ?? 0);
        const activeTreatments = Number(resp?.active_treatments ?? resp?.activeTreatments ?? 0);
        const highRiskPatients = Number(resp?.high_risk_patients ?? resp?.highRiskPatients ?? 0);
        const aiRecommendations = Number(resp?.ai_recommendations ?? resp?.aiRecommendations ?? 0);
        
        console.log('[Dashboard] Extracted Values:', {
          totalPatients,
          activeTreatments,
          highRiskPatients,
          aiRecommendations,
        });
        
        if (totalPatients === 0 && activeTreatments === 0) {
          console.warn('[Dashboard] WARNING: All values are 0. Check if backend has data.');
        }
        
        if (mounted) {
          console.log('[Dashboard] Setting stats:', {
            totalPatients,
            activeTreatments,
            highRiskPatients,
            aiRecommendations,
          });
          setStats({
            totalPatients,
            activeTreatments,
            highRiskPatients,
            aiRecommendations,
          });
          setMonthlyStats(resp?.monthly_stats ?? []);
          setTopPatients(resp?.top_patients ?? []);
          setRecentActivities(resp?.recent_activities ?? []);
          setLoading(false);
          console.log('[Dashboard] Stats set, loading set to false');
        }
      } catch (e: any) {
        console.error('[Dashboard] API Error:', e);
        console.error('[Dashboard] Error Details:', {
          message: e?.message,
          stack: e?.stack,
          name: e?.name,
        });
        if (mounted) {
          setError(e?.message || "Failed to load dashboard data. Make sure backend is running on http://localhost:5000");
          setLoading(false);
          // Don't set to 0 on error - keep previous values if available
        }
      }
    };
    load();
    const id = window.setInterval(load, 15000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  // Debug: Log stats changes
  useEffect(() => {
    console.log('[Dashboard] Stats state updated:', stats);
  }, [stats]);

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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-4">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">Real-time Insights</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-3">
                  Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Overview of your clinical operations and patient insights
                </p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-12">
          <div className="container">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StaggerItem>
                <HoverCard hoverScale={1.03}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-primary/50 dark:hover:border-primary/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20 flex items-center justify-center shadow-lg"
                        >
                          <Users className="h-7 w-7 text-primary" />
                        </motion.div>
                        <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                          <ArrowUpRight className="h-3 w-3" />
                          +12%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Total Patients</p>
                      <p className="text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {loading ? "…" : <AnimatedNumber value={stats.totalPatients} duration={2000} />}
                        {/* Debug: {JSON.stringify(stats)} */}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {error ? "Live data unavailable" : "Live from database"}
                      </p>
                    </div>
                  </Card>
                </HoverCard>
              </StaggerItem>

              <StaggerItem>
                <HoverCard hoverScale={1.03}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-success/50 dark:hover:border-success/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-success/20 via-success/10 to-transparent dark:from-success/30 dark:via-success/20 flex items-center justify-center shadow-lg"
                        >
                          <Activity className="h-7 w-7 text-success" />
                        </motion.div>
                        <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                          <ArrowUpRight className="h-3 w-3" />
                          +8%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Active Treatments</p>
                      <p className="text-4xl font-bold text-foreground mb-2 group-hover:text-success transition-colors duration-300">
                        {loading ? "…" : <AnimatedNumber value={stats.activeTreatments} duration={2000} />}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {error ? "Live data unavailable" : "Based on treatment protocols"}
                      </p>
                    </div>
                  </Card>
                </HoverCard>
              </StaggerItem>

              <StaggerItem>
                <HoverCard hoverScale={1.03}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-warning/50 dark:hover:border-warning/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-warning/20 via-warning/10 to-transparent dark:from-warning/30 dark:via-warning/20 flex items-center justify-center shadow-lg"
                        >
                          <AlertCircle className="h-7 w-7 text-warning" />
                        </motion.div>
                        <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                          <ArrowDownRight className="h-3 w-3" />
                          -5%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">High Risk Patients</p>
                      <p className="text-4xl font-bold text-foreground mb-2 group-hover:text-warning transition-colors duration-300">
                        {loading ? "…" : <AnimatedNumber value={stats.highRiskPatients} duration={2000} />}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {error ? "Live data unavailable" : "Risk score > 75"}
                      </p>
                    </div>
                  </Card>
                </HoverCard>
              </StaggerItem>

              <StaggerItem>
                <HoverCard hoverScale={1.03}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-primary/50 dark:hover:border-primary/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20 flex items-center justify-center shadow-lg"
                        >
                          <Brain className="h-7 w-7 text-primary" />
                        </motion.div>
                        <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                          <ArrowUpRight className="h-3 w-3" />
                          +15%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">AI Recommendations</p>
                      <p className="text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {loading ? "…" : <AnimatedNumber value={stats.aiRecommendations} duration={2000} />}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {error ? "Live data unavailable" : "Patients with saved AI plans"}
                      </p>
                    </div>
                  </Card>
                </HoverCard>
              </StaggerItem>
            </StaggerContainer>

            {/* Charts Row */}
            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <StaggerItem>
                <ScrollAnimation direction="up" delay={0.2}>
                  <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center"
                          >
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </motion.div>
                          Patient Growth
                        </h3>
                        <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors">View All</Button>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyStats}>
                      <defs>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Area type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} fill="url(#colorPatients)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </ScrollAnimation>
              </StaggerItem>

              <StaggerItem>
                <ScrollAnimation direction="up" delay={0.3}>
                  <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 group-hover:text-success transition-colors duration-300">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="h-10 w-10 rounded-xl bg-gradient-to-br from-success/20 to-success/10 dark:from-success/30 dark:to-success/20 flex items-center justify-center"
                          >
                            <Target className="h-5 w-5 text-success" />
                          </motion.div>
                          Treatment Outcomes
                        </h3>
                        <Button variant="ghost" size="sm" className="group-hover:text-success transition-colors">View All</Button>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Bar dataKey="outcomes" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </ScrollAnimation>
              </StaggerItem>
            </StaggerContainer>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted/70 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                          activity.status === "success" ? "bg-success/10 dark:bg-success/20" :
                          activity.status === "warning" ? "bg-warning/10 dark:bg-warning/20" :
                          "bg-primary/10 dark:bg-primary/20"
                        }`}>
                          {activity.status === "success" ? (
                            <CheckCircle2 className={`h-5 w-5 text-success`} />
                          ) : activity.status === "warning" ? (
                            <AlertCircle className={`h-5 w-5 text-warning`} />
                          ) : (
                            <Activity className={`h-5 w-5 text-primary`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-relaxed">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1.5">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300">View All Activities</Button>
                </div>
              </Card>

              {/* Top Patients */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    Top Patients
                  </h3>
                  <div className="space-y-3">
                    {topPatients.map((patient, idx) => (
                      <Link key={idx} to={`/patients/${patient.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/70 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50 hover:-translate-x-1">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground mb-2">{patient.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`${
                                (patient.riskScore || 0) > 75 ? "border-destructive/30 text-destructive bg-destructive/10" :
                                (patient.riskScore || 0) > 50 ? "border-warning/30 text-warning bg-warning/10" :
                                "border-success/30 text-success bg-success/10"
                              }`}>
                                {patient.riskScore}%
                              </Badge>
                              <span className="text-xs text-muted-foreground">{patient.status}</span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${
                            (patient.change || 0) > 0 ? "text-destructive bg-destructive/10" : "text-success bg-success/10"
                          }`}>
                            {(patient.change || 0) > 0 ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(patient.change || 0)}%
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300" asChild>
                    <Link to="/patients">View All Patients</Link>
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start gap-3 h-12 text-base hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
                      <Link to="/patients">
                        <Users className="h-5 w-5" />
                        View All Patients
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base hover:scale-105 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300" asChild>
                      <Link to="/recommendations">
                        <Brain className="h-5 w-5" />
                        AI Recommendations
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base hover:scale-105 hover:bg-success/10 hover:border-success/50 hover:text-success transition-all duration-300" asChild>
                      <Link to="/reports">
                        <Activity className="h-5 w-5" />
                        Generate Report
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base hover:scale-105 hover:bg-warning/10 hover:border-warning/50 hover:text-warning transition-all duration-300" asChild>
                      <Link to="/appointments">
                        <Calendar className="h-5 w-5" />
                        Schedule Appointment
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PatientCard } from "@/components/PatientCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Activity,
  Calendar,
  FileText,
  BarChart3,
  Sparkles,
  Download
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ScrollAnimation";
import { HoverCard } from "@/components/HoverCard";
import { motion } from "framer-motion";

// Patients will be loaded from the backend; state is created inside component

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cancerType, setCancerType] = useState("All Types");
  const [riskLevel, setRiskLevel] = useState("All Levels");
  const [patientsData, setPatientsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const filteredPatients = useMemo(() => {
    return patientsData.filter((patient) => {
      const matchesSearch = patient.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCancerType =
        cancerType === "All Types" || patient.cancerType === cancerType;
      let matchesRiskLevel = true;
      if (riskLevel === "Low Risk") {
        matchesRiskLevel = patient.riskScore <= 50;
      } else if (riskLevel === "Medium Risk") {
        matchesRiskLevel = patient.riskScore > 50 && patient.riskScore <= 75;
      } else if (riskLevel === "High Risk") {
        matchesRiskLevel = patient.riskScore > 75;
      }
      return matchesSearch && matchesCancerType && matchesRiskLevel;
    });
  }, [searchQuery, cancerType, riskLevel, patientsData]);

  const stats = useMemo(() => {
    const total = patientsData.length;
    const highRisk = patientsData.filter((p) => (p.risk_score ?? p.riskScore) > 75).length;
    const activeTreatment = patientsData.filter((p) => p.status === "Active Treatment").length;
    const avgRiskScore = total ? Math.round(patientsData.reduce((sum, p) => sum + (p.risk_score ?? p.riskScore), 0) / total) : 0;
    return { total, highRisk, activeTreatment, avgRiskScore };
  }, [patientsData]);

  // Derived chart data
  const cancerTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    patientsData.forEach((p) => {
      const t = p.cancer_type || p.cancerType || 'Other';
      map[t] = (map[t] || 0) + 1;
    });
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#64748b"];
    return Object.keys(map).map((k, i) => ({ name: k, value: map[k], color: colors[i % colors.length] }));
  }, [patientsData]);

  const riskDistributionData = useMemo(() => {
    const ranges = { '0-50%': 0, '51-75%': 0, '76-100%': 0 };
    patientsData.forEach((p) => {
      const score = p.risk_score ?? p.riskScore ?? 0;
      if (score <= 50) ranges['0-50%']++;
      else if (score <= 75) ranges['51-75%']++;
      else ranges['76-100%']++;
    });
    return Object.keys(ranges).map((k) => ({ range: k, count: ranges[k as keyof typeof ranges] }));
  }, [patientsData]);

  const riskTrendData = useMemo(() => {
    // Calculate actual trend from patient data grouped by month
    const monthlyData: Record<string, { total: number; sum: number; month: string }> = {};
    
    patientsData.forEach((p) => {
      const createdDate = p.raw?.created_at || p.raw?.diagnosis_date;
      if (!createdDate) return;
      
      const date = new Date(createdDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, sum: 0, month: monthName };
      }
      monthlyData[monthKey].total += 1;
      monthlyData[monthKey].sum += p.riskScore || 0;
    });
    
    // Convert to array and calculate averages
    const trend = Object.keys(monthlyData)
      .sort()
      .slice(-6) // Last 6 months
      .map((key) => {
        const data = monthlyData[key];
        return {
          month: data.month || key.split('-')[1],
          value: data.total > 0 ? Math.round(data.sum / data.total) : stats.avgRiskScore,
        };
      });
    
    // If no data, show current average
    return trend.length > 0 
      ? trend 
      : [{ month: new Date().toLocaleDateString('en-US', { month: 'short' }), value: stats.avgRiskScore }];
  }, [patientsData, stats]);

  // Fetch patients once on mount and when manual refresh triggered
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const api = (await import("@/services/api")).apiService;
      const resp = await api.getPatients();
      const list = resp?.patients || resp?.data?.patients || [];
      // Normalize incoming fields to the expected camelCase used in UI where possible
      const normalized = (list || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        age: p.age,
        cancerType: p.cancer_type || p.cancerType,
        cancerSubtype: p.cancer_subtype || p.cancerSubtype,
        riskScore: Number(p.risk_score ?? p.riskScore ?? 0),
        avatarUrl: p.avatar_url || p.avatarUrl || '',
        diagnosisDate: p.diagnosis_date || p.diagnosisDate,
        stage: p.stage,
        lastVisit: p.last_visit || p.lastVisit,
        status: p.status,
        email: p.email,
        phone: p.phone,
        address: p.address,
        raw: p,
      }));
      setPatientsData(normalized);
    } catch (err: any) {
      setError(err?.message || "Unable to load patients");
      setPatientsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchPatients();
    return () => { mounted = false; };
  }, []);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-4">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary">Patient Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-3">
              Patient Records
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Comprehensive overview of all patients with advanced analytics and insights
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex flex-col text-sm text-muted-foreground">
                <span>Data updates only when you press Refresh.</span>
                {error ? <span className="text-destructive">Error: {error}</span> : loading ? <span>Updating patient list...</span> : null}
              </div>
              <div>
                <button
                  className="inline-flex items-center px-3 py-2 rounded-md border border-border bg-card text-sm"
                  onClick={() => fetchPatients()}
                >
                  Refresh
                </button>
              </div>
            </div>
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
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Total Patients</p>
                      <p className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{stats.total}</p>
                    </div>
                  </Card>
                </HoverCard>
              </StaggerItem>

              <StaggerItem>
                <HoverCard hoverScale={1.03}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-2 hover:border-destructive/50 dark:hover:border-destructive/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent dark:from-destructive/30 dark:via-destructive/20 flex items-center justify-center shadow-lg"
                        >
                          <AlertCircle className="h-7 w-7 text-destructive" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">High Risk</p>
                      <p className="text-4xl font-bold text-foreground group-hover:text-destructive transition-colors duration-300">{stats.highRisk}</p>
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
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Active Treatment</p>
                      <p className="text-4xl font-bold text-foreground group-hover:text-success transition-colors duration-300">{stats.activeTreatment}</p>
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
                          <TrendingUp className="h-7 w-7 text-warning" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Avg Risk Score</p>
                      <p className="text-4xl font-bold text-foreground group-hover:text-warning transition-colors duration-300">{stats.avgRiskScore}%</p>
                    </div>
                  </Card>
                </HoverCard>
              </StaggerItem>
            </StaggerContainer>

            {/* Charts Section */}
            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 dark:bg-slate-900/50 p-1 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300">Overview</TabsTrigger>
                <TabsTrigger value="distribution" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300">Distribution</TabsTrigger>
                <TabsTrigger value="trends" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300">Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        Cancer Type Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={cancerTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {cancerTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        Risk Score Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={riskDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="range" className="text-sm" />
                          <YAxis className="text-sm" />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="distribution" className="mt-8">
                <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      Risk Level Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={riskDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="range" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-8">
                <Card className="p-8 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      Average Risk Score Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={riskTrendData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorValue)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Patients List Section */}
        <section className="py-12 bg-gradient-to-b from-muted/10 to-background dark:from-slate-950/50 dark:to-slate-950">
          <div className="container">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">All Patients</h2>
                <p className="text-muted-foreground">Manage and monitor patient records</p>
              </div>
              <Button className="gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group/btn">
                <Download className="h-4 w-4 group-hover/btn:translate-y-0.5 transition-transform duration-300" />
                Export Report
              </Button>
            </div>

            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              cancerType={cancerType}
              setCancerType={setCancerType}
              riskLevel={riskLevel}
              setRiskLevel={setRiskLevel}
            />

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredPatients.length}</span> of <span className="font-semibold text-foreground">{patientsData.length}</span> patients
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPatients.map((patient, index) => (
                  <PatientCard
                    key={patient.id}
                    id={patient.id}
                    name={patient.name}
                    age={patient.age}
                    cancerType={patient.cancerType}
                    cancerSubtype={patient.cancerSubtype}
                    riskScore={patient.riskScore}
                    avatarUrl={patient.avatarUrl}
                    index={index}
                  />
                ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="mt-12 text-center py-16 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 dark:bg-slate-800/50 mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">No patients found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
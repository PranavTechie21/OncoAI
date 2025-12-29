import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pill,
  Activity,
  Zap,
  Loader2,
  X,
  Download,
  Share2,
} from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AIRecommendationsPanelProps {
  patientId: number;
  patientData: any;
  onClose?: () => void;
}

export function AIRecommendationsPanel({
  patientId,
  patientData,
  onClose,
}: AIRecommendationsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getRecommendations(patientId);
      setRecommendations(response.recommendations || response);
      toast.success("AI recommendations generated successfully!");
    } catch (err: any) {
      console.error("Error generating recommendations:", err);
      setError(err.message || "Failed to generate recommendations");
      toast.error("Failed to generate recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-generate recommendations when panel opens
    if (patientId) {
      generateRecommendations();
    }
  }, [patientId]);

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "destructive";
      default:
        return "primary";
    }
  };

  const treatmentData = recommendations?.recommended_treatments?.map(
    (t: any, idx: number) => ({
      name: t.name,
      successRate: (t.success_rate || 0) * 100,
      priority: t.priority,
    })
  ) || [];

  const outcomeData = recommendations?.expected_outcomes
    ? [
        {
          name: "5-Year Survival",
          value: (recommendations.expected_outcomes.survival_rate_5yr || 0) * 100,
        },
        {
          name: "Response Rate",
          value: (recommendations.expected_outcomes.response_rate || 0) * 100,
        },
        {
          name: "Remission",
          value: (recommendations.expected_outcomes.remission_probability || 0) * 100,
        },
      ]
    : [];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  if (loading && !recommendations) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Analyzing patient data with AI...</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take a few moments
          </p>
        </div>
      </Card>
    );
  }

  if (error && !recommendations) {
    return (
      <Card className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={generateRecommendations} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  if (!recommendations) {
    return (
      <Card className="p-8">
        <div className="text-center py-8">
          <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">AI Treatment Recommendations</h3>
          <p className="text-muted-foreground mb-6">
            Generate personalized treatment recommendations based on patient data
          </p>
          <Button onClick={generateRecommendations} size="lg" className="gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Recommendations
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              AI Treatment Recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Generated based on patient data analysis
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Risk Assessment */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 dark:from-primary/20 dark:via-primary/10 dark:to-success/20 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Risk Assessment
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-calculated risk score based on clinical data
            </p>
          </div>
          <Badge
            className={`bg-${getRiskColor(recommendations.risk_level)}/10 text-${getRiskColor(recommendations.risk_level)} border-${getRiskColor(recommendations.risk_level)}/20 text-lg px-4 py-2`}
          >
            {recommendations.risk_level?.toUpperCase() || "MEDIUM"}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Risk Score</span>
            <span className="font-bold text-foreground">
              {recommendations.risk_score?.toFixed(1) || 0}%
            </span>
          </div>
          <Progress
            value={recommendations.risk_score || 0}
            className="h-3"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Zap className="h-3 w-3" />
            <span>Confidence: {(recommendations.confidence || 0.85) * 100}%</span>
          </div>
        </div>
      </Card>

      {/* Recommended Treatments */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          Recommended Treatment Protocols
        </h3>
        <div className="space-y-4">
          {recommendations.recommended_treatments?.map(
            (treatment: any, idx: number) => (
              <div
                key={idx}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground text-lg">
                        {treatment.name}
                      </h4>
                      <Badge
                        variant={
                          treatment.priority === "high" ? "default" : "outline"
                        }
                      >
                        {treatment.priority?.toUpperCase() || "MEDIUM"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {treatment.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-muted-foreground">
                          Success Rate:{" "}
                          <span className="font-semibold text-foreground">
                            {(treatment.success_rate || 0) * 100}%
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Progress
                  value={(treatment.success_rate || 0) * 100}
                  className="h-2"
                />
              </div>
            )
          )}
        </div>
      </Card>

      {/* Treatment Protocol */}
      {recommendations.treatment_protocol && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Treatment Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Phase</p>
              <p className="text-xl font-bold text-foreground capitalize">
                {recommendations.treatment_protocol.phase || "Initial"}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="text-xl font-bold text-foreground">
                {recommendations.treatment_protocol.duration_weeks || 12} weeks
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Follow-up Frequency
              </p>
              <p className="text-xl font-bold text-foreground capitalize">
                {recommendations.treatment_protocol.follow_up_frequency || "Monthly"}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Monitoring Tests
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendations.treatment_protocol.monitoring_tests?.map(
                  (test: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {test.replace("_", " ")}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Expected Outcomes */}
      {recommendations.expected_outcomes && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Expected Outcomes
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Treatment Success Rates
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={treatmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, successRate }) =>
                    `${name}: ${successRate.toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="successRate"
                >
                  {treatmentData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Monitoring Schedule */}
      {recommendations.monitoring_schedule && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Monitoring Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Frequency</p>
              <Badge className="text-base px-4 py-2">
                {recommendations.monitoring_schedule.frequency || "Monthly"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Required Tests</p>
              <div className="flex flex-wrap gap-2">
                {recommendations.monitoring_schedule.tests?.map(
                  (test: string, idx: number) => (
                    <Badge key={idx} variant="outline">
                      {test.replace("_", " ")}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1 gap-2" size="lg">
          <CheckCircle2 className="h-5 w-5" />
          Accept Recommendations
        </Button>
        <Button variant="outline" className="flex-1 gap-2" size="lg">
          <Download className="h-5 w-5" />
          Download Report
        </Button>
      </div>
    </div>
  );
}










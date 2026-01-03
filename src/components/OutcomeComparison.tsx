import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface OutcomeComparisonProps {
  comparisons: any[];
  patientData?: any;
}

export function OutcomeComparison({
  comparisons,
  patientData,
}: OutcomeComparisonProps) {
  if (!comparisons || comparisons.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No outcome data available for comparison</p>
          <p className="text-sm mt-2">
            Record actual treatment outcomes to compare with predictions
          </p>
        </div>
      </Card>
    );
  }

  const formatTreatmentName = (treatment: string) => {
    const names: { [key: string]: string } = {
      chemo: "Chemotherapy",
      targeted: "Targeted Therapy",
      immuno: "Immunotherapy",
      radiation: "Radiation Therapy",
      surgery: "Surgery",
      combination: "Combination Therapy",
    };
    return names[treatment] || treatment.charAt(0).toUpperCase() + treatment.slice(1);
  };

  const calculateAccuracy = (predicted: number, actual: number | null) => {
    if (actual === null || actual === undefined) return null;
    const diff = Math.abs(predicted - actual);
    return Math.max(0, 100 - (diff / actual) * 100);
  };

  // Prepare chart data
  const chartData = comparisons.map((comp) => ({
    treatment: formatTreatmentName(comp.treatment_type),
    predicted: comp.predicted?.survival_5yr
      ? Math.round(comp.predicted.survival_5yr * 100)
      : null,
    actual: comp.actual?.survival_months
      ? Math.min(100, Math.round((comp.actual.survival_months / 60) * 100))
      : null,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Predicted vs Actual Outcomes
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparison of ML model predictions with real-world treatment outcomes
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {comparisons.length} Treatment{comparisons.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </Card>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {comparisons.map((comp, idx) => {
          const predictedSurvival = comp.predicted?.survival_5yr || 0;
          const actualSurvival = comp.actual?.survival_months
            ? comp.actual.survival_months / 60
            : null;
          const accuracy = actualSurvival
            ? calculateAccuracy(predictedSurvival, actualSurvival)
            : null;

          return (
            <Card key={idx} className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground text-lg">
                    {formatTreatmentName(comp.treatment_type)}
                  </h4>
                  {comp.actual?.survival_status && (
                    <Badge
                      variant={
                        comp.actual.survival_status === "alive"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {comp.actual.survival_status === "alive"
                        ? "Alive"
                        : "Deceased"}
                    </Badge>
                  )}
                </div>
                {comp.treatment_dates?.start && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Started: {new Date(comp.treatment_dates.start).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Survival Comparison */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      5-Year Survival
                    </span>
                    {accuracy !== null && (
                      <Badge variant="outline" className="text-xs">
                        {accuracy?.toFixed(1)}% accuracy
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Predicted</span>
                        <span className="font-semibold">
                          {Math.round(predictedSurvival * 100)}%
                        </span>
                      </div>
                      <Progress value={predictedSurvival * 100} className="h-2" />
                    </div>
                    {actualSurvival !== null && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Actual</span>
                          <span className="font-semibold text-success">
                            {Math.round(actualSurvival * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={actualSurvival * 100}
                          className="h-2 bg-success/20"
                        />
                      </div>
                    )}
                    {actualSurvival === null && (
                      <p className="text-xs text-muted-foreground italic">
                        Actual outcome not yet recorded
                      </p>
                    )}
                  </div>
                </div>

                {/* Response Comparison */}
                {comp.predicted?.response_probability && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Response Probability
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Predicted</span>
                          <span className="font-semibold">
                            {Math.round(comp.predicted.response_probability * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={comp.predicted.response_probability * 100}
                          className="h-2"
                        />
                      </div>
                      {comp.actual?.response && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Actual:</span>
                          <Badge
                            variant="outline"
                            className={
                              comp.actual.response === "complete"
                                ? "bg-success/10 text-success border-success/20"
                                : comp.actual.response === "partial"
                                ? "bg-warning/10 text-warning border-warning/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            }
                          >
                            {comp.actual.response}
                          </Badge>
                          {comp.actual.response_date && (
                            <span className="text-xs text-muted-foreground">
                              ({new Date(comp.actual.response_date).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accuracy Indicator */}
                {accuracy !== null && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      {accuracy >= 80 ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-success font-medium">
                            High prediction accuracy
                          </span>
                        </>
                      ) : accuracy >= 60 ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-warning" />
                          <span className="text-warning font-medium">
                            Moderate prediction accuracy
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="text-destructive font-medium">
                            Low prediction accuracy
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Comparison Chart */}
      {chartData.some((d) => d.actual !== null) && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Survival Rate Comparison
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.filter((d) => d.predicted !== null)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="treatment" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value: number) => `${value}%`}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar dataKey="predicted" fill="#3b82f6" name="Predicted" />
              <Bar dataKey="actual" fill="#10b981" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}






import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pill,
  Activity,
  Heart,
  Info,
  Download,
  Share2,
} from "lucide-react";
import { TreatmentPathway } from "./TreatmentPathway";

interface PatientTreatmentViewProps {
  recommendations: any;
  patientData?: any;
}

export function PatientTreatmentView({
  recommendations,
  patientData,
}: PatientTreatmentViewProps) {
  if (!recommendations?.treatments || recommendations.treatments.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          No treatment recommendations available
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

  const topTreatment = recommendations.treatments[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Treatment Recommendations
            </h2>
            <p className="text-muted-foreground">
              Personalized treatment plan based on your medical profile
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Patient:</span>
            <span className="font-semibold">{patientData?.name || "You"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Generated:</span>
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Recommended Treatment - Simplified */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/20">
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Recommended: {formatTreatmentName(topTreatment.treatment)}
                </h3>
                <Badge className="mt-1 bg-success/10 text-success border-success/20">
                  Best Option for You
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground mt-3">
              Based on your medical profile, this treatment option has the highest
              likelihood of success for your condition.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Success Probability</p>
            <p className="text-2xl font-bold text-foreground">
              {Math.round((topTreatment.response_probability || 0) * 100)}%
            </p>
            <Progress
              value={(topTreatment.response_probability || 0) * 100}
              className="mt-2 h-2"
            />
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">5-Year Survival</p>
            <p className="text-2xl font-bold text-success">
              {topTreatment.outcomes
                ? Math.round((topTreatment.outcomes.survival_5yr || 0) * 100)
                : "-"}
              %
            </p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
            <p className="text-2xl font-bold text-primary">
              {topTreatment.outcomes
                ? Math.round((topTreatment.outcomes.response_rate || 0) * 100)
                : "-"}
              %
            </p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Treatment Duration</p>
            <p className="text-lg font-bold text-foreground">
              {topTreatment.outcomes?.progression_free_survival_months
                ? `${Math.round(
                    topTreatment.outcomes.progression_free_survival_months / 3
                  )}-${Math.round(topTreatment.outcomes.progression_free_survival_months / 2)} mos`
                : "3-6 months"}
            </p>
          </div>
        </div>
      </Card>

      {/* Treatment Pathway */}
      <TreatmentPathway recommendations={recommendations} patientData={patientData} />

      {/* What to Expect - Simplified Side Effects */}
      {topTreatment.side_effects?.common_side_effects && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            What to Expect: Possible Side Effects
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These are the most common side effects. Your doctor will monitor you closely
            and help manage any side effects that occur.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topTreatment.side_effects.common_side_effects.slice(0, 6).map(
              (effect: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/50 rounded-lg border flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{effect.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {effect.severity} severity
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      effect.severity === "severe"
                        ? "border-destructive/30 text-destructive"
                        : effect.severity === "moderate"
                        ? "border-warning/30 text-warning"
                        : "border-blue-500/30 text-blue-500"
                    }
                  >
                    {Math.round((effect.probability || 0) * 100)}%
                  </Badge>
                </div>
              )
            )}
          </div>
        </Card>
      )}

      {/* AI Explanation - Patient-Friendly */}
      {topTreatment.llm_explanation && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-success/5">
          <div className="flex items-start gap-3 mb-3">
            <Brain className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Why This Treatment?
              </h3>
              <p className="text-foreground leading-relaxed">
                {topTreatment.llm_explanation}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Other Options */}
      {recommendations.treatments.length > 1 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Other Treatment Options
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your doctor may also discuss these alternative treatment options with you:
          </p>
          <div className="space-y-3">
            {recommendations.treatments.slice(1, 4).map((treatment: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-muted/30 rounded-lg border flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {formatTreatmentName(treatment.treatment)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((treatment.response_probability || 0) * 100)}% success
                    probability
                  </p>
                </div>
                <Badge variant="outline">Alternative Option</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Important Note */}
      <Card className="p-6 bg-warning/5 border-warning/20">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">Important Information</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These recommendations are generated by AI to support clinical decision-making.
              They are not a substitute for medical advice. Please discuss all treatment
              options with your healthcare provider to make an informed decision that's right
              for you. Your doctor will consider your preferences, values, and unique
              circumstances when recommending the best treatment plan.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1 gap-2" size="lg">
          <CheckCircle2 className="h-5 w-5" />
          Discuss with Doctor
        </Button>
        <Button variant="outline" className="flex-1 gap-2" size="lg">
          <Download className="h-5 w-5" />
          Save This Plan
        </Button>
      </div>
    </div>
  );
}





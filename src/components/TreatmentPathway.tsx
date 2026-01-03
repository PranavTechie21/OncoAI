import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Pill,
  Activity,
  Scissors,
  Zap,
  Info,
} from "lucide-react";

interface PathwayNode {
  id: string;
  type: "treatment" | "decision" | "outcome" | "monitoring";
  label: string;
  description?: string;
  duration?: string;
  probability?: number;
  recommended?: boolean;
}

interface TreatmentPathwayProps {
  recommendations: any;
  patientData?: any;
}

export function TreatmentPathway({
  recommendations,
  patientData,
}: TreatmentPathwayProps) {
  if (!recommendations?.treatments || recommendations.treatments.length === 0) {
    return null;
  }

  // Get the top recommended treatment
  const topTreatment = recommendations.treatments[0];
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

  // Get treatment icon
  const getTreatmentIcon = (treatment: string) => {
    if (treatment === "surgery") return Scissors;
    if (treatment === "radiation") return Zap;
    return Pill;
  };

  // Build pathway based on best treatment and patient factors
  const buildPathway = (): PathwayNode[] => {
    const pathway: PathwayNode[] = [];
    const treatment = topTreatment.treatment;
    const stage = patientData?.stage || "II";
    const age = patientData?.age || 50;

    // Initial assessment
    pathway.push({
      id: "assessment",
      type: "decision",
      label: "Patient Assessment",
      description: `Stage ${stage}, Age ${age}`,
      recommended: true,
    });

    // Determine pathway based on treatment type and stage
    if (treatment === "surgery" && (stage === "I" || stage === "II")) {
      // Surgical pathway
      pathway.push({
        id: "surgery",
        type: "treatment",
        label: formatTreatmentName(treatment),
        description: "Primary surgical resection",
        duration: "1-2 weeks",
        recommended: true,
      });
      pathway.push({
        id: "post-surgery",
        type: "decision",
        label: "Post-Surgical Evaluation",
        description: "Pathology and staging",
        recommended: true,
      });
      if (topTreatment.outcomes?.response_rate && topTreatment.outcomes.response_rate > 0.6) {
        pathway.push({
          id: "adjuvant",
          type: "treatment",
          label: "Adjuvant Therapy",
          description: "Prevent recurrence",
          duration: "3-6 months",
          recommended: true,
        });
      }
    } else if (treatment === "chemo" || treatment === "targeted" || treatment === "immuno") {
      // Medical treatment pathway
      pathway.push({
        id: "pre-treatment",
        type: "monitoring",
        label: "Pre-Treatment Evaluation",
        description: "Baseline imaging and labs",
        duration: "1-2 weeks",
        recommended: true,
      });
      pathway.push({
        id: "primary",
        type: "treatment",
        label: formatTreatmentName(treatment),
        description: "Primary treatment cycle",
        duration: topTreatment.outcomes?.progression_free_survival_months
          ? `${Math.round(topTreatment.outcomes.progression_free_survival_months / 3)}-${Math.round(topTreatment.outcomes.progression_free_survival_months / 2)} months`
          : "3-6 months",
        probability: topTreatment.response_probability,
        recommended: true,
      });
      pathway.push({
        id: "response",
        type: "decision",
        label: "Response Evaluation",
        description: "Imaging and biomarker assessment",
        recommended: true,
      });
    } else if (treatment === "radiation") {
      pathway.push({
        id: "radiation",
        type: "treatment",
        label: formatTreatmentName(treatment),
        description: "Radiation therapy course",
        duration: "4-8 weeks",
        recommended: true,
      });
    } else if (treatment === "combination") {
      pathway.push({
        id: "combo",
        type: "treatment",
        label: formatTreatmentName(treatment),
        description: "Multi-modal treatment approach",
        duration: "4-12 months",
        recommended: true,
      });
    }

    // Ongoing monitoring
    pathway.push({
      id: "monitoring",
      type: "monitoring",
      label: "Ongoing Monitoring",
      description: "Regular follow-ups and surveillance",
      duration: "Long-term",
      recommended: true,
    });

    // Outcome
    pathway.push({
      id: "outcome",
      type: "outcome",
      label: "Expected Outcome",
      description: topTreatment.outcomes
        ? `${Math.round((topTreatment.outcomes.survival_5yr || 0) * 100)}% 5-year survival`
        : "Treatment response",
      probability: topTreatment.response_probability,
      recommended: true,
    });

    return pathway;
  };

  const pathway = buildPathway();

  const getNodeIcon = (type: PathwayNode["type"]) => {
    switch (type) {
      case "treatment":
        return Pill;
      case "decision":
        return AlertCircle;
      case "outcome":
        return CheckCircle2;
      case "monitoring":
        return Activity;
      default:
        return Clock;
    }
  };

  const getNodeColor = (type: PathwayNode["type"]) => {
    switch (type) {
      case "treatment":
        return "bg-primary/10 text-primary border-primary/20";
      case "decision":
        return "bg-warning/10 text-warning border-warning/20";
      case "outcome":
        return "bg-success/10 text-success border-success/20";
      case "monitoring":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recommended Treatment Pathway
        </h3>
        <p className="text-sm text-muted-foreground">
          Personalized treatment sequence for {patientData?.name || "this patient"}
        </p>
      </div>

      <div className="relative">
        {/* Pathway Container */}
        <div className="space-y-4">
          {pathway.map((node, index) => {
            const Icon = getNodeIcon(node.type);
            const isLast = index === pathway.length - 1;

            return (
              <div key={node.id} className="relative">
                <div className="flex items-start gap-4">
                  {/* Node */}
                  <div
                    className={`flex-1 p-4 rounded-lg border-2 ${
                      node.recommended ? getNodeColor(node.type) : "bg-muted/50 border-border"
                    } transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md ${node.recommended ? getNodeColor(node.type) : "bg-muted"} border`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{node.label}</h4>
                          {node.recommended && (
                            <Badge variant="outline" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                          {node.probability !== undefined && (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {Math.round(node.probability * 100)}%
                            </Badge>
                          )}
                        </div>
                        {node.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {node.description}
                          </p>
                        )}
                        {node.duration && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{node.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow connector */}
                {!isLast && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Alternative Pathways Note */}
        {recommendations.treatments.length > 1 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Alternative Treatment Options
                </p>
                <p className="text-xs text-muted-foreground">
                  {recommendations.treatments.slice(1, 3).map((t: any, idx: number) => (
                    <span key={idx}>
                      {formatTreatmentName(t.treatment)}
                      {idx < Math.min(recommendations.treatments.length - 2, 1) && ", "}
                    </span>
                  ))}{" "}
                  are also viable options. Discuss with your healthcare team to determine the best
                  approach for your specific situation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}


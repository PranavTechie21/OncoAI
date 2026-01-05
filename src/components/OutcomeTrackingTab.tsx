import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  Plus,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { apiService } from "@/services/api";
import { OutcomeComparison } from "./OutcomeComparison";
import { toast } from "sonner";

interface OutcomeTrackingTabProps {
  patientId: number;
  patientData?: any;
}

export function OutcomeTrackingTab({
  patientId,
  patientData,
}: OutcomeTrackingTabProps) {
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState<any>({
    treatment_type: "",
    treatment_start_date: "",
    actual_response: "",
    actual_response_date: "",
    actual_survival_status: "",
    actual_survival_months: "",
    actual_remission_status: "",
    notes: "",
  });

  useEffect(() => {
    loadComparisons();
  }, [patientId]);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOutcomeComparison(patientId);
      setComparisons(response.comparisons || []);
    } catch (err: any) {
      console.error("Error loading outcomes:", err);
      toast.error("Failed to load outcome comparisons");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Get predictions from recommendations if available
      const recommendations = patientData?.ml_recommendations;
      let predictedData: any = {};

      if (recommendations?.treatments) {
        const treatment = recommendations.treatments.find(
          (t: any) => t.treatment === formData.treatment_type
        );
        if (treatment) {
          predictedData = {
            predicted_response_probability: treatment.response_probability,
            predicted_survival_1yr: treatment.outcomes?.survival_1yr,
            predicted_survival_3yr: treatment.outcomes?.survival_3yr,
            predicted_survival_5yr: treatment.outcomes?.survival_5yr,
            predicted_response_rate: treatment.outcomes?.response_rate,
            predicted_remission_probability:
              treatment.outcomes?.remission_probability,
          };
        }
      }

      const outcomeData = {
        ...predictedData,
        treatment_type: formData.treatment_type,
        treatment_start_date: formData.treatment_start_date || undefined,
        actual_response: formData.actual_response || undefined,
        actual_response_date: formData.actual_response_date || undefined,
        actual_survival_status: formData.actual_survival_status || undefined,
        actual_survival_months: formData.actual_survival_months
          ? parseFloat(formData.actual_survival_months)
          : undefined,
        actual_remission_status: formData.actual_remission_status || undefined,
        notes: formData.notes || undefined,
      };

      await apiService.createOutcome(patientId, outcomeData);
      toast.success("Outcome recorded successfully");
      setShowAddDialog(false);
      setFormData({
        treatment_type: "",
        treatment_start_date: "",
        actual_response: "",
        actual_response_date: "",
        actual_survival_status: "",
        actual_survival_months: "",
        actual_remission_status: "",
        notes: "",
      });
      loadComparisons();
    } catch (err: any) {
      console.error("Error saving outcome:", err);
      toast.error("Failed to save outcome");
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Outcome Tracking & Comparison
            </h3>
            <p className="text-sm text-muted-foreground">
              Track actual treatment outcomes and compare with AI predictions
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Record Outcome
          </Button>
        </div>
      </Card>

      {/* Comparison View */}
      <OutcomeComparison comparisons={comparisons} patientData={patientData} />

      {/* Add Outcome Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Treatment Outcome</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="treatment_type">Treatment Type</Label>
              <Select
                value={formData.treatment_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, treatment_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chemo">Chemotherapy</SelectItem>
                  <SelectItem value="targeted">Targeted Therapy</SelectItem>
                  <SelectItem value="immuno">Immunotherapy</SelectItem>
                  <SelectItem value="radiation">Radiation Therapy</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="combination">Combination Therapy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="treatment_start_date">Treatment Start Date</Label>
                <Input
                  id="treatment_start_date"
                  type="date"
                  value={formData.treatment_start_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      treatment_start_date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="actual_response">Response to Treatment</Label>
              <Select
                value={formData.actual_response}
                onValueChange={(value) =>
                  setFormData({ ...formData, actual_response: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select response" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete Response</SelectItem>
                  <SelectItem value="partial">Partial Response</SelectItem>
                  <SelectItem value="stable">Stable Disease</SelectItem>
                  <SelectItem value="progression">Disease Progression</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.actual_response && (
              <div>
                <Label htmlFor="actual_response_date">Response Date</Label>
                <Input
                  id="actual_response_date"
                  type="date"
                  value={formData.actual_response_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actual_response_date: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div>
              <Label htmlFor="actual_survival_status">Survival Status</Label>
              <Select
                value={formData.actual_survival_status}
                onValueChange={(value) =>
                  setFormData({ ...formData, actual_survival_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alive">Alive</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.actual_survival_status && (
              <div>
                <Label htmlFor="actual_survival_months">Survival (Months)</Label>
                <Input
                  id="actual_survival_months"
                  type="number"
                  step="0.1"
                  value={formData.actual_survival_months}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actual_survival_months: e.target.value,
                    })
                  }
                  placeholder="e.g., 24.5"
                />
              </div>
            )}

            <div>
              <Label htmlFor="actual_remission_status">Remission Status</Label>
              <Select
                value={formData.actual_remission_status}
                onValueChange={(value) =>
                  setFormData({ ...formData, actual_remission_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_remission">In Remission</SelectItem>
                  <SelectItem value="not_in_remission">Not in Remission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes about the treatment outcome..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Outcome</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
















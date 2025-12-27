import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SuccessToast from "./SuccessToast";

export function AddPatientDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    cancerType: "",
    cancerSubtype: "",
    stage: "",
    diagnosisDate: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const patientData = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        cancer_type: formData.cancerType,
        cancer_subtype: formData.cancerSubtype || undefined,
        stage: formData.stage,
        diagnosis_date: formData.diagnosisDate,
        clinical_data: {
          notes: formData.notes,
        },
      };

      const response = await apiService.createPatient(patientData);
      
      // Show an improved, responsive success toast and stay on the same page
      const variant = location.pathname === "/" ? "large" : "compact";

      toast.success(
        <SuccessToast name={formData.name} description="Patient record created" variant={variant as any} duration={4000} />,
        ({ duration: 4000, position: "bottom-right" } as any)
      );

      // Reset form
      setFormData({
        name: "",
        age: "",
        gender: "",
        cancerType: "",
        cancerSubtype: "",
        stage: "",
        diagnosisDate: "",
        notes: "",
      });

      setLoading(false);
      setOpen(false);

      // Stay on the same page — do not navigate or reload.
    } catch (error: any) {
      console.error("Error adding patient:", error);
      
      // Check if it's a network error (backend not available)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        toast.error("Backend Not Available", {
          description: "Please make sure the backend server is running on port 5000",
          duration: 5000,
        });
      } else {
        toast.error("Failed to add patient", {
          description: error.message || "Please try again",
          duration: 5000,
        });
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Add Patient Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter patient information to add them to the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="58"
                min="1"
                max="120"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosisDate">Diagnosis Date *</Label>
              <Input
                id="diagnosisDate"
                type="date"
                value={formData.diagnosisDate}
                onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cancerType">Cancer Type *</Label>
              <Select
                value={formData.cancerType}
                onValueChange={(value) => setFormData({ ...formData, cancerType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cancer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lung Cancer">Lung Cancer</SelectItem>
                  <SelectItem value="Breast Cancer">Breast Cancer</SelectItem>
                  <SelectItem value="Colon Cancer">Colon Cancer</SelectItem>
                  <SelectItem value="Prostate Cancer">Prostate Cancer</SelectItem>
                  <SelectItem value="Ovarian Cancer">Ovarian Cancer</SelectItem>
                  <SelectItem value="Leukemia">Leukemia</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancerSubtype">Cancer Subtype</Label>
              <Input
                id="cancerSubtype"
                value={formData.cancerSubtype}
                onChange={(e) => setFormData({ ...formData, cancerSubtype: e.target.value })}
                placeholder="e.g., Non-Small Cell"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Stage *</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => setFormData({ ...formData, stage: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stage I">Stage I</SelectItem>
                <SelectItem value="Stage II">Stage II</SelectItem>
                <SelectItem value="Stage III">Stage III</SelectItem>
                <SelectItem value="Stage IV">Stage IV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information about the patient..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


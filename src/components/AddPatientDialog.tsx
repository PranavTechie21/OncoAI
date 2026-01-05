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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return !value.trim() ? "Please fill the * mark details" : "";
      case "age":
        if (!value.trim()) return "Please fill the * mark details";
        const ageNum = parseInt(value);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) return "Please enter a valid age (1-120)";
        return "";
      case "gender":
        return !value ? "Please fill the * mark details" : "";
      case "cancerType":
        return !value ? "Please fill the * mark details" : "";
      case "stage":
        return !value ? "Please fill the * mark details" : "";
      case "diagnosisDate":
        return !value ? "Please fill the * mark details" : "";
      default:
        return "";
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    if (error) {
      setErrors({ ...errors, [fieldName]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  const handleChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      if (error) {
        setErrors({ ...errors, [fieldName]: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors[fieldName];
        setErrors(newErrors);
      }
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = ["name", "age", "gender", "cancerType", "stage", "diagnosisDate"];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      age: true,
      gender: true,
      cancerType: true,
      stage: true,
      diagnosisDate: true,
    });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fill all required fields marked with *",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Convert "Stage I" to "I" format for backend
      const stageValue = formData.stage.replace(/^Stage /, "");
      
      const patientData = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        cancer_type: formData.cancerType,
        cancer_subtype: formData.cancerSubtype || undefined,
        stage: stageValue,
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
      setErrors({});
      setTouched({});

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
              <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="John Doe"
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className={errors.age ? "text-red-500" : ""}>
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                onBlur={() => handleBlur("age")}
                placeholder="58"
                min="1"
                max="120"
                className={errors.age ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className={errors.gender ? "text-red-500" : ""}>
                Gender *
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
                onOpenChange={(open) => !open && handleBlur("gender")}
              >
                <SelectTrigger className={errors.gender ? "border-red-500 focus:ring-red-500" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosisDate" className={errors.diagnosisDate ? "text-red-500" : ""}>
                Diagnosis Date *
              </Label>
              <Input
                id="diagnosisDate"
                type="date"
                value={formData.diagnosisDate}
                onChange={(e) => handleChange("diagnosisDate", e.target.value)}
                onBlur={() => handleBlur("diagnosisDate")}
                className={errors.diagnosisDate ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.diagnosisDate && (
                <p className="text-sm text-red-500">{errors.diagnosisDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cancerType" className={errors.cancerType ? "text-red-500" : ""}>
                Cancer Type *
              </Label>
              <Select
                value={formData.cancerType}
                onValueChange={(value) => handleChange("cancerType", value)}
                onOpenChange={(open) => !open && handleBlur("cancerType")}
              >
                <SelectTrigger className={errors.cancerType ? "border-red-500 focus:ring-red-500" : ""}>
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
              {errors.cancerType && (
                <p className="text-sm text-red-500">{errors.cancerType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancerSubtype">Cancer Subtype</Label>
              <Input
                id="cancerSubtype"
                value={formData.cancerSubtype}
                onChange={(e) => handleChange("cancerSubtype", e.target.value)}
                placeholder="e.g., Non-Small Cell"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage" className={errors.stage ? "text-red-500" : ""}>
              Stage *
            </Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => handleChange("stage", value)}
              onOpenChange={(open) => !open && handleBlur("stage")}
            >
              <SelectTrigger className={errors.stage ? "border-red-500 focus:ring-red-500" : ""}>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stage I">Stage I</SelectItem>
                <SelectItem value="Stage II">Stage II</SelectItem>
                <SelectItem value="Stage III">Stage III</SelectItem>
                <SelectItem value="Stage IV">Stage IV</SelectItem>
              </SelectContent>
            </Select>
            {errors.stage && (
              <p className="text-sm text-red-500">{errors.stage}</p>
            )}
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


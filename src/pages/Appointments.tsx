import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Edit,
  Trash2,
  Video,
  Building2
} from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

const doctors = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Oncology" },
  { id: 2, name: "Dr. Michael Rodriguez", specialty: "Oncology" },
  { id: 3, name: "Dr. Emily Watson", specialty: "Radiation Oncology" },
];

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [apptType, setApptType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || apt.status === filterStatus;
    const matchesDoctor = filterDoctor === "All" || apt.doctor === filterDoctor;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const upcomingAppointments = filteredAppointments.filter(apt => apt.status === "Scheduled");
  const completedAppointments = filteredAppointments.filter(apt => apt.status === "Completed");
  const cancelledAppointments = filteredAppointments.filter(apt => apt.status === "Cancelled");

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Scheduled":
        return <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1">Scheduled</Badge>;
      case "Completed":
        return <Badge className="bg-success/10 text-success border-success/30 px-3 py-1">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30 px-3 py-1">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "Treatment":
        return "from-success/20 via-success/10 to-transparent text-success";
      case "Follow-up":
        return "from-primary/20 via-primary/10 to-transparent text-primary";
      case "Consultation":
        return "from-warning/20 via-warning/10 to-transparent text-warning";
      default:
        return "from-primary/20 via-primary/10 to-transparent text-primary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "Treatment":
        return <Stethoscope className="h-5 w-5" />;
      case "Follow-up":
        return <CheckCircle2 className="h-5 w-5" />;
      case "Consultation":
        return <User className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const stats = {
    total: appointments.length,
    upcoming: upcomingAppointments.length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    completed: completedAppointments.length
  };

  useEffect(() => {
    let mounted = true;
    const pollMs = 10000;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp: any = await apiService.getAppointments();
        const list = resp?.appointments || resp?.data?.appointments || [];
        if (!mounted) return;
        const normalized = (list as any[]).map((a) => {
          const dt = a.appointment_date || a.date;
          const dateObj = dt ? new Date(dt) : null;
          const dateStr = dateObj ? dateObj.toISOString().split("T")[0] : "";
          const timeStr = dateObj
            ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";
          return {
            id: a.id,
            patientName: a.patient_name || a.patientName || "Patient",
            patientId: a.patient_id || a.patientId,
            patientAvatar:
              (a.patient_name || a.patientName || "P")
                .split(" ")
                .map((s: string) => s[0])
                .join("")
                .toUpperCase(),
            date: dateStr,
            time: timeStr,
            type: a.appointment_type || a.type || "Consultation",
            doctor: "Assigned Doctor",
            status: (a.status || "Scheduled")
              .replace("scheduled", "Scheduled")
              .replace("completed", "Completed")
              .replace("cancelled", "Cancelled"),
            notes: a.notes || "",
            location: "Clinic",
            duration: "30 min",
          };
        });
        setAppointments(normalized);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Unable to load appointments");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    const id = window.setInterval(load, pollMs);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  // Reload appointments from backend
  const reloadAppointments = async () => {
    try {
      setLoading(true);
      const resp: any = await apiService.getAppointments();
      const list = resp?.appointments || resp?.data?.appointments || [];
      const normalized = (list as any[]).map((a) => {
        const dt = a.appointment_date || a.date;
        const dateObj = dt ? new Date(dt) : null;
        const dateStr = dateObj ? dateObj.toISOString().split("T")[0] : "";
        const timeStr = dateObj
          ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "";
        return {
          id: a.id,
          patientName: a.patient_name || a.patientName || "Patient",
          patientId: a.patient_id || a.patientId,
          patientAvatar:
            (a.patient_name || a.patientName || "P")
              .split(" ")
              .map((s: string) => s[0])
              .join("")
              .toUpperCase(),
          date: dateStr,
          time: timeStr,
          type: a.appointment_type || a.type || "Consultation",
          doctor: "Assigned Doctor",
          status: (a.status || "Scheduled")
            .replace("scheduled", "Scheduled")
            .replace("completed", "Completed")
            .replace("cancelled", "Cancelled"),
          notes: a.notes || "",
          location: "Clinic",
          duration: "30 min",
        };
      });
      setAppointments(normalized);
    } catch (e: any) {
      setError(e?.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (apt: any) => {
    setSelectedAppointment(apt);
    // Parse date and time from appointment
    const dateStr = apt.date;
    const timeStr = apt.time;
    setDate(dateStr);
    setTime(timeStr);
    setApptType(apt.type || "");
    
    // Extract location from notes if available (format: "Location: ...")
    let notesText = apt.notes || "";
    let extractedLocation = "";
    if (notesText.includes("Location:")) {
      const parts = notesText.split("Location:");
      notesText = parts[0].trim();
      extractedLocation = parts[1]?.trim() || "";
    }
    setNotes(notesText);
    setLocation(extractedLocation || "");
    setEditDialogOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!selectedAppointment || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please fill in date and time.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);
      const isoDateTime = new Date(`${date}T${time}:00`).toISOString();

      const payload: any = {
        appointment_date: isoDateTime,
        appointment_type: apptType.toLowerCase() || "consultation",
        status: selectedAppointment.status.toLowerCase(),
        notes: `${notes || ""}\nLocation: ${location}`.trim(),
      };

      await apiService.updateAppointment(selectedAppointment.id, payload);
      
      toast({
        title: "Appointment updated",
        description: "The appointment has been updated successfully.",
      });

      setEditDialogOpen(false);
      setSelectedAppointment(null);
      reloadAppointments();
    } catch (error: any) {
      toast({
        title: "Failed to update appointment",
        description: error?.message || "Please check your backend connection.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (apt: any) => {
    setSelectedAppointment(apt);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setDeleting(true);
      await apiService.deleteAppointment(selectedAppointment.id);
      
      toast({
        title: "Appointment deleted",
        description: "The appointment has been deleted successfully.",
      });

      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
      reloadAppointments();
    } catch (error: any) {
      toast({
        title: "Failed to delete appointment",
        description: error?.message || "Please check your backend connection.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleJoinAppointment = (apt: any) => {
    // Generate a video call link (using a placeholder service)
    const videoLink = `https://meet.google.com/onco-${apt.id}-${apt.patientId}`;
    window.open(videoLink, '_blank');
    toast({
      title: "Joining video call",
      description: "Opening video call in a new window.",
    });
  };

  const handleCreateAppointment = async () => {
    if (!patientName || !doctorName || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please fill in patient, doctor, date and time.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const isoDateTime = new Date(`${date}T${time}:00`).toISOString();

      const payload = {
        // Backend needs a patient_id (we link to an existing demo patient id 1)
        patient_id: 1,
        appointment_date: isoDateTime,
        appointment_type: apptType || "consultation",
        status: "scheduled",
        notes: `${notes || ""}\nPatient: ${patientName}\nDoctor: ${doctorName}\nLocation: ${location}`.trim(),
      };

      const resp: any = await apiService.createAppointment(payload);
      const created = resp?.appointment || resp?.data?.appointment || payload;

      const newAppt = {
        id: created.id ?? appointments.length + 1,
        patientName,
        patientId: created.patient_id ?? 1,
        patientAvatar: patientName
          .split(" ")
          .map((s: string) => s[0])
          .join("")
          .toUpperCase(),
        date,
        time,
        type: apptType || "Consultation",
        doctor: doctorName,
        status: "Scheduled",
        notes,
        location,
        duration: "30 min",
      };

      toast({
        title: "Appointment scheduled",
        description: "The appointment has been created successfully.",
      });

      setDialogOpen(false);
      setPatientName("");
      setDoctorName("");
      setDate("");
      setTime("");
      setApptType("");
      setLocation("");
      setNotes("");
      reloadAppointments();
    } catch (error: any) {
      toast({
        title: "Failed to schedule appointment",
        description: error?.message || "Please check your backend connection.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-4">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">Scheduling System</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                    Appointments
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage patient appointments and schedules with ease
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn px-8 py-6">
                    <Plus className="h-5 w-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                    Schedule Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Schedule New Appointment</DialogTitle>
                    <DialogDescription className="text-base">
                      Create a new appointment for a patient
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Patient</Label>
                        <Input
                          placeholder="Patient name"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Doctor</Label>
                        <Select value={doctorName} onValueChange={setDoctorName}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map(doctor => (
                              <SelectItem key={doctor.id} value={doctor.name}>
                                {doctor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Date</Label>
                        <Input
                          type="date"
                          className="h-11"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Time</Label>
                        <Input
                          type="time"
                          className="h-11"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Appointment Type</Label>
                      <Select value={apptType} onValueChange={setApptType}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Treatment">Treatment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Location</Label>
                      <Input
                        placeholder="Room number or location"
                        className="h-11"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Notes</Label>
                      <Textarea
                        placeholder="Additional notes or instructions"
                        className="min-h-24"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full h-12 text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                      onClick={handleCreateAppointment}
                      disabled={submitting}
                    >
                      {submitting ? "Scheduling..." : "Schedule Appointment"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 border-b border-border/50 dark:border-slate-800 bg-muted/20 dark:bg-slate-900/20">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 dark:border-slate-700/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-muted-foreground mb-2">Total Appointments</p>
                <p className="text-3xl font-bold text-foreground">{loading ? "…" : stats.total}</p>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 dark:border-slate-700/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-muted-foreground mb-2">Upcoming</p>
                <p className="text-3xl font-bold text-primary">{loading ? "…" : stats.upcoming}</p>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 dark:border-slate-700/50 hover:border-success/50 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-muted-foreground mb-2">Today</p>
                <p className="text-3xl font-bold text-success">{loading ? "…" : stats.today}</p>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 dark:border-slate-700/50 hover:border-warning/50 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-muted-foreground mb-2">Completed</p>
                <p className="text-3xl font-bold text-warning">{loading ? "…" : stats.completed}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-6 bg-background dark:bg-slate-950">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search appointments by patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card/50 backdrop-blur-sm border-border/50"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full lg:w-[200px] h-12 bg-card/50 backdrop-blur-sm border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                <SelectTrigger className="w-full lg:w-[220px] h-12 bg-card/50 backdrop-blur-sm border-border/50">
                  <SelectValue placeholder="Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Doctors</SelectItem>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar View */}
              <Card className="lg:col-span-1 p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl border border-border/50 dark:border-slate-700/50 sticky top-24 self-start">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  Calendar
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg border border-border/50 dark:border-slate-700/50"
                />
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
                  </h4>
                  <div className="space-y-2">
                    {appointments
                      .filter(apt => apt.date === selectedDate?.toISOString().split('T')[0])
                      .map(apt => (
                        <div key={apt.id} className="p-3 border border-border/50 dark:border-slate-700/50 rounded-xl hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{apt.patientName}</p>
                            {getStatusBadge(apt.status)}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {apt.time} • {apt.duration}
                          </p>
                        </div>
                      ))}
                    {appointments.filter(apt => apt.date === selectedDate?.toISOString().split('T')[0]).length === 0 && (
                      <div className="p-6 text-center border border-dashed border-border/50 dark:border-slate-700/50 rounded-xl">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-muted-foreground">No appointments</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Appointments List */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="upcoming" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50 dark:bg-slate-900/50 p-1 rounded-xl h-auto">
                    <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3">
                      <span className="flex items-center gap-2">
                        Upcoming
                        <Badge className="bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs">{upcomingAppointments.length}</Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3">
                      <span className="flex items-center gap-2">
                        Completed
                        <Badge className="bg-success/10 text-success border-0 px-2 py-0.5 text-xs">{completedAppointments.length}</Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-lg transition-all duration-300 py-3">
                      <span className="flex items-center gap-2">
                        Cancelled
                        <Badge className="bg-destructive/10 text-destructive border-0 px-2 py-0.5 text-xs">{cancelledAppointments.length}</Badge>
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingAppointments.map(apt => (
                      <Card key={apt.id} className="p-6 bg-card/50 backdrop-blur-sm shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border border-border/50 dark:border-slate-700/50 group hover:-translate-y-1 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(apt.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                                {apt.patientAvatar}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{apt.patientName}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                                  <User className="h-4 w-4" />
                                  {apt.doctor}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={`${getTypeColor(apt.type)} border-0 px-3 py-1`}>
                                    {getTypeIcon(apt.type)}
                                    <span className="ml-2">{apt.type}</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {getStatusBadge(apt.status)}
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 rounded-xl bg-muted/30 dark:bg-slate-800/30">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-success flex-shrink-0" />
                              <span className="text-muted-foreground">{apt.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-warning flex-shrink-0" />
                              <span className="text-muted-foreground truncate">{apt.location.split(' - ')[1]}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground">{apt.duration}</span>
                            </div>
                          </div>

                          {apt.notes && (
                            <p className="text-sm text-muted-foreground mb-4 p-3 rounded-lg bg-muted/20 dark:bg-slate-800/20 border border-border/30 dark:border-slate-700/30">
                              {apt.notes}
                            </p>
                          )}

                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
                              onClick={() => handleEditClick(apt)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 hover:bg-success/10 hover:border-success/50 hover:text-success transition-all duration-300"
                              onClick={() => handleJoinAppointment(apt)}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-300"
                              onClick={() => handleDeleteClick(apt)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    {completedAppointments.map(apt => (
                      <Card key={apt.id} className="p-6 bg-card/50 backdrop-blur-sm shadow-lg border border-border/50 dark:border-slate-700/50 opacity-75 hover:opacity-100 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-success/10 dark:bg-success/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="h-6 w-6 text-success" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-foreground mb-1">{apt.patientName}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{apt.doctor}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  {new Date(apt.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {apt.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(apt.status)}
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="cancelled" className="space-y-4">
                    {cancelledAppointments.length === 0 ? (
                      <Card className="p-16 text-center bg-card/50 backdrop-blur-sm shadow-lg border border-border/50 dark:border-slate-700/50">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 dark:bg-slate-800/50 mb-6">
                          <XCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium text-foreground mb-2">No cancelled appointments</p>
                        <p className="text-muted-foreground">All appointments are on track</p>
                      </Card>
                    ) : (
                      cancelledAppointments.map(apt => (
                        <Card key={apt.id} className="p-6 bg-card/50 backdrop-blur-sm shadow-lg border border-border/50 dark:border-slate-700/50 opacity-75 hover:opacity-100 transition-all duration-300">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-xl bg-destructive/10 dark:bg-destructive/20 flex items-center justify-center flex-shrink-0">
                                <XCircle className="h-6 w-6 text-destructive" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-foreground mb-1">{apt.patientName}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{apt.doctor}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    {new Date(apt.date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {apt.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {getStatusBadge(apt.status)}
                          </div>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Edit Appointment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Appointment</DialogTitle>
            <DialogDescription className="text-base">
              Update appointment details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Date</Label>
                <Input
                  type="date"
                  className="h-11"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Time</Label>
                <Input
                  type="time"
                  className="h-11"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Appointment Type</Label>
              <Select value={apptType} onValueChange={setApptType}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Treatment">Treatment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Location</Label>
              <Input
                placeholder="Room number or location"
                className="h-11"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Notes</Label>
              <Textarea
                placeholder="Additional notes or instructions"
                className="min-h-24"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedAppointment(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                onClick={handleUpdateAppointment}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Appointment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment for {selectedAppointment?.patientName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAppointment}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
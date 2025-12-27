import { useState, useMemo, useEffect, useCallback } from "react";
import { PatientCard } from "./PatientCard";
import { SearchFilters } from "./SearchFilters";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";

export function PatientGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cancerType, setCancerType] = useState("All Types");
  const [riskLevel, setRiskLevel] = useState("All Levels");

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiService.getPatients();
      const data = (resp && (resp.patients || resp.data?.patients)) || [];
      setPatients(data as any[]);
    } catch (err: any) {
      setError(err?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchPatients();
    return () => { mounted = false; };
  }, [fetchPatients]);

  // Pagination
  const [page, setPage] = useState<number>(0);
  const pageSize = 8;

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const name = (patient.name || "").toString();
      // Search filter
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

      // Cancer type filter (backend uses snake_case)
      const pCancer = patient.cancer_type || patient.cancerType || "";
      const matchesCancerType = cancerType === "All Types" || pCancer === cancerType;

      // Risk level filter
      const score = Number(patient.risk_score ?? patient.riskScore ?? 0);
      let matchesRiskLevel = true;
      if (riskLevel === "Low Risk") matchesRiskLevel = score <= 50;
      else if (riskLevel === "Medium Risk") matchesRiskLevel = score > 50 && score <= 75;
      else if (riskLevel === "High Risk") matchesRiskLevel = score > 75;

      return matchesSearch && matchesCancerType && matchesRiskLevel;
    });
  }, [patients, searchQuery, cancerType, riskLevel]);

  // Reset page when filters change and current page would be out of range
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredPatients.length / pageSize) - 1);
    if (page > maxPage) setPage(0);
  }, [filteredPatients.length]);

  return (
    <section className="py-8">
      <div className="container">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cancerType={cancerType}
          setCancerType={setCancerType}
          riskLevel={riskLevel}
          setRiskLevel={setRiskLevel}
        />

        {/* Results count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading patients..." : error ? `Error: ${error}` : `Showing ${Math.min(pageSize, Math.max(0, filteredPatients.length - page * pageSize))} of ${filteredPatients.length} patients`}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchPatients()}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Patient Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {!loading && !error && filteredPatients.slice(page * pageSize, (page + 1) * pageSize).map((patient, index) => (
            <PatientCard
              key={patient.id}
              id={patient.id}
              name={patient.name}
              age={patient.age}
              cancerType={patient.cancer_type || patient.cancerType}
              cancerSubtype={patient.cancer_subtype || patient.cancerSubtype}
              riskScore={Math.round(Number(patient.risk_score ?? patient.riskScore ?? 0))}
              avatarUrl={patient.avatar_url || patient.avatarUrl}
              index={index}
            />
          ))}
        </div>

        {/* Pagination controls + preview of next page first names */}
        {!loading && !error && filteredPatients.length > pageSize && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                Previous
              </Button>
              <Button size="sm" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * pageSize >= filteredPatients.length}>
                Next
              </Button>
              <div className="text-sm text-muted-foreground">Page {page + 1} of {Math.ceil(filteredPatients.length / pageSize)}</div>
            </div>

            <div className="text-sm text-muted-foreground">
              Next: {filteredPatients.slice((page + 1) * pageSize, (page + 1) * pageSize + 3).map((p) => p.name).join(', ') || '—'}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPatients.length === 0 && (
          <div className="mt-12 text-center py-12 bg-card rounded-xl border border-border/50">
            <p className="text-muted-foreground">
              No patients found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

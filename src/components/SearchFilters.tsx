import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const cancerTypes = [
  "All Types",
  "Lung Cancer",
  "Breast Cancer",
  "Colon Cancer",
  "Ovarian Cancer",
  "Prostate Cancer",
  "Leukemia",
];

const riskLevels = ["All Levels", "Low Risk", "Medium Risk", "High Risk"];

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cancerType: string;
  setCancerType: (type: string) => void;
  riskLevel: string;
  setRiskLevel: (level: string) => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  cancerType,
  setCancerType,
  riskLevel,
  setRiskLevel,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border/50 focus:border-primary/50"
        />
      </div>

      {/* Cancer Type Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-card">
            <Filter className="h-4 w-4" />
            {cancerType === "All Types" ? "Filter by Cancer Type" : cancerType}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {cancerTypes.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => setCancerType(type)}
              className={cancerType === type ? "bg-accent" : ""}
            >
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Risk Level Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-card">
            {riskLevel === "All Levels" ? "Risk Level" : riskLevel}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {riskLevels.map((level) => (
            <DropdownMenuItem
              key={level}
              onClick={() => setRiskLevel(level)}
              className={riskLevel === level ? "bg-accent" : ""}
            >
              {level}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

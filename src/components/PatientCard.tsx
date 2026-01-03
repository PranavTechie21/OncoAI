import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { HoverCard } from "./HoverCard";

interface PatientCardProps {
  id: number;
  name: string;
  age: number;
  cancerType: string;
  cancerSubtype?: string;
  riskScore: number;
  avatarUrl?: string;
  index: number;
}

function getRiskLevel(score: number): { label: string; variant: "low" | "medium" | "high" } {
  if (score <= 50) return { label: "Low", variant: "low" };
  if (score <= 75) return { label: "Medium", variant: "medium" };
  return { label: "High", variant: "high" };
}

function getRiskColor(score: number): string {
  if (score <= 50) return "bg-success";
  if (score <= 75) return "bg-warning";
  return "bg-destructive";
}

export function PatientCard({
  id,
  name,
  age,
  cancerType,
  cancerSubtype,
  riskScore,
  avatarUrl,
  index,
}: PatientCardProps) {
  const risk = getRiskLevel(riskScore);
  const riskColor = getRiskColor(riskScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Link to={`/patients/${id}`}>
        <HoverCard hoverScale={1.02}>
          <Card
            className="p-6 bg-card shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 border-border/50 dark:border-slate-700/50 hover:border-primary/30 dark:hover:border-primary/40 cursor-pointer group relative overflow-hidden"
          >
            {/* Animated background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/3 group-hover:to-primary/5 transition-all duration-500" />
            <div className="relative z-10">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-border group-hover:border-primary/30 transition-colors"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center border-2 border-border group-hover:border-primary/30 transition-colors">
              <User className="w-7 h-7 text-muted-foreground" />
            </div>
          )}
          {/* Online indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${riskColor} rounded-full border-2 border-card`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">Age: {age}</p>
          <div className="mt-1">
            <p className="text-sm font-medium text-foreground">{cancerType}</p>
            {cancerSubtype && (
              <p className="text-xs text-muted-foreground">{cancerSubtype}</p>
            )}
          </div>
        </div>
      </div>

      {/* Risk Score */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Risk Score:</span>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`
              ${risk.variant === "low" ? "risk-badge-low" : ""}
              ${risk.variant === "medium" ? "risk-badge-medium" : ""}
              ${risk.variant === "high" ? "risk-badge-high" : ""}
              font-semibold
            `}
          >
            {riskScore}%
          </Badge>
        </div>
      </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${riskColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${riskScore}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
              />
            </div>
            </div>
          </Card>
        </HoverCard>
      </Link>
    </motion.div>
  );
}

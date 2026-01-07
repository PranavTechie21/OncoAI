import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "info";
  delay?: number;
}

const colorStyles = {
  primary: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    gradient: "from-blue-500/20 to-transparent",
    border: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
  },
  success: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    gradient: "from-emerald-500/20 to-transparent",
    border: "group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    gradient: "from-amber-500/20 to-transparent",
    border: "group-hover:border-amber-500/50",
    glow: "group-hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
  },
  info: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    gradient: "from-violet-500/20 to-transparent",
    border: "group-hover:border-violet-500/50",
    glow: "group-hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]",
  },
};

export function StatCard({ title, value, trend, icon: Icon, color, delay = 0 }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-blue-100/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)]",
        styles.border,
        styles.glow
      )}
    >
      <div
        className={cn(
          "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-3xl",
          styles.gradient
        )}
      />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-foreground dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-xl", styles.iconBg)}>
          <Icon className={cn("h-6 w-6", styles.iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="relative z-10 mt-4 flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}%
          </div>
          <span className="text-xs text-muted-foreground dark:text-slate-500">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";

export interface ActivityItem {
  id: string;
  message: string;
  time: string;
  status: "success" | "warning" | "info";
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-3xl border border-blue-100/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 backdrop-blur-xl h-full flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
    >
      <div className="mb-6 flex items-center gap-3 shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
          <Clock className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Activity</h3>
      </div>

      <div className="relative space-y-4 before:absolute before:left-[23px] before:top-2 before:h-[calc(100%-20px)] before:w-[2px] before:bg-slate-100 dark:before:bg-white/5 flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
        {activities.slice(0, 5).map((activity, index) => {
          let formattedTime = activity.time;
          try {
            const date = parseISO(activity.time);
            if (isValid(date)) {
              formattedTime = format(date, "MMM d, h:mm a");
            }
          } catch (e) {}

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="relative flex gap-5"
            >
              <div
                className={cn(
                  "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white dark:border-[#0A0F1C] transition-colors shadow-sm dark:shadow-none",
                  activity.status === "success" && "bg-emerald-500 text-white",
                  activity.status === "warning" && "bg-amber-500 text-white",
                  activity.status === "info" && "bg-blue-500 text-white"
                )}
              >
                {activity.status === "success" && <CheckCircle2 className="h-5 w-5" />}
                {activity.status === "warning" && <AlertCircle className="h-5 w-5" />}
                {activity.status === "info" && <Activity className="h-5 w-5" />}
              </div>
              
              <div className="flex-1 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">{activity.message}</p>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{formattedTime}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Users, ArrowUpRight, ArrowDownRight, Target, Calendar, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function TopPatients({ patients }: { patients: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-blue-100/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 backdrop-blur-xl h-full flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
    >
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Top Patients</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm" asChild>
          <Link to="/patients">View All</Link>
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-between min-h-0 gap-2">
        {patients.slice(0, 5).map((patient, idx) => (
          <Link key={idx} to={`/patients/${patient.id}`} className="block">
            <div className="group flex items-center justify-between rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-white uppercase">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors">{patient.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                      (patient.riskScore || 0) > 75 ? "bg-rose-500" :
                      (patient.riskScore || 0) > 50 ? "bg-amber-500" :
                      "bg-emerald-500"
                    }`} />
                    <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">{patient.status}</span>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg ${
                (patient.change || 0) > 0 ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}>
                {(patient.change || 0) > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(patient.change || 0)}%
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-blue-100/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 backdrop-blur-xl h-full flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
    >
      <div className="mb-6 flex items-center gap-3 shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400">
          <Target className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <Button variant="outline" className="h-full w-full flex-col gap-5 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-primary dark:hover:text-white hover:border-primary/20 dark:hover:border-white/20 transition-all group shadow-sm hover:shadow-md dark:shadow-none" asChild>
          <Link to="/patients">
            <div className="p-5 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors ring-1 ring-blue-500/20 group-hover:ring-blue-500/40 group-hover:scale-110 duration-300">
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-bold text-xl tracking-wide">Patients</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-full w-full flex-col gap-5 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-primary dark:hover:text-white hover:border-primary/20 dark:hover:border-white/20 transition-all group shadow-sm hover:shadow-md dark:shadow-none" asChild>
          <Link to="/recommendations">
            <div className="p-5 rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors ring-1 ring-purple-500/20 group-hover:ring-purple-500/40 group-hover:scale-110 duration-300">
              <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-bold text-xl tracking-wide">AI Plans</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-full w-full flex-col gap-5 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-primary dark:hover:text-white hover:border-primary/20 dark:hover:border-white/20 transition-all group shadow-sm hover:shadow-md dark:shadow-none" asChild>
          <Link to="/reports">
            <div className="p-5 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40 group-hover:scale-110 duration-300">
              <Activity className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-bold text-xl tracking-wide">Reports</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-full w-full flex-col gap-5 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-primary dark:hover:text-white hover:border-primary/20 dark:hover:border-white/20 transition-all group shadow-sm hover:shadow-md dark:shadow-none" asChild>
          <Link to="/appointments">
            <div className="p-5 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors ring-1 ring-amber-500/20 group-hover:ring-amber-500/40 group-hover:scale-110 duration-300">
              <Calendar className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="font-bold text-xl tracking-wide">Schedule</span>
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

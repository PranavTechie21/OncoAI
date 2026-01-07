import { motion } from "framer-motion";
import { Sparkles, Brain, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Insight {
  id: string;
  type: "prediction" | "alert" | "recommendation";
  content: string;
  confidence?: number;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "prediction",
    content: "Patient #482 showing 85% probability of positive response to Immunotherapy based on recent biomarkers.",
    confidence: 85,
  },
  {
    id: "2",
    type: "alert",
    content: "Unusual spike in white blood cell count detected in 3 monitored patients.",
    confidence: 92,
  },
  {
    id: "3",
    type: "recommendation",
    content: "Consider adjusting dosage for Protocol A-12 due to renal function variations.",
    confidence: 78,
  },
];

export function AIInsights() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-100/50 dark:border-white/10 bg-white dark:bg-slate-950/50 dark:bg-gradient-to-b dark:from-violet-500/5 dark:to-purple-500/5 p-1 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      <div className="relative rounded-[20px] bg-slate-50/50 dark:bg-black/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20 dark:ring-violet-500/50">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              AI Insights
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time analysis powered by OncoAI</p>
          </div>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-4 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {insight.type === "prediction" && <Sparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />}
                  {insight.type === "alert" && <Zap className="h-4 w-4 text-amber-500 dark:text-amber-400" />}
                  {insight.type === "recommendation" && <Brain className="h-4 w-4 text-blue-500 dark:text-blue-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {insight.content}
                  </p>
                  {insight.confidence && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 w-24 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" 
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-violet-600 dark:text-violet-300">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button 
          variant="ghost" 
          className="mt-6 w-full justify-between text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 group"
          asChild
        >
          <Link to="/recommendations">
            View all insights
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

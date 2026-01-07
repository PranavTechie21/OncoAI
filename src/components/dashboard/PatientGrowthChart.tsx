import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

interface DataPoint {
  month: string;
  patients: number;
}

interface PatientGrowthChartProps {
  data: DataPoint[];
}

export function PatientGrowthChart({ data }: PatientGrowthChartProps) {
  // Calculate overall trend (last vs previous)
  const lastPoint = data[data.length - 1];
  const prevPoint = data[data.length - 2];
  let overallTrend = 0;
  
  if (lastPoint && prevPoint) {
    if (prevPoint.patients === 0) {
      overallTrend = lastPoint.patients > 0 ? 100 : 0;
    } else {
      overallTrend = ((lastPoint.patients - prevPoint.patients) / prevPoint.patients) * 100;
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      let formattedLabel = label;
      // Check if label is YYYY-MM-DD or YYYY-MM
      if (typeof label === 'string' && (label.includes('-') || label.includes('/'))) {
          try {
              const date = parseISO(label);
              if (isValid(date)) {
                  formattedLabel = format(date, "MMM d, yyyy");
              }
          } catch (e) {}
      }

      // Find current index to get previous data
      const currentIndex = data.findIndex(d => d.month === label);
      const previousData = currentIndex > 0 ? data[currentIndex - 1] : null;
      const currentValue = payload[0].value;
      let percentageChange = 0;

      if (previousData) {
        if (previousData.patients === 0) {
          percentageChange = currentValue > 0 ? 100 : 0;
        } else {
          percentageChange = ((currentValue - previousData.patients) / previousData.patients) * 100;
        }
      }

      return (
        <div className="rounded-xl border border-blue-100/50 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{formattedLabel}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">
              {currentValue}
            </span>
            {previousData && (
              <span className={`text-xs font-medium ${percentageChange >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">New patients enrolled</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative col-span-2 overflow-hidden rounded-3xl border border-blue-100/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Patient Growth</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly patient enrollment trends</p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg px-3 py-1 ${overallTrend >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">{overallTrend > 0 ? '+' : ''}{overallTrend.toFixed(1)}%</span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
              dy={10}
              tickFormatter={(value) => {
                if (typeof value === 'string' && value.includes('-')) {
                    try {
                        const date = parseISO(value);
                        if (isValid(date)) {
                            // If it's YYYY-MM, format as MMM
                            if (value.length === 7) return format(date, "MMM");
                            // If it's YYYY-MM-DD, format as MMM d
                            return format(date, "MMM d");
                        }
                    } catch (e) {}
                }
                return value;
              }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(148, 163, 184, 0.2)', strokeWidth: 2 }} />
            <Area
              type="monotone"
              dataKey="patients"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#colorPatients)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

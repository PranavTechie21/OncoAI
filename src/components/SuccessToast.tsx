import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Variant = "compact" | "large";

interface Props {
  name?: string;
  description?: string;
  variant?: Variant;
  duration?: number;
}

const SuccessToast: React.FC<Props> = ({ name, description, variant = "compact", duration = 4000 }) => {
  const [percent, setPercent] = useState<number>(100);

  useEffect(() => {
    let raf: number | null = null;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.max(0, 100 - (elapsed / duration) * 100);
      setPercent(p);
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [duration]);

  const containerClasses =
    variant === "large"
      ? "w-full max-w-3xl md:max-w-[900px] py-4 px-6"
      : "w-[420px] md:w-[520px] py-3 px-5";

  return (
    <div
      className={`flex items-start gap-4 ${containerClasses} rounded-xl shadow-xl overflow-hidden`}
      style={{ background: "linear-gradient(135deg,#10b981 0%,#059669 100%)", color: "white" }}
    >
      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 bg-white/20 rounded-full">
        <CheckCircle2 className="h-6 w-6 text-white" />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg md:text-xl font-semibold">Patient added successfully</div>
            {name && <div className="text-sm md:text-base opacity-90 mt-1">{name} has been added</div>}
            {description && <div className="text-sm opacity-80 mt-1">{description}</div>}
          </div>
        </div>

        <div className="mt-3 h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;

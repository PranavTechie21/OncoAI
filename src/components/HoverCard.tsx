import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
}

export function HoverCard({
  children,
  className = "",
  hoverScale = 1.05,
  hoverRotate = 0,
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: hoverScale,
        rotate: hoverRotate,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}



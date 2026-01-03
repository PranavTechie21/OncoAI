import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';

type Direction = 'horizontal' | 'vertical' | 'diagonal';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number; // seconds per cycle
  showBorder?: boolean;
  direction?: Direction;
  yoyo?: boolean;
  // control props
  isActive?: boolean; // keep glowing even when not hovered
  animateOnHover?: boolean; // glow on hover
  pauseOnHover?: boolean;
}

export default function GradientText({
  children,
  className = '',
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
  yoyo = true,
  isActive = false,
  animateOnHover = true,
  pauseOnHover = false,
}: GradientTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animatingRef = useRef(false);

  const animationDuration = Math.max(0.1, animationSpeed) * 1000;

  const isAnimating = Boolean(isActive || (animateOnHover && isHovered));

  useEffect(() => {
    animatingRef.current = isAnimating && !isPaused;
    if (!isAnimating || isPaused) {
      // reset so animation restarts from start when re-enabled
      lastTimeRef.current = null;
      elapsedRef.current = 0;
      setProgress(0);
    }
  }, [isAnimating, isPaused]);

  useEffect(() => {
    let raf = 0;

    const step = (time: number) => {
      if (!animatingRef.current) {
        raf = requestAnimationFrame(step);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        raf = requestAnimationFrame(step);
        return;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      elapsedRef.current += delta;

      if (yoyo) {
        const fullCycle = animationDuration * 2;
        const cycleTime = elapsedRef.current % fullCycle;
        const p = cycleTime < animationDuration
          ? (cycleTime / animationDuration) * 100
          : 100 - ((cycleTime - animationDuration) / animationDuration) * 100;
        setProgress(p);
      } else {
        const p = ((elapsedRef.current / animationDuration) * 100) % 100;
        setProgress(p);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animationDuration, yoyo]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';
  const gradientColors = [...colors, colors[0]].join(', ');

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',
    backgroundRepeat: 'repeat',
    backgroundPosition: direction === 'vertical' ? `50% ${progress}%` : `${progress}% 50%`,
  };

  return (
    <div
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium transition-shadow duration-500 overflow-hidden cursor-pointer ${showBorder ? 'py-1 px-2' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && (
        <div className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]" style={gradientStyle}>
          <div
            className="absolute bg-black rounded-[1.25rem] z-[-1]"
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}

      <div className="inline-block relative z-2 text-transparent bg-clip-text" style={{ ...gradientStyle, WebkitBackgroundClip: 'text' } as React.CSSProperties}>
        {children}
      </div>
    </div>
  );
}

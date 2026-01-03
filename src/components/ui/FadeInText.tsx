import { useEffect, useState, useRef, ReactNode } from 'react';

interface FadeInTextProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  once?: boolean;
}

export default function FadeInText({
  children,
  delay = 0,
  duration = 600,
  className = '',
  direction = 'up',
  once = true,
}: FadeInTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || (once && hasAnimated)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timer = setTimeout(() => {
              setIsVisible(true);
              if (once) setHasAnimated(true);
            }, delay);

            if (once) {
              observer.disconnect();
            }

            return () => clearTimeout(timer);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, once, hasAnimated]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translateY(20px)';
        case 'down':
          return 'translateY(-20px)';
        case 'left':
          return 'translateX(20px)';
        case 'right':
          return 'translateX(-20px)';
        default:
          return 'none';
      }
    }
    return 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}


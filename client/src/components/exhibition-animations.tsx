import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  className,
  once = true,
}: FadeInUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerChildVariants} className={className}>
      {children}
    </motion.div>
  );
}

interface PriceCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  formatNumber?: boolean;
}

export function PriceCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
  className,
  formatNumber = true,
}: PriceCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
    duration: duration * 1000,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  const formattedValue = formatNumber
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  y?: number;
}

export function HoverCard({
  children,
  className,
  scale = 1.02,
  y = -8,
}: HoverCardProps) {
  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      whileHover={{
        scale,
        y,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}

interface CheckmarkAnimationProps {
  className?: string;
  size?: number;
  delay?: number;
}

export function CheckmarkAnimation({
  className,
  size = 24,
  delay = 0,
}: CheckmarkAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay,
      }}
      className={cn("inline-flex", className)}
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
      >
        <Check className="h-6 w-6 text-primary" size={size} />
      </motion.div>
    </motion.div>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  animate = true,
}: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        "bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent",
        "bg-[length:200%_auto]",
        className
      )}
      animate={
        animate
          ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }
          : {}
      }
      transition={
        animate
          ? {
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }
          : {}
      }
      style={{
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </motion.span>
  );
}

interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function AnimatedListItem({
  children,
  index,
  className,
}: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PulseRingProps {
  children: ReactNode;
  className?: string;
}

export function PulseRing({ children, className }: PulseRingProps) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {children}
    </div>
  );
}

interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className,
}: SlideInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionOffset = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...directionOffset[direction] }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

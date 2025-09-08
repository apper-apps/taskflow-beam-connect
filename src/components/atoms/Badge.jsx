import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className,
  variant = "default",
  size = "md",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    secondary: "bg-gradient-to-r from-secondary/20 to-primary/20 text-primary border border-primary/20",
    accent: "bg-gradient-to-r from-accent to-yellow-500 text-white",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white",
    warning: "bg-gradient-to-r from-warning to-orange-500 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    outline: "border border-gray-300 text-gray-700 bg-transparent"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs font-medium",
    md: "px-3 py-1 text-sm font-medium",
    lg: "px-4 py-1.5 text-sm font-semibold"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
export default Badge;
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  variant = "default",
  size = "md",
  error = false,
  ...props 
}, ref) => {
  const variants = {
    default: "border-gray-300 bg-white focus:border-primary focus:ring-primary",
    outline: "border-2 border-gray-200 bg-transparent focus:border-primary focus:ring-0",
    filled: "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-4 py-3 text-lg"
  };

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full rounded-lg font-medium text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-1",
        variants[variant],
        sizes[size],
        error && "border-error focus:border-error focus:ring-error",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
export default Input;
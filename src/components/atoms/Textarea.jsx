import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className,
  rows = 3,
  variant = "default",
  error = false,
  ...props 
}, ref) => {
  const variants = {
    default: "border-gray-300 bg-white focus:border-primary focus:ring-primary",
    outline: "border-2 border-gray-200 bg-transparent focus:border-primary focus:ring-0",
    filled: "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary"
  };

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full px-4 py-2 rounded-lg font-medium text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-1 resize-vertical",
        variants[variant],
        error && "border-error focus:border-error focus:ring-error",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
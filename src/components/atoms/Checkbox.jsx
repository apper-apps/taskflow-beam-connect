import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className,
  size = "md",
  checked = false,
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn(
          "rounded border-2 border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 checkbox-animation cursor-pointer transition-all duration-200",
          sizes[size],
          className
        )}
        {...props}
      />
      {checked && (
        <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none", sizes[size])}>
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
export default Checkbox;
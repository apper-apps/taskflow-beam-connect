import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className,
  children,
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
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-2 pr-10 rounded-lg font-medium text-gray-900 transition-all duration-200 focus:outline-none focus:ring-1 appearance-none cursor-pointer",
          variants[variant],
          error && "border-error focus:border-error focus:ring-error",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
});

Select.displayName = "Select";
export default Select;
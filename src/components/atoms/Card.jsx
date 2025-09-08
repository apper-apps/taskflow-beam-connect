import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className,
  variant = "default",
  hover = true,
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    elevated: "bg-white shadow-lg border-0",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
export default Card;
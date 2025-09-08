import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  percentage = 0,
  size = "lg",
  strokeWidth = 8,
  className,
  children,
  ...props 
}) => {
  const sizes = {
    sm: { width: 60, height: 60 },
    md: { width: 80, height: 80 },
    lg: { width: 120, height: 120 },
    xl: { width: 160, height: 160 }
  };

  const { width, height } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} {...props}>
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="transparent"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B21B6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Complete</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
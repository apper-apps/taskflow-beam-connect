import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your tasks. Please try again.",
  onRetry,
  className,
  ...props 
}) => {
  return (
    <Card className={cn("max-w-md mx-auto", className)} variant="elevated" hover={false} {...props}>
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        
        <div className="space-y-3">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="primary" 
              className="w-full"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Error;
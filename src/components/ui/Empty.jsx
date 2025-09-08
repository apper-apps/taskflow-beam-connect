import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No tasks yet",
  message = "Create your first task to get started with organizing your day.",
  actionLabel = "Add Task",
  onAction,
  icon = "CheckSquare",
  className,
  ...props 
}) => {
  return (
    <Card className={cn("max-w-md mx-auto", className)} variant="gradient" hover={false} {...props}>
      <div className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={icon} className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        
        {onAction && (
          <Button 
            onClick={onAction} 
            variant="primary" 
            className="inline-flex items-center shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;
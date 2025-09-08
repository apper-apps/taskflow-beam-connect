import { cn } from "@/utils/cn";

const Loading = ({ 
  type = "skeleton",
  rows = 3,
  className,
  ...props 
}) => {
  if (type === "spinner") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)} {...props}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className={cn("space-y-4 p-6", className)} {...props}>
        {/* Task list skeleton */}
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton" style={{ width: `${Math.random() * 30 + 40}%` }}></div>
                </div>
                <div className="w-16 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full skeleton"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton w-16"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded skeleton w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Loading;
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";

const FilterButtons = ({ 
  filters,
  activeFilter,
  onFilterChange,
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)} {...props}>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "primary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "transition-all duration-200",
            activeFilter === filter.value && "shadow-lg scale-105"
          )}
        >
          {filter.label}
          {filter.count !== undefined && (
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold",
              activeFilter === filter.value 
                ? "bg-white/20 text-white" 
                : "bg-gray-200 text-gray-600"
            )}>
              {filter.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;